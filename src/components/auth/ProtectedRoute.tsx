import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { LoadingState } from '../../components/ui/Spinner';

export function ProtectedRoute() {
  const { token, initialized, status } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (!initialized && status !== 'authenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingState label="Sessiyangiz tekshirilmoqda…" />
      </div>
    );
  }

  return <Outlet />;
}
