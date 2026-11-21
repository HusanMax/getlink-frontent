import { Play, Youtube } from 'lucide-react';
import { SECTIONS } from '../lib/sections';
import { ResourceExplorer } from '../components/resources/ResourceExplorer';

export function YouTubePage() {
  const section = SECTIONS.youtube;

  return (
    <div data-section="youtube">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'radial-gradient(60% 90% at 15% 0%, rgb(var(--section)), transparent 70%), radial-gradient(40% 70% at 90% 100%, rgb(var(--section-2)), transparent 70%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg">
                <Play className="h-6 w-6 fill-current" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
                  {section.tagline}
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-content sm:text-4xl">
                  {section.label} <span className="text-red-500">kanallari</span>
                </h1>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-pretty text-content-muted">{section.blurb}</p>
          </div>
          <Youtube className="hidden h-28 w-28 shrink-0 text-red-600/25 md:block" aria-hidden />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ResourceExplorer type="youtube" showCategory />
      </div>
    </div>
  );
}
