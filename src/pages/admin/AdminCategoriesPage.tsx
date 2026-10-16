import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import type { Category } from '../../types';
import { RESOURCE_TYPES } from '../../types';
import { deleteCategory, fetchCategories } from '../../api/categories';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../app/hooks';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { TypeBadge } from '../../components/admin/StatusBadges';
import { SearchBar } from '../../components/ui/SearchBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Badge } from '../../components/ui/Badge';

export function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCategories(await fetchCategories({ q: q || undefined, type: type || undefined }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [q, type]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const count = toDelete.resourceCount ?? 0;
      await deleteCategory(toDelete.id, count > 0);
      toast.success("Kategoriya muvaffaqiyatli o'chirildi.");
      setToDelete(null);
      void load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Kategoriya',
      render: (c) => (
        <div>
          <p className="font-medium text-content">{c.name}</p>
          <p className="text-xs text-content-subtle">/{c.slug}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Turi', render: (c) => <TypeBadge type={c.type} /> },
    {
      key: 'description',
      header: 'Tavsif',
      render: (c) => (
        <span className="line-clamp-1 max-w-xs text-content-muted">{c.description || '—'}</span>
      ),
    },
    {
      key: 'resources',
      header: 'Resurslar',
      render: (c) => (
        <Badge tone={(c.resourceCount ?? 0) > 0 ? 'brand' : 'neutral'}>{c.resourceCount ?? 0}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Amallar',
      headerClassName: 'text-right',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={`/admin/categories/${c.id}/edit`}
            className="btn btn-ghost btn-sm"
            aria-label={`${c.name}ni tahrirlash`}
            title="Tahrirlash"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setToDelete(c)}
            className="btn btn-ghost btn-sm hover:text-red-500"
            aria-label={`${c.name}ni o'chirish`}
            title="O'chirish"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const deleteCount = toDelete?.resourceCount ?? 0;

  return (
    <div>
      <AdminPageHeader
        title="Barcha kategoriyalar"
        description="Kategoriyalar har bir kollektsiya turidagi resurslarni guruhlaydi."
        actions={
          <Link to="/admin/categories/create" className="btn btn-primary btn-md">
            <PlusCircle className="h-4 w-4" aria-hidden />
            Kategoriya qo'shish
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={q} onChange={setQ} placeholder="Kategoriyalarni qidirish…" className="sm:max-w-sm sm:flex-1" />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Turi bo'yicha filtrlash"
          className="input h-10 w-auto cursor-pointer"
        >
          <option value="">Barcha turlar</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : (
        <DataTable
          columns={columns}
          rows={categories}
          rowKey={(c) => c.id}
          loading={loading}
          empty={
            <EmptyState
              icon={FolderTree}
              title="Kategoriyalar topilmadi"
              description="Resurslarni tartiblashni boshlash uchun birinchi kategoriyangizni yarating."
              action={
                <Link to="/admin/categories/create" className="btn btn-primary btn-sm">
                  <PlusCircle className="h-4 w-4" /> Kategoriya qo'shish
                </Link>
              }
            />
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Kategoriyani o'chirish"
        message={
          deleteCount > 0
            ? `"${toDelete?.name}" da ${deleteCount} ta resurs bor. Uni o'chirish bu resurslarni kategoriyasiz qoldiradi (ular kutubxonada qolaveradi). Davom etilsinmi?`
            : `"${toDelete?.name}" butunlay o'chiriladi. Bu amalni ortga qaytarib bo'lmaydi.`
        }
        confirmLabel={deleteCount > 0 ? "O'chirish va kategoriyani bekor qilish" : "O'chirish"}
        isLoading={deleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
