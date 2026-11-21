import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import type { Category, Paginated, Resource, ResourceQuery, ResourceType, Tag } from '../../types';
import { fetchResources } from '../../api/resources';
import { fetchCategories } from '../../api/categories';
import { fetchTags } from '../../api/tags';
import { getErrorMessage } from '../../api/client';
import { SearchBar } from '../ui/SearchBar';
import { CategoryFilter, FilterChip } from '../filters/CategoryFilter';
import { SECTION_LIST } from '../../lib/sections';
import { TagFilter } from '../filters/TagFilter';
import { ResourceControls } from '../filters/ResourceControls';
import { MasonryGrid } from './MasonryGrid';
import { ResourceCard } from '../resources/ResourceCard';
import { CardGridSkeleton } from '../ui/Skeletons';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Pagination } from '../ui/Pagination';
import { Button } from '../ui/Button';

interface ResourceExplorerProps {
  type?: ResourceType;
  showCategory?: boolean;
  showTypeFilter?: boolean;
  pageSize?: number;
}

const GRID = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export function ResourceExplorer({
  type,
  showCategory = true,
  showTypeFilter = false,
  pageSize = 12,
}: ResourceExplorerProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? undefined;
  const tag = searchParams.get('tag') ?? undefined;
  const featured = searchParams.get('featured') === 'true';
  const sort = (searchParams.get('sort') as NonNullable<ResourceQuery['sort']>) ?? 'newest';
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const typeParam = searchParams.get('type') ?? undefined;
  const effectiveType = showTypeFilter ? typeParam : type;

  const [data, setData] = useState<Paginated<Resource> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    (patch: Record<string, string | undefined>, resetPage = true) => {
      const next = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === '') next.delete(key);
        else next.set(key, value);
      }
      if (resetPage) next.delete('page');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: ResourceQuery = {
        page,
        limit: pageSize,
        q,
        category,
        tag,
        ...(featured ? { featured: true } : {}),
        sort,
        type: effectiveType,
      };
      const result = await fetchResources(query);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, q, category, tag, featured, sort, effectiveType]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let active = true;
    fetchCategories(type ? { type } : {})
      .then((c) => active && setCategories(c))
      .catch(() => active && setCategories([]));
    fetchTags()
      .then((t) => active && setTags(t))
      .catch(() => active && setTags([]));
    return () => {
      active = false;
    };
  }, [type]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const activeFilters = useMemo(() => {
    const chips: { label: string; onClear: () => void }[] = [];
    if (q) chips.push({ label: `"${q}"`, onClear: () => update({ q: undefined }) });
    if (category) {
      const c = categories.find((x) => x.slug === category);
      if (c) chips.push({ label: c.name, onClear: () => update({ category: undefined }) });
    }
    if (tag) chips.push({ label: `#${tag}`, onClear: () => update({ tag: undefined }) });
    if (featured) chips.push({ label: "Tanlangan", onClear: () => update({ featured: undefined }) });
    if (showTypeFilter && typeParam) {
      chips.push({ label: `Turi: ${typeParam}`, onClear: () => update({ type: undefined }) });
    }
    return chips;
  }, [q, category, tag, featured, typeParam, showTypeFilter, categories, update]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar
          value={q}
          onChange={(value) => update({ q: value || undefined })}
          placeholder="Sarlavha, tavsif, kategoriya yoki teg bo'yicha qidiring..."
          className="lg:max-w-md lg:flex-1"
        />
        <ResourceControls
          sort={sort}
          onSort={(s) => update({ sort: s === 'newest' ? undefined : s })}
          featured={featured}
          onFeatured={(f) => update({ featured: f ? 'true' : undefined })}
        />
      </div>

      {showTypeFilter && (
        <div data-section={typeParam ?? 'website'} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1">
          <FilterChip active={!typeParam} onClick={() => update({ type: undefined })}>
            Barcha turlar
          </FilterChip>
          {SECTION_LIST.map((s) => (
            <FilterChip
              key={s.type}
              active={typeParam === s.type}
              onClick={() => update({ type: typeParam === s.type ? undefined : s.type })}
            >
              {s.label}
            </FilterChip>
          ))}
        </div>
      )}

      {showCategory && (
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={(slug) => update({ category: slug })}
        />
      )}

      <TagFilter tags={tags} value={tag} onChange={(slug) => update({ tag: slug })} />

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-content-subtle">Active</span>
          {activeFilters.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={f.onClear}
              className="chip hover:border-red-500/50 hover:text-red-500"
            >
              {f.label} ×
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
          >
              Hammasini tozalash
          </Button>
        </div>
      )}

      <div className="min-h-[16rem]">
        {loading ? (
          <CardGridSkeleton count={pageSize > 8 ? 8 : pageSize} className={GRID} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void load()} />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={SearchX}
             title="Resurslar topilmadi"
             description="Boshqa so'rov bilan izlang yoki filtrlarni tozalab hammasini ko'ring."
             action={
               <Button variant="secondary" onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}>
                 Filtrlarni tozalash
               </Button>
             }
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-content-muted">
              {data.meta.total} ta natija
            </p>
            {effectiveType ? (
              <div className={GRID}>
                {data.items.map((resource, i) => (
                  <ResourceCard key={resource.id} resource={resource} index={i} />
                ))}
              </div>
            ) : (
              <MasonryGrid>
                {data.items.map((resource, i) => (
                  <ResourceCard key={resource.id} resource={resource} index={i} />
                ))}
              </MasonryGrid>
            )}
          </>
        )}
      </div>

      {data && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onChange={(p) => update({ page: String(p) }, false)}
        />
      )}
    </div>
  );
}
