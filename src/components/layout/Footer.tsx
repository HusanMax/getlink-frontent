import { Link } from 'react-router-dom';
import { Command } from 'lucide-react';
import { SECTION_LIST } from '../../lib/sections';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent text-white">
              <Command className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-content">
              Resource<span className="text-brand">Hub</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-content-muted">
            Esda qoladigan foydali narsalar — veb-saytlar, kanallar, hamjamiyatlar,
            kitoblar va filmlardan iborat tanlangan kutubxona.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-content">Kashf eting</h3>
          <ul className="mt-4 space-y-2">
            {SECTION_LIST.map((s) => (
              <li key={s.type}>
                <Link to={s.path} data-section={s.type} className="text-sm text-content-muted transition-colors hover:text-[rgb(var(--section))]">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-content">Yana</h3>
          <ul className="mt-4 space-y-2">
            <li>
              <Link to="/search" className="text-sm text-content-muted transition-colors hover:text-content">
                Qidiruv
              </Link>
            </li>
            <li>
              <Link to="/admin" className="text-sm text-content-muted transition-colors hover:text-content">
                Boshqaruv paneli
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-content-subtle sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Resource Hub. Gʻamxoʻrlik bilan tanlangan.</p>
          <p>React, NestJS &amp; PostgreSQL asosida qurilgan.</p>
        </div>
      </div>
    </footer>
  );
}
