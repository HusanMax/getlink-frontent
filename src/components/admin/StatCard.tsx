import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  tone?: 'brand' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet';
}

const tones = {
  brand: 'bg-brand/15 text-brand',
  emerald: 'bg-emerald-500/15 text-emerald-500',
  amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-500/15 text-rose-500',
  sky: 'bg-sky-500/15 text-sky-500',
  violet: 'bg-violet-500/15 text-violet-500',
} as const;

export function StatCard({ label, value, icon: Icon, hint, tone = 'brand' }: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-content-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-content">{value}</p>
          {hint && <p className="mt-1 text-xs text-content-subtle">{hint}</p>}
        </div>
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tones[tone])}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </div>
  );
}
