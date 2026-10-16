import { ArrowUpDown, Star } from 'lucide-react';
import type { ResourceQuery } from '../../types';
import { cn } from '../../lib/cn';

interface ControlsProps {
  sort: NonNullable<ResourceQuery['sort']>;
  onSort: (sort: NonNullable<ResourceQuery['sort']>) => void;
  featured: boolean;
  onFeatured: (featured: boolean) => void;
}

export function ResourceControls({ sort, onSort, featured, onFeatured }: ControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onFeatured(!featured)}
        aria-pressed={featured}
        className={cn(
          'inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors',
          featured
            ? 'border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400'
            : 'border-border bg-surface-2 text-content-muted hover:text-content',
        )}
      >
        <Star className={cn('h-4 w-4', featured && 'fill-current')} aria-hidden />
        Tanlangan
      </button>

      <div className="relative">
        <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle" />
        <select
          value={sort}
          onChange={(e) => onSort(e.target.value as NonNullable<ResourceQuery['sort']>)}
          aria-label="Resurslarni saralash"
          className="input h-10 cursor-pointer pl-9 pr-8"
        >
          <option value="newest">Yangi</option>
          <option value="oldest">Eski</option>
          <option value="title">Sarlavha A–Z</option>
          <option value="featured">Avval tanlanganlar</option>
        </select>
      </div>
    </div>
  );
}
