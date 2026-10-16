import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2, Save, Star } from 'lucide-react';
import type { Category, ResourceInput, Tag } from '../../types';
import { RESOURCE_TYPES } from '../../types';
import {
  createResource,
  fetchAdminResource,
  updateResource,
} from '../../api/resources';
import { fetchCategories } from '../../api/categories';
import { fetchTags } from '../../api/tags';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../app/hooks';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/ui/Button';
import { ErrorState } from '../../components/ui/ErrorState';
import { LoadingState } from '../../components/ui/Spinner';
import { SECTIONS } from '../../lib/sections';
import { cn } from '../../lib/cn';

interface FormState {
  title: string;
  description: string;
  url: string;
  image: string;
  type: string;
  categoryId: string;
  author: string;
  year: string;
  reason: string;
  featured: boolean;
  published: boolean;
  tagIds: string[];
}

const emptyForm: FormState = {
  title: '',
  description: '',
  url: '',
  image: '',
  type: 'website',
  categoryId: '',
  author: '',
  year: '',
  reason: '',
  featured: false,
  published: true,
  tagIds: [],
};

export function ResourceFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Load tags once
  useEffect(() => {
    fetchTags()
      .then(setTags)
      .catch(() => setTags([]));
  }, []);

  // Load categories when type changes
  useEffect(() => {
    let active = true;
    fetchCategories({ type: form.type })
      .then((c) => {
        if (!active) return;
        setCategories(c);
        setForm((prev) =>
          prev.categoryId && !c.some((x) => x.id === prev.categoryId)
            ? { ...prev, categoryId: '' }
            : prev,
        );
      })
      .catch(() => active && setCategories([]));
    return () => {
      active = false;
    };
  }, [form.type]);

  // Load existing resource in edit mode
  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    fetchAdminResource(id)
      .then((r) => {
        if (!active) return;
        setForm({
          title: r.title,
          description: r.description,
          url: r.url,
          image: r.image ?? '',
          type: r.type,
          categoryId: r.categoryId ?? '',
          author: r.author ?? '',
          year: r.year ? String(r.year) : '',
          reason: typeof r.metadata?.reason === 'string' ? r.metadata.reason : '',
          featured: r.featured,
          published: r.published,
          tagIds: r.tags.map((t) => t.id),
        });
      })
      .catch((err) => active && setError(getErrorMessage(err)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  const needsAuthor = form.type === 'book';
  const needsYear = form.type === 'book' || form.type === 'movie';
  const needsReason = form.type === 'book' || form.type === 'movie';

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (form.title.trim().length < 2) errors.title = "Sarlavha kamida 2 ta belgidan iborat bo'lishi kerak.";
    if (!form.description.trim()) errors.description = 'Tavsif majburiy.';
    if (!form.url.trim()) errors.url = 'URL majburiy.';
    else {
      try {
        const u = new URL(form.url);
        if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
      } catch {
        errors.url = "http:// yoki https:// bilan boshlanadigan to'g'ri URL kiriting.";
      }
    }
    if (form.image.trim()) {
      try {
        const u = new URL(form.image);
        if (!['http:', 'https:'].includes(u.protocol)) throw new Error();
      } catch {
        errors.image = "To'g'ri rasm URL kiriting.";
      }
    }
    if (form.year && (Number.isNaN(Number(form.year)) || Number(form.year) < 0)) {
      errors.year = "Yil musbat son bo'lishi kerak.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Belgilangan maydonlarni tuzating.');
      return;
    }

    const payload: ResourceInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      url: form.url.trim(),
      type: form.type,
      ...(form.image.trim() ? { image: form.image.trim() } : {}),
      ...(form.categoryId ? { categoryId: form.categoryId } : {}),
      ...(form.author.trim() ? { author: form.author.trim() } : {}),
      ...(form.year ? { year: Number(form.year) } : {}),
      ...(form.reason.trim() ? { metadata: { reason: form.reason.trim() } } : {}),
      featured: form.featured,
      published: form.published,
      tagIds: form.tagIds,
    };

    setSaving(true);
    try {
      if (isEdit && id) {
        await updateResource(id, payload);
        toast.success('Resurs muvaffaqiyatli yangilandi.');
      } else {
        await createResource(payload);
        toast.success('Resurs muvaffaqiyatli yaratildi.');
      }
      navigate('/admin/resources');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const groupedTags = useMemo(
    () =>
      [...tags].sort((a, b) => {
        const aSel = form.tagIds.includes(a.id) ? 0 : 1;
        const bSel = form.tagIds.includes(b.id) ? 0 : 1;
        return aSel - bSel || a.name.localeCompare(b.name);
      }),
    [tags, form.tagIds],
  );

  if (loading) return <LoadingState label="Resurs yuklanmoqda…" />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/admin/resources')} />;

  return (
    <div data-section={form.type}>
      <button
        type="button"
        onClick={() => navigate('/admin/resources')}
        className="mb-4 inline-flex items-center gap-2 text-sm text-content-muted transition-colors hover:text-content"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Resurslarga qaytish
      </button>

      <AdminPageHeader
        title={isEdit ? 'Resursni tahrirlash' : "Resurs qo'shish"}
        description={
          isEdit
            ? 'Bu resurs tafsilotlarini yangilang.'
            : "Tanlangan kutubxonangizga yangi element qo'shing."
        }
      />

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-5 lg:col-span-2">
          <div className="card space-y-5 p-6">
            <Field label="Sarlavha" htmlFor="title" error={fieldErrors.title} required>
              <input
                id="title"
                className="input"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Masalan, MDN Web Docs"
              />
            </Field>

            <Field label="Tavsif" htmlFor="description" error={fieldErrors.description} required>
              <textarea
                id="description"
                rows={4}
                className="input h-auto resize-y py-2.5"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Bu resurs nima uchun eslab qolishga arziydi?"
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="URL" htmlFor="url" error={fieldErrors.url} required>
                <input
                  id="url"
                  className="input"
                  value={form.url}
                  onChange={(e) => set('url', e.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Rasm URL" htmlFor="image" error={fieldErrors.image}>
                <input
                  id="image"
                  className="input"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  placeholder="https://…/cover.jpg"
                />
              </Field>
            </div>

            {needsReason && (
              <Field
                label="Nima uchun tavsiya qilaman"
                htmlFor="reason"
                hint="Kartada alohida eslatma sifatida ko'rsatiladi."
              >
                <textarea
                  id="reason"
                  rows={3}
                  className="input h-auto resize-y py-2.5"
                  value={form.reason}
                  onChange={(e) => set('reason', e.target.value)}
                  placeholder="Nima uchun arziydi haqida qisqa shaxsiy eslatma…"
                />
              </Field>
            )}
          </div>

          <div className="card space-y-4 p-6">
            <div>
              <h3 className="text-sm font-semibold text-content">Teglar</h3>
              <p className="text-xs text-content-muted">
                Bir yoki bir nechta tegni tanlang. Yangi teglarni Teglar sahifasidan yarating.
              </p>
            </div>
            {tags.length === 0 ? (
              <p className="text-sm text-content-subtle">Hozircha teglar yo'q.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {groupedTags.map((t) => {
                  const selected = form.tagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() =>
                        set('tagIds', selected ? form.tagIds.filter((x) => x !== t.id) : [...form.tagIds, t.id])
                      }
                      aria-pressed={selected}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        selected
                          ? 'border-transparent bg-brand text-brand-fg'
                          : 'border-border bg-surface-2 text-content-muted hover:border-brand/50 hover:text-content',
                      )}
                    >
                      {selected && <Check className="h-3 w-3" aria-hidden />}
                      #{t.slug}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card space-y-5 p-6">
            <Field label="Turi" htmlFor="type" required>
              <select id="type" className="input cursor-pointer" value={form.type} onChange={(e) => set('type', e.target.value)}>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {SECTIONS[t]?.label ?? t}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Kategoriya" htmlFor="categoryId">
              <select
                id="categoryId"
                className="input cursor-pointer"
                value={form.categoryId}
                onChange={(e) => set('categoryId', e.target.value)}
              >
                <option value="">Kategoriya yo'q</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            {needsAuthor && (
              <Field label="Muallif" htmlFor="author">
                <input
                  id="author"
                  className="input"
                  value={form.author}
                  onChange={(e) => set('author', e.target.value)}
                  placeholder="Muallif nomi"
                />
              </Field>
            )}

            {needsYear && (
              <Field label="Yil" htmlFor="year" error={fieldErrors.year}>
                <input
                  id="year"
                  type="number"
                  className="input"
                  value={form.year}
                  onChange={(e) => set('year', e.target.value)}
                  placeholder="Masalan, 2016"
                />
              </Field>
            )}
          </div>

          <div className="card space-y-3 p-6">
            <ToggleRow
              label="Tanlangan"
              description="Bosh sahifada ajratib ko'rsatish."
              icon={Star}
              checked={form.featured}
              onChange={(v) => set('featured', v)}
            />
            <ToggleRow
              label="Chop etilgan"
              description="Yoqilgan bo'lsa, tashrif buyuruvchilarga ko'rinadi."
              icon={Check}
              checked={form.published}
              onChange={(v) => set('published', v)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" size="lg" isLoading={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEdit ? "O'zgarishlarni saqlash" : 'Resurs yaratish'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/resources')}>
              Bekor qilish
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-content-subtle">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex w-full items-center justify-between gap-3 rounded-xl text-left"
    >
      <span className="flex items-center gap-3">
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            checked ? 'bg-amber-500/15 text-amber-500' : 'bg-surface-3 text-content-subtle',
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-sm font-medium text-content">{label}</span>
          <span className="block text-xs text-content-muted">{description}</span>
        </span>
      </span>
      <span
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand' : 'bg-surface-3',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  );
}
