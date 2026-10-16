import type { Category } from '../../types';
import { cn } from '../../lib/cn';

interface CategoryFilterProps {
  categories: Category[];
  value?: string;
  onChange: (slug?: string) => void;
  className?: string;
}

export function CategoryFilter({ categories, value, onChange, className }: CategoryFilterProps) {
  if (!categories.length) return null;

  return (
    <div className={cn('no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1', className)}>
      <FilterChip active={!value} onClick={() => onChange(undefined)}>
        Barchasi
      </FilterChip>
      {categories.map((c) => (
        <FilterChip key={c.id} active={value === c.slug} onClick={() => onChange(c.slug)}>
          {c.name}
          {typeof c.resourceCount === 'number' && (
            <span className="ml-1 text-[10px] opacity-60">{c.resourceCount}</span>
          )}
        </FilterChip>
      ))}
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
        active
          ? 'border-transparent bg-[rgb(var(--section)/0.9)] text-white shadow-sm'
          : 'border-border bg-surface-2 text-content-muted hover:border-[rgb(var(--section)/0.5)] hover:text-content',
        className,
      )}
    >
      {children}
    </button>
  );
}
