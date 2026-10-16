import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Pencil,
  PlusCircle,
  Star,
  Trash2,
  PackageOpen,
} from 'lucide-react';
import type { Paginated, Resource, ResourceQuery } from '../../types';
import {
  deleteResource,
  fetchAdminResources,
  toggleResourceField,
} from '../../api/resources';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../app/hooks';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { PublishedBadge, TypeBadge } from '../../components/admin/StatusBadges';
import { SearchBar } from '../../components/ui/SearchBar';
import { LazyImage } from '../../components/ui/LazyImage';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { RESOURCE_TYPES } from '../../types';
import { formatDate } from '../../lib/format';
import { cn } from '../../lib/cn';

export function AdminResourcesPage() {
  const toast = useToast();

  const [data, setData] = useState<Paginated<Resource> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<'' | 'true' | 'false'>('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query: ResourceQuery = {
        page,
        limit: 10,
        q: q || undefined,
        type: type || undefined,
        sort: 'newest',
        ...(status !== '' ? { published: status === 'true' } : {}),
      };
      setData(await fetchAdminResources(query));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, q, type, status]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [q, type, status]);

  const handleToggle = async (resource: Resource, field: 'feature' | 'publish') => {
    setBusyId(resource.id);
    try {
      await toggleResourceField(resource.id, field);
      toast.success(
        field === 'feature'
          ? resource.featured
            ? "Tanlanganlardan olib tashlandi."
            : "Tanlangan deb belgilandi."
          : resource.published
            ? "Resurs nashrdan olindi."
            : "Resurs nashr etildi.",
      );
      void load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteResource(toDelete.id);
      toast.success("Resurs muvaffaqiyatli o'chirildi.");
      setToDelete(null);
      void load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Resource>[] = [
    {
      key: 'image',
      header: '',
      headerClassName: 'w-16',
      render: (r) => (
        <LazyImage
          src={r.image}
          alt={r.title}
          wrapperClassName="h-11 w-16 rounded-lg"
          className="h-full w-full"
        />
      ),
    },
    {
      key: 'title',
      header: 'Sarlavha',
      render: (r) => (
        <div className="max-w-xs">
          <p className="line-clamp-1 font-medium text-content">{r.title}</p>
          <p className="line-clamp-1 text-xs text-content-subtle">{r.category?.name ?? "Kategoriya yo'q"}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Turi', render: (r) => <TypeBadge type={r.type} /> },
    {
      key: 'published',
      header: 'Holat',
      render: (r) => (
        <button
          type="button"
          onClick={() => void handleToggle(r, 'publish')}
          disabled={busyId === r.id}
          title={r.published ? "Nashrdan olish" : 'Nashr etish'}
          className="transition-opacity hover:opacity-80 disabled:opacity-50"
        >
          <PublishedBadge published={r.published} />
        </button>
      ),
    },
    {
      key: 'featured',
      header: 'Tanlangan',
      render: (r) => (
        <button
          type="button"
          onClick={() => void handleToggle(r, 'feature')}
          disabled={busyId === r.id}
          aria-label={r.featured ? "Tanlanganlardan olib tashlash" : 'Tanlash'}
          title={r.featured ? "Tanlanganlardan olib tashlash" : 'Tanlash'}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-50',
            r.featured
              ? 'border-transparent bg-amber-500/15 text-amber-500'
              : 'border-border text-content-subtle hover:text-content',
          )}
        >
          <Star className={cn('h-4 w-4', r.featured && 'fill-current')} />
        </button>
      ),
    },
    {
      key: 'createdAt',
      header: 'Yaratilgan',
      render: (r) => <span className="whitespace-nowrap text-content-muted">{formatDate(r.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'Amallar',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/resources/${r.id}/edit`}
            className="btn btn-ghost btn-sm"
            aria-label={`${r.title}ni tahrirlash`}
            title="Tahrirlash"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => void handleToggle(r, 'publish')}
            className="btn btn-ghost btn-sm"
            aria-label={r.published ? `${r.title}ni nashrdan olish` : `${r.title}ni nashr etish`}
            title={r.published ? "Nashrdan olish" : 'Nashr etish'}
          >
            {r.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setToDelete(r)}
            className="btn btn-ghost btn-sm hover:text-red-500"
            aria-label={`${r.title}ni o'chirish`}
            title="O'chirish"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Barcha resurslar"
        description="Kutubxonangizdagi barcha resurslarni boshqaring — tahrirlang, nashr eting, tanlang yoki o'chiring."
        actions={
          <Link to="/admin/resources/create" className="btn btn-primary btn-md">
            <PlusCircle className="h-4 w-4" aria-hidden />
            Resurs qo'shish
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchBar value={q} onChange={setQ} placeholder="Resurslarni qidirish…" className="lg:max-w-sm lg:flex-1" />
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Turi bo'yicha filtrlash"
            className="input h-10 w-auto cursor-pointer"
          >
            <option value="">Barcha turlar</option>
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as '' | 'true' | 'false')}
            aria-label="Holati bo'yicha filtrlash"
            className="input h-10 w-auto cursor-pointer"
          >
            <option value="">Barcha holatlar</option>
            <option value="true">Chop etilgan</option>
            <option value="false">Qoralamalar</option>
          </select>
        </div>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={data?.items ?? []}
            rowKey={(r) => r.id}
            loading={loading}
            skeletonRows={6}
            empty={
              <EmptyState
                icon={PackageOpen}
                title="Resurslar topilmadi"
                description={
                  q || type || status
                    ? "Filtrlaringizga mos resurslar topilmadi. Ularni tozalab ko'ring."
                    : "Kutubxonangiz bo'sh. Boshlash uchun birinchi resursingizni qo'shing."
                }
                action={
                  <Link to="/admin/resources/create" className="btn btn-primary btn-sm">
                    <PlusCircle className="h-4 w-4" /> Resurs qo'shish
                  </Link>
                }
              />
            }
          />
          {data && (
            <div className="mt-4">
              <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onChange={setPage} />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Resursni o'chirish"
        message={`"${toDelete?.title}" butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.`}
        confirmLabel="O'chirish"
        isLoading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
