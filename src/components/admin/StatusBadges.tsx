import { Eye, EyeOff, Star } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <Badge tone={published ? 'success' : 'neutral'}>
      <span className={cn('h-1.5 w-1.5 rounded-full', published ? 'bg-emerald-500' : 'bg-content-subtle')} />
      {published ? 'Chop etilgan' : 'Qoralama'}
    </Badge>
  );
}

export function FeaturedBadge({ featured }: { featured: boolean }) {
  if (!featured) {
    return <span className="text-xs text-content-subtle">—</span>;
  }
  return (
    <Badge tone="warning">
      <Star className="h-3 w-3 fill-current" aria-hidden />
      Tanlangan
    </Badge>
  );
}

export function TypeBadge({ type }: { type: string }) {
  return (
    <span data-section={type} className="inline-flex">
      <Badge tone="section">{type}</Badge>
    </span>
  );
}

export function PublishedIcon({ published }: { published: boolean }) {
  return published ? (
    <Eye className="h-4 w-4 text-emerald-500" aria-label="Chop etilgan" />
  ) : (
    <EyeOff className="h-4 w-4 text-content-subtle" aria-label="Qoralama" />
  );
}
