import { useState } from 'react';
import { ArrowUpRight, Quote, Star, Youtube as YoutubeIcon, Send } from 'lucide-react';
import type { Resource } from '../../types';
import { sectionByType } from '../../lib/sections';
import { getReason, hostname } from '../../lib/format';
import { LazyImage } from '../ui/LazyImage';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { cn } from '../../lib/cn';

interface ResourceCardProps {
  resource: Resource;
  index?: number;
}

export function ResourceCard({ resource, index = 0 }: ResourceCardProps) {
  const section = sectionByType(resource.type);
  const reason = getReason(resource);
  const isBook = resource.type === 'book';
  const isMovie = resource.type === 'movie';
  const hasDetails = isBook || isMovie;
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
    <article
      data-section={resource.type}
      {...(hasDetails
        ? {
            role: 'button',
            tabIndex: 0,
            onClick: () => setDetailsOpen(true),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setDetailsOpen(true);
              }
            },
          }
        : {})}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={cn(
        'card card-hover group flex animate-in flex-col overflow-hidden',
        hasDetails && 'cursor-pointer',
      )}
    >
      {/* Media */}
      <div className="relative">
        <LazyImage
          src={resource.image}
          alt={resource.title}
          wrapperClassName={cn('w-full', hasDetails ? 'aspect-[2/3]' : 'h-44')}
          fit={hasDetails ? 'contain' : 'cover'}
          className="transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent"
          aria-hidden
        />

        {/* type-specific overlays */}
        {resource.type === 'youtube' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg backdrop-blur transition-transform duration-300 group-hover:scale-110">
              <YoutubeIcon className="h-6 w-6" aria-hidden />
            </span>
          </div>
        )}
        {resource.type === 'telegram' && (
          <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg">
            <Send className="h-4 w-4" aria-hidden />
          </span>
        )}

        {/* top-left badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {resource.category && (
            <span className="rounded-full bg-black/75 shadow-md backdrop-blur-sm">
              <Badge tone="section">{resource.category.name}</Badge>
            </span>
          )}
          {resource.featured && (
            <span className="rounded-full bg-black/75 shadow-md backdrop-blur-sm">
              <Badge tone="warning">
                <Star className="h-3 w-3 fill-current" aria-hidden />
                Tanlangan
              </Badge>
            </span>
          )}
        </div>

        {/* bottom meta */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-xs text-white/90">
          <span className="inline-flex items-center gap-1.5">
            <section.icon className="h-3.5 w-3.5" aria-hidden />
            {section.label.replace(/s$/, '')}
          </span>
          {isMovie && resource.year && <span className="font-medium">{resource.year}</span>}
          {isBook && resource.year && <span className="font-medium">{resource.year}</span>}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className={cn(
            'text-base font-semibold leading-snug text-content',
            isBook && 'font-serif text-lg',
          )}
        >
          {resource.title}
        </h3>

        {isBook && resource.author && (
          <p className="mt-0.5 font-serif text-sm italic text-content-muted">{resource.author}</p>
        )}
        {!isBook && (
          <p className="mt-0.5 truncate text-xs text-content-subtle">{hostname(resource.url)}</p>
        )}

        {isBook ? (
          <>
            {resource.description && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-content-muted">
                {resource.description}
              </p>
            )}
            {reason && (
              <blockquote className="mt-3 flex gap-2 rounded-lg border-l-2 border-[rgb(var(--section)/0.6)] bg-surface-3/60 py-2 pl-3 pr-2">
                <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[rgb(var(--section))]" aria-hidden />
                <p className="line-clamp-2 text-[13px] italic leading-relaxed text-content-muted">{reason}</p>
              </blockquote>
            )}
          </>
        ) : reason ? (
          <blockquote className="mt-3 flex gap-2 rounded-lg border-l-2 border-[rgb(var(--section)/0.6)] bg-surface-3/60 py-2 pl-3 pr-2">
            <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[rgb(var(--section))]" aria-hidden />
            <p className="line-clamp-3 text-[13px] italic leading-relaxed text-content-muted">{reason}</p>
          </blockquote>
        ) : (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-content-muted">
            {resource.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="mb-3 flex flex-wrap gap-1.5">
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
            onClick={(e) => e.stopPropagation()}
            className="btn btn-secondary btn-sm w-full group-hover:border-[rgb(var(--section)/0.6)] group-hover:text-[rgb(var(--section))]"
          >
            Ochish
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </a>
        </div>
      </div>
    </article>

    {hasDetails && (
      <Modal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={resource.title}
        description={isBook ? (resource.author ?? undefined) : undefined}
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
      >
        <div data-section={resource.type} className="space-y-4">
          <div className="flex gap-4">
            <LazyImage
              src={resource.image}
              alt={resource.title}
              wrapperClassName="aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-lg sm:w-36"
              fit="contain"
            />
            <div className="min-w-0 space-y-2 text-sm text-content-muted">
              <div className="flex flex-wrap gap-1.5">
                {resource.category && <Badge tone="section">{resource.category.name}</Badge>}
                {resource.year && <span className="chip px-2 py-0.5 text-[11px]">{resource.year}</span>}
              </div>
              {resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((t) => (
                    <span key={t.id} className="chip px-2 py-0.5 text-[11px]">#{t.slug}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {resource.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-content-muted">{resource.description}</p>
          )}
          {reason && (
            <blockquote className="flex gap-2 rounded-lg border-l-2 border-[rgb(var(--section)/0.6)] bg-surface-3/60 py-2 pl-3 pr-2">
              <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[rgb(var(--section))]" aria-hidden />
              <p className="whitespace-pre-line text-[13px] italic leading-relaxed text-content-muted">{reason}</p>
            </blockquote>
          )}
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
            Ochish
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </Modal>
    )}
    </>
  );
}
