import { Hash } from 'lucide-react';
import type { Tag } from '../../types';
import { FilterChip } from './CategoryFilter';

interface TagFilterProps {
  tags: Tag[];
  value?: string;
  onChange: (slug?: string) => void;
  max?: number;
}

export function TagFilter({ tags, value, onChange, max = 14 }: TagFilterProps) {
  if (!tags.length) return null;
  const visible = tags.slice(0, max);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-content-subtle">
        <Hash className="h-3.5 w-3.5" /> Teglar
      </span>
      {visible.map((t) => (
        <FilterChip
          key={t.id}
          active={value === t.slug}
          onClick={() => onChange(value === t.slug ? undefined : t.slug)}
          className="px-3 py-1 text-xs"
        >
          {t.name}
        </FilterChip>
      ))}
    </div>
  );
}
