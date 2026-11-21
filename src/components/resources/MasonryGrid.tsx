import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface MasonryGridProps {
  children: ReactNode[];
  className?: string;
}

/**
 * Aralash balandlikdagi kartalar uchun masonry (ustunli) joylashuv:
 * har bir ustun o'z kartasi balandligicha to'ladi, bo'sh joy qolmaydi.
 */
export function MasonryGrid({ children, className }: MasonryGridProps) {
  return (
    <div className={cn('columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4', className)}>
      {children.map((child, i) => (
        <div key={i} className="mb-6 break-inside-avoid">
          {child}
        </div>
      ))}
    </div>
  );
}
