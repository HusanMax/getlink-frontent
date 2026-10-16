import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'section';

const tones: Record<Tone, string> = {
  neutral: 'border-border bg-surface-3 text-content-muted',
  brand: 'border-transparent bg-brand/15 text-brand',
  success: 'border-transparent bg-emerald-500/15 text-emerald-500',
  warning: 'border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400',
  danger: 'border-transparent bg-red-500/15 text-red-500',
  section:
    'border-transparent bg-[rgb(var(--section)/0.15)] text-[rgb(var(--section))]',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = 'neutral', ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
});
