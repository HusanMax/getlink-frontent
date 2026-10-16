import { Link, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-3 text-content-muted">
        <Compass className="h-8 w-8" aria-hidden />
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold text-content">Sahifa topilmadi</h1>
      <p className="mt-3 text-content-muted">
        Siz izlayotgan sahifa mavjud emas yoki koʻchirilgan boʻlishi mumkin.
      </p>
      <div className="mt-7 flex gap-3">
        <Button onClick={() => navigate(-1)} variant="secondary">
          Orqaga qaytish
        </Button>
        <Link to="/" className="btn btn-primary btn-md">
          Bosh sahifaga
        </Link>
      </div>
    </div>
  );
}
