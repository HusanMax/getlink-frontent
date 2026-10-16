import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ResourceExplorer } from '../components/resources/ResourceExplorer';

export function SearchPage() {
  return (
    <div data-section="website">
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
            <Search className="h-4 w-4" aria-hidden />
            Global qidiruv
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-content sm:text-4xl">
            Istalgan narsani toping
          </h1>
          <p className="mt-3 max-w-2xl text-content-muted">
            Sarlavha, tavsif, kategoriya yoki teg boʻyicha barcha toʻplamlarda qidiring.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ResourceExplorer showCategory={false} showTypeFilter pageSize={16} />
        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface-2 p-5">
          <p className="text-sm text-content-muted">Koʻrganingizni afzal koʻrasizmi? Toʻplamdan boshlang:</p>
          <Link to="/websites" className="btn btn-secondary btn-sm">Veb-saytlar</Link>
          <Link to="/youtube" className="btn btn-secondary btn-sm">YouTube</Link>
          <Link to="/telegram" className="btn btn-secondary btn-sm">Telegram</Link>
          <Link to="/books" className="btn btn-secondary btn-sm">Kitoblar</Link>
          <Link to="/movies" className="btn btn-secondary btn-sm">Kinolar</Link>
        </div>
      </div>
    </div>
  );
}
