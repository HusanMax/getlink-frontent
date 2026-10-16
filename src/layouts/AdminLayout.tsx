import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Command,
  FolderTree,
  Hash,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Layers,
  List,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { toggleSidebar } from '../features/ui/uiSlice';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { cn } from '../lib/cn';

interface NavEntry {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

const groups: { heading: string; items: NavEntry[] }[] = [
  {
    heading: "Umumiy ko'rinish",
    items: [{ to: '/admin', label: 'Boshqaruv paneli', icon: LayoutDashboard, end: true }],
  },
  {
    heading: 'Resurslar',
    items: [
      { to: '/admin/resources', label: 'Barcha resurslar', icon: List, end: true },
      { to: '/admin/resources/create', label: "Resurs qo'shish", icon: PlusCircle },
    ],
  },
  {
    heading: 'Kategoriyalar',
    items: [
      { to: '/admin/categories', label: 'Barcha kategoriyalar', icon: FolderTree, end: true },
      { to: '/admin/categories/create', label: "Kategoriya qo'shish", icon: PlusCircle },
    ],
  },
  {
    heading: 'Teglar',
    items: [
      { to: '/admin/tags', label: 'Barcha teglar', icon: Hash, end: true },
      { to: '/admin/tags/create', label: "Teg qo'shish", icon: PlusCircle },
    ],
  },
  {
    heading: 'Sozlamalar',
    items: [{ to: '/admin/settings', label: 'Sozlamalar', icon: Settings }],
  },
];

export function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const admin = useAppSelector((s) => s.auth.admin);

  useEffect(() => {
    dispatch(toggleSidebar(false));
  }, [location.pathname, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-3/40">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-surface-2 transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Administrator navigatsiyasi"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <NavLink to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-accent text-white">
              <Command className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-bold text-content">
              Resource<span className="text-brand">Hub</span>
            </span>
          </NavLink>
          <button
            type="button"
            className="btn btn-ghost btn-sm lg:hidden"
            onClick={() => dispatch(toggleSidebar(false))}
            aria-label="Yon panelni yopish"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex h-[calc(100vh-4rem)] flex-col gap-6 overflow-y-auto px-3 py-5">
          <div className="flex-1 space-y-6">
            {groups.map((group) => (
              <div key={group.heading}>
                <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-content-subtle">
                  {group.heading}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-brand/15 text-brand'
                              : 'text-content-muted hover:bg-surface-3 hover:text-content',
                          )
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-content-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Chiqish
            </button>
          </div>
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => dispatch(toggleSidebar(false))}
          aria-hidden
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-lg sm:px-6">
          <button
            type="button"
            className="btn btn-ghost btn-sm lg:hidden"
            onClick={() => dispatch(toggleSidebar(true))}
            aria-label="Yon panelni ochish"
          >
            <Layers className="h-5 w-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-2 py-1.5 pl-1.5 pr-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/15 text-xs font-bold uppercase text-brand">
                {admin?.username?.slice(0, 2) ?? 'AD'}
              </span>
              <span className="text-sm font-medium text-content">{admin?.username ?? 'Admin'}</span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
