import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Command, LayoutDashboard, Menu, Search, X } from 'lucide-react';
import { SECTION_LIST } from '../../lib/sections';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../lib/cn';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-300',
        scrolled ? 'border-border bg-surface/80 backdrop-blur-lg' : 'border-transparent bg-surface/50 backdrop-blur',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Resource Hub bosh sahifasi">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white shadow-sm">
            <Command className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden text-[15px] font-bold tracking-tight text-content sm:block">
            Resource<span className="text-brand">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <NavItem to="/" end>
            Bosh sahifa
          </NavItem>
          {SECTION_LIST.map((s) => (
            <NavItem key={s.type} to={s.path} section={s.type}>
              {s.label}
            </NavItem>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden md:block" role="search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hammasini qidiring…"
              aria-label="Global qidiruv"
              className="input h-9 w-52 pl-9 text-[13px] transition-all focus:w-64 lg:w-36 xl:w-44"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <Link to="/admin" aria-label="Boshqaruv paneli" className="btn btn-secondary btn-sm hidden sm:inline-flex">
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            <span className="hidden xl:inline">Boshqaruv</span>
          </Link>
          <button
            type="button"
            className="btn btn-ghost btn-sm lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-surface/95 backdrop-blur-lg lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <form onSubmit={submitSearch} role="search" className="mb-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hammasini qidiring…"
                  aria-label="Global qidiruv"
                  className="input h-11 pl-10"
                />
              </div>
            </form>
            <MobileNavItem to="/" end>
              Bosh sahifa
            </MobileNavItem>
            {SECTION_LIST.map((s) => (
              <MobileNavItem key={s.type} to={s.path} section={s.type}>
                {s.label}
              </MobileNavItem>
            ))}
            <MobileNavItem to="/admin">Boshqaruv paneli</MobileNavItem>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({
  to,
  end,
  section,
  children,
}: {
  to: string;
  end?: boolean;
  section?: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      data-section={section}
      className={({ isActive }) =>
        cn(
          'whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors xl:px-3',
          isActive
            ? 'text-[rgb(var(--section))]'
            : 'text-content-muted hover:bg-surface-3 hover:text-content',
        )
      }
    >
      {children}
    </NavLink>
  );
}

function MobileNavItem({
  to,
  end,
  section,
  children,
}: {
  to: string;
  end?: boolean;
  section?: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      data-section={section}
      className={({ isActive }) =>
        cn(
          'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-[rgb(var(--section)/0.12)] text-[rgb(var(--section))]'
            : 'text-content-muted hover:bg-surface-3 hover:text-content',
        )
      }
    >
      {children}
    </NavLink>
  );
}
