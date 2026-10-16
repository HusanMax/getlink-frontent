import type { SectionMeta } from '../lib/sections';
import { ResourceExplorer } from '../components/resources/ResourceExplorer';

interface SectionPageProps {
  section: SectionMeta;
}

export function SectionPage({ section }: SectionPageProps) {
  const Icon = section.icon;

  return (
    <div data-section={section.type}>
      {/* Section hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: `radial-gradient(60% 80% at 20% 0%, rgb(var(--section)), transparent 70%)`,
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${section.gradient} text-white shadow-lg`}
            >
              <Icon className="h-7 w-7" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[rgb(var(--section))]">
                {section.tagline}
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-content sm:text-4xl">
                {section.label}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-pretty text-content-muted">{section.blurb}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ResourceExplorer type={section.type} showCategory />
      </div>
    </div>
  );
}
