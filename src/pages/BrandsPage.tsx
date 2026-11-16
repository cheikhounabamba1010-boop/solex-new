import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BRANDS } from '../data/brands';
import { ASSETS } from '../data/assets';
import { PageHeader } from '../components/common/PageHeader';

export const BrandsPage: React.FC = () => {
  return (
    <div className="bg-[#F8F8F5] min-h-screen">
      {/* En-tête concis */}
      <PageHeader
        title="Nos marques partenaires"
        description="Constructeurs mondiaux sélectionnés par SOLEX pour la fiabilité et la garantie de leurs équipements solaires."
        kicker="FABRICANTS TIER-1"
        imageSrc={ASSETS.banners.brands}
        breadcrumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'Marques' },
        ]}
      />

      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-10">
        {/* Grille des marques épurée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANDS.map((brand) => (
            <div
              key={brand.slug}
              className="bg-white rounded-xl p-6 border border-neutral-200 flex flex-col justify-between space-y-4 hover:border-[#123D32] transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="font-mono text-[#247A54] uppercase tracking-wider text-[11px]">
                    {brand.tier}
                  </span>
                  <span className="text-neutral-400 font-normal">{brand.origin}</span>
                </div>

                <h2 className="text-xl font-bold text-neutral-900">
                  {brand.name}
                </h2>

                <p className="text-xs font-semibold text-[#123D32]">
                  {brand.specialty}
                </p>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {brand.description}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  Garantie constructeur
                </span>
                <Link
                  to="/produits"
                  className="text-xs font-bold text-[#123D32] hover:underline inline-flex items-center gap-1"
                >
                  <span>Voir le matériel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
