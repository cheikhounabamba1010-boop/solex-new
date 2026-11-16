import React, { useState } from 'react';
import { Sun } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackSrc,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    if (fallbackSrc && src !== fallbackSrc) {
      // try fallback src once
      setError(false);
    } else {
      setError(true);
    }
  };

  if (error || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#123D32]/10 via-[#247A54]/10 to-neutral-200 text-[#123D32] p-4 ${containerClassName || className}`}
      >
        <Sun className="w-8 h-8 text-[#247A54]/60 stroke-1 mb-2 animate-pulse" />
        <span className="text-[11px] font-medium text-neutral-600 text-center line-clamp-1">
          {alt || 'SOLEX Équipement Solaire'}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <img
        src={src}
        alt={alt || 'SOLEX matériel photovoltaïque'}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-90'}`}
        {...props}
      />
    </div>
  );
};
