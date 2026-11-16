import React from 'react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from './ImageWithFallback';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
  imageSrc: string;
  imageAlt?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  kicker,
  imageSrc,
  imageAlt,
  breadcrumbs,
  children,
}) => {
  return (
    <section className="relative min-h-[220px] sm:min-h-[260px] lg:min-h-[290px] flex items-center bg-[#123D32] overflow-hidden border-b border-[#247A54]/30">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={imageSrc}
          alt={imageAlt || title}
          className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
          containerClassName="w-full h-full"
        />
        {/* Deep Green Architectural Gradient for high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#123D32]/98 via-[#123D32]/88 to-[#123D32]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#123D32] via-transparent to-black/20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-14 w-full">
        {/* Breadcrumbs - clean unboxed typographic navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Fil d'Ariane"
            className="flex flex-wrap items-center gap-2 text-xs font-medium text-emerald-200/90 mb-3"
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-white/40" aria-hidden="true">/</span>}
                {crumb.to ? (
                  <Link
                    to={crumb.to}
                    className="hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#F5A623] font-semibold">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        <div className="max-w-3xl space-y-2.5">
          {kicker && (
            <div className="text-xs font-bold tracking-wider uppercase text-[#F5A623]">
              {kicker}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed font-normal max-w-2xl">
              {description}
            </p>
          )}

          {children && <div className="pt-2">{children}</div>}
        </div>
      </div>
    </section>
  );
};
