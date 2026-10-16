import { Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleTheme } from '../../features/ui/uiSlice';
import { cn } from '../../lib/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const theme = useAppSelector((s) => s.ui.theme);
  const dispatch = useAppDispatch();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-2 text-content-muted transition-colors hover:text-content',
        className,
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
