import { useEffect } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { removeToast, type Toast as ToastModel } from '../../features/ui/uiSlice';
import { cn } from '../../lib/cn';

const config = {
  success: { icon: CheckCircle2, className: 'text-emerald-500' },
  error: { icon: XCircle, className: 'text-red-500' },
  info: { icon: Info, className: 'text-sky-500' },
} as const;

function ToastItem({ toast }: { toast: ToastModel }) {
  const dispatch = useAppDispatch();
  const { icon: Icon, className } = config[toast.type];

  useEffect(() => {
    const id = setTimeout(() => dispatch(removeToast(toast.id)), 4000);
    return () => clearTimeout(id);
  }, [dispatch, toast.id]);

  return (
    <div
      role="status"
      className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-border bg-surface-2 p-3.5 shadow-pop animate-in"
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', className)} aria-hidden />
      <p className="flex-1 text-sm text-content">{toast.message}</p>
      <button
        type="button"
        onClick={() => dispatch(removeToast(toast.id))}
        aria-label="Bildirishni yopish"
        className="rounded-md p-1 text-content-subtle transition-colors hover:bg-surface-3 hover:text-content"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div key={t.id} className="w-full max-w-sm">
          <ToastItem toast={t} />
        </div>
      ))}
    </div>
  );
}
