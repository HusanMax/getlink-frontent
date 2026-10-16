import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSubmit?: (value: string) => void;
}

/** Debounced search input with clear button. */
export function SearchBar({
  value,
  onChange,
  placeholder = "Qidirish…",
  className,
  autoFocus,
  onSubmit,
}: SearchBarProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  return (
    <form
      role="search"
      className={cn('relative', className)}
      onSubmit={(e) => {
        e.preventDefault();
        onChange(local);
        onSubmit?.(local);
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle" />
      <input
        type="search"
        value={local}
        autoFocus={autoFocus}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="input h-11 pl-10 pr-10"
      />
      {local && (
        <button
          type="button"
          onClick={() => {
            setLocal('');
            onChange('');
          }}
          aria-label="Qidiruvni tozalash"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-content-subtle transition-colors hover:bg-surface-3 hover:text-content"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
