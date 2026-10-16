import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { loadSession } from './features/auth/authSlice';
import { Toaster } from './components/ui/Toaster';
import { router } from './app/router';

export function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const token = useAppSelector((s) => s.auth.token);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (token) void dispatch(loadSession());
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
