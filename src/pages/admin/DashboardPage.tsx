import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Eye,
  Film,
  FolderTree,
  Globe,
  Hash,
  Layers,
  PlusCircle,
  Send,
  Star,
  Youtube,
} from 'lucide-react';
import type { AdminStats, Resource } from '../../types';
import { fetchAdminResources, fetchAdminStats } from '../../api/resources';
import { getErrorMessage } from '../../api/client';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { StatCard } from '../../components/admin/StatCard';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { PublishedBadge, FeaturedBadge, TypeBadge } from '../../components/admin/StatusBadges';
import { LazyImage } from '../../components/ui/LazyImage';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatDate } from '../../lib/format';

export function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const typeMeta: Record<string, { label: string; icon: typeof Globe; tone: 'brand' | 'rose' | 'sky' | 'amber' | 'violet' }> = {
    website: { label: 'Veb-saytlar', icon: Globe, tone: 'brand' },
    youtube: { label: 'YouTube', icon: Youtube, tone: 'rose' },
    telegram: { label: 'Telegram', icon: Send, tone: 'sky' },
    book: { label: 'Kitoblar', icon: BookOpen, tone: 'amber' },
    movie: { label: 'Filmlar', icon: Film, tone: 'violet' },
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, r] = await Promise.all([
        fetchAdminStats(),
        fetchAdminResources({ limit: 5, sort: 'newest' }),
      ]);
      setStats(s);
      setRecent(r.items);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const columns: Column<Resource>[] = [
    {
      key: 'title',
      header: 'Resurs',
      render: (r) => (
        <div className="flex items-center gap-3">
          <LazyImage
            src={r.image}
            alt={r.title}
            wrapperClassName="h-9 w-14 shrink-0 rounded-md"
            className="h-full w-full"
          />
          <span className="line-clamp-1 font-medium">{r.title}</span>
        </div>
      ),
    },
    { key: 'type', header: 'Turi', render: (r) => <TypeBadge type={r.type} /> },
    { key: 'status', header: 'Holat', render: (r) => <PublishedBadge published={r.published} /> },
    { key: 'featured', header: 'Tanlangan', render: (r) => <FeaturedBadge featured={r.featured} /> },
    {
      key: 'created',
      header: 'Yaratilgan',
      render: (r) => <span className="text-content-muted">{formatDate(r.createdAt)}</span>,
    },
  ];

  if (error) {
    return <ErrorState message={error} onRetry={() => void load()} />;
  }

  return (
    <div>
      <AdminPageHeader
        title="Boshqaruv paneli"
        description="Resurs kutubxonangizdagi hamma narsaning qisqa ko'rinishi."
        actions={
          <Link to="/admin/resources/create" className="btn btn-primary btn-md">
            <PlusCircle className="h-4 w-4" aria-hidden />
            Resurs qo'shish
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Umumiy resurslar" value={stats?.resources.total ?? '—'} icon={Layers} tone="brand" />
        <StatCard
          label="Chop etilgan"
          value={stats?.resources.published ?? '—'}
          icon={Eye}
          tone="emerald"
          hint={stats ? `${stats.resources.unpublished} qoralama` : undefined}
        />
        <StatCard label="Tanlangan" value={stats?.resources.featured ?? '—'} icon={Star} tone="amber" />
        <StatCard label="Kategoriyalar" value={stats?.categories ?? '—'} icon={FolderTree} tone="sky" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(typeMeta).map(([type, meta]) => (
          <StatCard
            key={type}
            label={meta.label}
            value={stats?.byType[type] ?? 0}
            icon={meta.icon}
            tone={meta.tone}
          />
        ))}
        <StatCard label="Teglar" value={stats?.tags ?? '—'} icon={Hash} tone="violet" />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-content">Yaqinda qo'shilgan</h2>
          <Link to="/admin/resources" className="text-sm font-medium text-brand hover:underline">
            Barchasini ko'rish
          </Link>
        </div>
        <DataTable
          columns={columns}
          rows={recent}
          rowKey={(r) => r.id}
          loading={loading}
          skeletonRows={5}
          empty={
            <EmptyState
              title="Hozircha resurslar yo'q"
              description="Birinchi resursingizni qo'shib kutubxonangizni yarating."
              action={
                <Link to="/admin/resources/create" className="btn btn-primary btn-sm">
                  <PlusCircle className="h-4 w-4" /> Resurs qo'shish
                </Link>
              }
            />
          }
        />
      </div>
    </div>
  );
}
