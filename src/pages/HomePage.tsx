import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Sparkles, TrendingUp } from 'lucide-react';
import type { AdminStats, Category, Resource } from '../types';
import { fetchResources } from '../api/resources';
import { fetchCategories } from '../api/categories';
import { fetchStats } from '../api/stats';
import { SECTION_LIST, SECTIONS } from '../lib/sections';
import { formatCount } from '../lib/format';
import { TypeCard } from '../components/common/TypeCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { ResourceCard } from '../components/resources/ResourceCard';
import { Button } from '../components/ui/Button';

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [featured, setFeatured] = useState<Resource[]>([]);
  const [latest, setLatest] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [s, f, l, c] = await Promise.all([
          fetchStats(),
          fetchResources({ featured: true, limit: 4, sort: 'featured' }),
          fetchResources({ limit: 8, sort: 'newest' }),
          fetchCategories(),
        ]);
        if (!active) return;
        setStats(s);
        setFeatured(f.items);
        setLatest(l.items);
        setCategories(c);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  const popular = categories.slice(0, 10);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_-10%,rgb(var(--brand)/0.22),transparent)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pt-28 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-content-muted backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden />
            Tanlangan resurs kutubxonasi
          </span>

          <h1 className="mt-6 text-balance bg-gradient-to-br from-content to-content-muted bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
            RESOURCE HUB
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-content-muted">
            Esda qoladigan foydali narsalar. Veb-saytlar, kanallar, hamjamiyatlar,
            kitoblar va filmlardan tanlangan toʻplam.
          </p>

          <form onSubmit={submit} className="mx-auto mt-8 max-w-xl" role="search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-content-subtle" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="React, AI, dizayn, psixologiya boʻyicha qidiring…"
                aria-label="Resurslarni qidirish"
                className="input h-14 rounded-2xl pl-12 pr-32 text-base shadow-card"
              />
              <Button type="submit" size="md" className="absolute right-2 top-1/2 -translate-y-1/2">
                Qidirish
              </Button>
            </div>
          </form>

          {stats && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-content-muted">
              <span>
                <strong className="text-content">{stats.resources.total}</strong> resurs
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span>
                <strong className="text-content">{stats.categories}</strong> kategoriya
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span>
                <strong className="text-content">{stats.tags}</strong> teg
              </span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-4 pb-8 sm:px-6 lg:px-8">
        {/* Type cards */}
        <section>
          <SectionHeader
            eyebrow="Turlar boʻyicha qidiring"
            title="Qayerga yoʻl olmoqchisiz?"
            subtitle="Har bir toʻplamning oʻziga xos tabiati bor — birtasini tanlang va chuqur oʻting."
          />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SECTION_LIST.map((s) => (
              <TypeCard key={s.type} section={s} count={stats?.byType[s.type]} />
            ))}
          </div>
        </section>

        {/* Featured */}
        {(loading || featured.length > 0) && (
          <section>
            <SectionHeader
              icon={Sparkles}
              eyebrow="Muharrir tanlagan"
              title="Tavsiya etilgan resurslar"
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate('/search?featured=true')}>
                  Barchasini koʻrish <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card overflow-hidden">
                      <div className="skeleton h-44 w-full rounded-none" />
                      <div className="space-y-3 p-5">
                        <div className="skeleton h-4 w-2/3" />
                        <div className="skeleton h-3 w-full" />
                        <div className="skeleton h-3 w-4/5" />
                      </div>
                    </div>
                  ))
                : featured.map((r, i) => <ResourceCard key={r.id} resource={r} index={i} />)}
            </div>
          </section>
        )}

        {/* Latest */}
        <section>
          <SectionHeader
            icon={TrendingUp}
            eyebrow="Yangi"
            title="Yaqinda qoʻshilgan"
            action={
              <Button variant="ghost" size="sm" onClick={() => navigate('/search?sort=newest')}>
                Koʻproq koʻrish <ArrowRight className="h-4 w-4" />
              </Button>
            }
          />
          {loading ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton h-44 w-full rounded-none" />
                  <div className="space-y-3 p-5">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((r, i) => (
                <ResourceCard key={r.id} resource={r} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Popular categories */}
        {popular.length > 0 && (
          <section className="pb-8">
            <SectionHeader
              eyebrow="Mavzular"
              title="Ommabop kategoriyalar"
              subtitle="Barcha toʻplamlar boʻylab bir mavzuni toʻgʻridan-toʻgʻri tanlang."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {popular.map((c) => {
                const section = SECTIONS[c.type as keyof typeof SECTIONS];
                if (!section) return null;
                return (
                  <Link
                    key={c.id}
                    to={`${section.path}?category=${c.slug}`}
                    data-section={c.type}
                    className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-content-muted transition-all hover:-translate-y-0.5 hover:border-[rgb(var(--section)/0.5)] hover:text-[rgb(var(--section))]"
                  >
                    <section.icon className="h-4 w-4" aria-hidden />
                    {c.name}
                    {typeof c.resourceCount === 'number' && (
                      <span className="text-xs opacity-60">{formatCount(c.resourceCount)}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
