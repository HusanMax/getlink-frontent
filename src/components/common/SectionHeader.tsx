import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SectionHeaderProps {
  icon?: LucideIcon;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  count?: number;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  count,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--section))]">
            {Icon && <Icon className="h-4 w-4" aria-hidden />}
            {eyebrow}
          </div>
        )}
        <h2 className="flex items-baseline gap-3 text-2xl font-semibold text-content sm:text-3xl">
          {title}
          {typeof count === 'number' && (
            <span className="text-base font-normal text-content-subtle">{count}</span>
          )}
        </h2>
        {subtitle && <p className="mt-2 text-sm text-content-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
