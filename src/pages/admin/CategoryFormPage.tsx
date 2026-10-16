import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { CategoryInput } from '../../types';
import { RESOURCE_TYPES } from '../../types';
import { createCategory, fetchCategory, updateCategory } from '../../api/categories';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../app/hooks';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/ui/Button';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/Spinner';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function CategoryFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [type, setType] = useState<string>('website');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      let active = true;
      setLoading(true);
      fetchCategory(id)
        .then((c) => {
          if (!active) return;
          setName(c.name);
          setSlug(c.slug);
          setSlugTouched(true);
          setType(c.type);
          setDescription(c.description ?? '');
          setIcon(c.icon ?? '');
        })
        .catch((err) => active && setError(getErrorMessage(err)))
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Kategoriya nomi kamida 2 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    const payload: CategoryInput = {
      name: name.trim(),
      type,
      slug: slug.trim() || slugify(name),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(icon.trim() ? { icon: icon.trim() } : {}),
    };

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateCategory(id, payload);
        toast.success('Kategoriya muvaffaqiyatli yangilandi.');
      } else {
        await createCategory(payload);
        toast.success('Kategoriya muvaffaqiyatli yaratildi.');
      }
      navigate('/admin/categories');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Kategoriya yuklanmoqda…" />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/admin/categories')} />;

  return (
    <div data-section={type}>
      <button
        type="button"
        onClick={() => navigate('/admin/categories')}
        className="mb-4 inline-flex items-center gap-2 text-sm text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kategoriyalarga qaytish
      </button>

      <AdminPageHeader
        title={isEdit ? 'Kategoriyani tahrirlash' : "Kategoriya qo'shish"}
        description="Kategoriyalar resur turi bo'yicha belgilanadi va o'z ichida noyob bo'lishi kerak."
      />

      <form onSubmit={submit} className="card max-w-2xl space-y-5 p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="Masalan, Dasturlash"
            />
          </div>

          <div>
            <label htmlFor="type" className="label">
              Turi <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              className="input cursor-pointer"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="slug" className="label">
            Slug
          </label>
          <input
            id="slug"
            className="input font-mono text-sm"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            placeholder="avtomatik-ismdan-hosil-qilinadi"
          />
          <p className="mt-1 text-xs text-content-subtle">
            URL manzillarida ishlatiladi. Tanlangan tur uchun noyob bo'lishi kerak.
          </p>
        </div>

        <div>
          <label htmlFor="icon" className="label">
            Ikonka
          </label>
          <input
            id="icon"
            className="input"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Masalan, code, sparkles, palette"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Tavsif
          </label>
          <textarea
            id="description"
            rows={3}
            className="input h-auto resize-y py-2.5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Bu kategoriyaga nima kirishi haqida qisqa tavsif."
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/categories')}>
            Bekor qilish
          </Button>
          <Button type="submit" isLoading={saving}>
            <Save className="h-4 w-4" aria-hidden />
            {isEdit ? "O'zgarishlarni saqlash" : 'Kategoriya yaratish'}
          </Button>
        </div>
      </form>
    </div>
  );
}
