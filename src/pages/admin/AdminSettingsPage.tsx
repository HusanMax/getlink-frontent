import { useEffect, useState } from 'react';
import { KeyRound, ShieldCheck, UserCog } from 'lucide-react';
import { changePassword, fetchProfile } from '../../api/resources';
import { getErrorMessage } from '../../api/client';
import { useToast } from '../../app/hooks';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/Spinner';
import { formatDate } from '../../lib/format';
import type { Admin } from '../../types';

export function AdminSettingsPage() {
  const toast = useToast();
  const [profile, setProfile] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then(setProfile)
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Yangi parollar mos kelmadi.');
      return;
    }
    setSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      toast.success("Parol muvaffaqiyatli yangilandi.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Sozlamalar yuklanmoqda…" />;

  return (
    <div>
      <AdminPageHeader title="Sozlamalar" description="Hisobingiz ma'lumotlari va xavfsizlik sozlamalari." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card space-y-4 p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-content">Hisob</h2>
              <p className="text-sm text-content-muted">Administrator profilingiz.</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-content-subtle">Foydalanuvchi nomi</dt>
              <dd className="mt-1 font-medium text-content">{profile?.username ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-content-subtle">A'zo bo'lgan sana</dt>
              <dd className="mt-1 font-medium text-content">
                {profile?.createdAt ? formatDate(profile.createdAt) : '—'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <UserCog className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-semibold text-content">Parolni o'zgartirish</h2>
              <p className="text-sm text-content-muted">Kamida 8 ta belgidan foydalaning.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="label">
                Joriy parol
              </label>
              <input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                className="input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="newPassword" className="label">
                  Yangi parol
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="label">
                  Yangi parolni tasdiqlang
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" isLoading={saving}>
                <KeyRound className="h-4 w-4" aria-hidden />
                Parolni yangilash
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
