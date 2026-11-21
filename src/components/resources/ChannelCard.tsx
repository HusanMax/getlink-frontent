import { useState } from 'react';
import { Play, Star } from 'lucide-react';
import type { Resource } from '../../types';
import { cn } from '../../lib/cn';

function channelHandle(url: string): string {
  try {
    const { pathname } = new URL(url);
    const part = pathname.split('/').filter(Boolean)[0];
    if (part?.startsWith('@')) return part;
    return part ? `/${part}` : 'youtube.com';
  } catch {
    return url;
  }
}

export function ChannelCard({ resource, index = 0 }: { resource: Resource; index?: number }) {
  const [failed, setFailed] = useState(false);
  const showImage = resource.image && !failed;
  const initial = resource.title.trim().charAt(0).toUpperCase();

  return (
    <article
      data-section="youtube"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className="card card-hover group relative flex animate-in flex-col overflow-hidden"
    >
      {resource.featured && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-500">
          <Star className="h-3 w-3 fill-current" aria-hidden />
          Tanlangan
        </span>
      )}

      {/* Round avatar */}
      <div className="flex justify-center pt-7">
        <div className="h-20 w-20 overflow-hidden rounded-full bg-surface-3 shadow-md ring-2 ring-red-500/60 ring-offset-2 ring-offset-surface-2 transition-transform duration-300 group-hover:scale-105">
          {showImage ? (
            <img
              src={resource.image ?? undefined}
              alt={resource.title}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-600 to-orange-500 text-2xl font-bold text-white">
              {initial}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pb-5 pt-3 text-center">
        <h3 className="text-base font-semibold leading-snug text-content">{resource.title}</h3>
        <p className="mt-0.5 text-xs text-content-subtle">{channelHandle(resource.url)}</p>

        {resource.category && (
          <span className="mt-2 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-500">
            {resource.category.name}
          </span>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-content-muted">
          {resource.description}
        </p>

        <div className="mt-auto w-full pt-4">
          <div className="mb-3 flex flex-wrap justify-center gap-1.5">
            {resource.tags.slice(0, 3).map((t) => (
              <span key={t.id} className="chip px-2 py-0.5 text-[11px]">
                #{t.slug}
              </span>
            ))}
          </div>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-red-600 text-sm font-semibold text-white',
              'transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500',
            )}
          >
            <Play className="h-4 w-4 fill-current" aria-hidden />
            Kanalga o'tish
          </a>
        </div>
      </div>
    </article>
  );
}
