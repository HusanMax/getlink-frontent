import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Hash, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import type { Tag } from '../../types';
import { deleteTag, fetchTags } from '../../api/tags';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../app/hooks';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';

export function AdminTagsPage() {
  const toast = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [toDelete, setToDelete] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTags(await fetchTags({ q: q || undefined }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteTag(toDelete.id);
      toast.success("Teg muvaffaqiyatli o'chirildi.");
      setToDelete(null);
      void load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Tag>[] = [
    {
      key: 'name',
      header: 'Teg',
      render: (t) => (
        <div>
          <p className="font-medium text-content">{t.name}</p>
          <p className="text-xs text-content-subtle">#{t.slug}</p>
        </div>
      ),
    },
    {
      key: 'resources',
      header: 'Resurslar',
      render: (t) => <Badge tone={(t.resourceCount ?? 0) > 0 ? 'brand' : 'neutral'}>{t.resourceCount ?? 0}</Badge>,
    },
    {
      key: 'actions',
      header: 'Amallar',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/tags/${t.id}/edit`}
            className="btn btn-ghost btn-sm"
            aria-label={`${t.name}ni tahrirlash`}
            title="Tahrirlash"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setToDelete(t)}
            className="btn btn-ghost btn-sm hover:text-red-500"
            aria-label={`${t.name}ni o'chirish`}
            title="O'chirish"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Barcha teglar"
        description="Teglar barcha resurs turlari bo'ylab umumiy mavzular uchun qo'llaniladi."
        actions={
          <Link to="/admin/tags/create" className="btn btn-primary btn-md">
            <PlusCircle className="h-4 w-4" aria-hidden />
            Teg qo'shish
          </Link>
        }
      />

      <div className="mb-4">
        <SearchBar value={q} onChange={setQ} placeholder="Teglarni qidirish…" className="sm:max-w-sm" />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : (
        <DataTable
          columns={columns}
          rows={tags}
          rowKey={(t) => t.id}
          loading={loading}
          empty={
            <EmptyState
              icon={Hash}
              title="Teglar topilmadi"
              description="Resurslarni turlar bo'ylab yoritlash uchun teglar yarating."
              action={
                <Link to="/admin/tags/create" className="btn btn-primary btn-sm">
                  <PlusCircle className="h-4 w-4" /> Teg qo'shish
                </Link>
              }
            />
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Tegni o'chirish"
        message={
          (toDelete?.resourceCount ?? 0) > 0
            ? `"${toDelete?.name}" ${toDelete?.resourceCount} ta resursda ishlatilmoqda. Uni o'chirish bu resurslardan tegni olib tashlaydi. Davom etilsinmi?`
            : `"${toDelete?.name}" butunlay o'chiriladi.`
        }
        confirmLabel="O'chirish"
        isLoading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
