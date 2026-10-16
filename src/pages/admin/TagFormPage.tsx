import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { TagInput } from '../../types';
import { createTag, fetchTags, updateTag } from '../../api/tags';
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
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function TagFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchTags()
      .then((tags) => {
        const tag = tags.find((t) => t.id === id);
        if (!active) return;
        if (tag) {
          setName(tag.name);
          setSlug(tag.slug);
          setSlugTouched(true);
        } else {
          setError('Teg topilmadi.');
        }
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 1) {
      toast.error('Teg nomi majburiy.');
      return;
    }
    const payload: TagInput = { name: name.trim(), slug: slug.trim() || slugify(name) };
    setSaving(true);
    try {
      if (isEdit && id) {
        await updateTag(id, payload);
        toast.success('Teg muvaffaqiyatli yangilandi.');
      } else {
        await createTag(payload);
        toast.success('Teg muvaffaqiyatli yaratildi.');
      }
      navigate('/admin/tags');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Teg yuklanmoqda…" />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/admin/tags')} />;

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate('/admin/tags')}
        className="mb-4 inline-flex items-center gap-2 text-sm text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Teglarga qaytish
      </button>

      <AdminPageHeader title={isEdit ? 'Tegni tahrirlash' : "Teg qo'shish"} />

      <form onSubmit={submit} className="card max-w-xl space-y-5 p-6">
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
            placeholder="Masalan, React"
          />
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
            placeholder="avtomatik-hosil-qilinadi"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/tags')}>
            Bekor qilish
          </Button>
          <Button type="submit" isLoading={saving}>
            <Save className="h-4 w-4" aria-hidden />
            {isEdit ? "O'zgarishlarni saqlash" : 'Teg yaratish'}
          </Button>
        </div>
      </form>
    </div>
  );
}
