import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { SectionMeta } from '../../lib/sections';
import { formatCount } from '../../lib/format';

export function TypeCard({ section, count }: { section: SectionMeta; count?: number }) {
  const Icon = section.icon;
  return (
    <Link
      to={section.path}
      data-section={section.type}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface-2 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgb(var(--section)/0.5)] hover:shadow-card-hover"
    >
      <div
        className={`pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${section.gradient} opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-30`}
        aria-hidden
      />
      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${section.gradient} text-white shadow-sm`}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        {typeof count === 'number' && (
          <span className="rounded-full bg-surface-3 px-2.5 py-1 text-xs font-semibold text-content-muted">
            {formatCount(count)}
          </span>
        )}
      </div>
      <h3 className="relative mt-4 font-semibold text-content">{section.label}</h3>
      <p className="relative mt-1 text-sm text-content-muted">{section.tagline}</p>
      <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-[rgb(var(--section))] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Koʻrish <ArrowRight className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}
