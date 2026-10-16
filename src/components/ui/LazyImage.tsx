import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/cn';

interface LazyImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}

export function LazyImage({ src, alt, className, wrapperClassName }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const showFallback = !src || failed;

  return (
    <div className={cn('relative overflow-hidden bg-surface-3', wrapperClassName)}>
      {!loaded && !showFallback && <div className="absolute inset-0 skeleton rounded-none" />}
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-3 to-surface-2 text-content-subtle">
          <ImageOff className="h-8 w-8" aria-hidden />
        </div>
      ) : (
        <img
          src={src ?? undefined}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
        />
      )}
    </div>
  );
}
