import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MessageCircle, ArrowRight, Sliders, Sparkles } from 'lucide-react';
import { useCategories } from '../content/useData';
import { PRODUCTS } from '../data/products';
import { PageHeader } from '../components/common/PageHeader';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface CategoryPageProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ onOpenQuoteModal }) => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  const categories = useCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return <Navigate to="/produits" replace />;
  }

  const categoryProducts = PRODUCTS.filter((p) => p.category === category.id);

  return (
    <div className="bg-[#F8F8F5] min-h-screen w-full">
      {/* 1. En-tête de catégorie concis */}
      <PageHeader
        title={category.title}
        description={category.shortDesc}
        kicker="CATÉGORIE MATÉRIEL"
        imageSrc={category.heroImage || category.image}
        breadcrumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'Produits', to: '/produits' },
          { label: category.title },
        ]}
      />

      {/* 2. Full-Width Container */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
        {/* Navigation rapide entre catégories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 text-xs scrollbar-none">
          <Link
            to="/produits"
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl whitespace-nowrap transition-colors font-medium"
          >
            &larr; Tous les équipements
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/produits/${cat.slug}`}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all font-semibold ${
                cat.id === category.id
                  ? 'bg-[#123D32] text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {cat.title}
            </Link>
          ))}
        </div>

        {/* Bannière d'action interactive spécifique à la catégorie */}
        <div className="mb-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#123D32] to-[#1e5847] p-5 sm:p-7 md:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-emerald-800/40">
          <div className="max-w-xl space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5A623]">
              CONFIGURATEUR {category.title.toUpperCase()}
            </span>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight">
              Vous avez une marque ou une puissance spécifique en tête ?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Donnez nous votre équipement, la marque souhaitée et vos caractéristiques techniques. Vous pouvez également demander une étude complète.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => onOpenQuoteModal(category.title)}
              className="px-4 py-2.5 rounded-xl bg-white text-[#123D32] hover:bg-neutral-100 text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Préciser mes critères &amp; Devis</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenQuoteModal(`Proposition - ${category.title}`)}
              className="px-4 py-2.5 rounded-xl bg-[#F5A623] hover:bg-[#e0961b] text-slate-950 text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demander une proposition</span>
            </button>
          </div>
        </div>

        {/* Grille des produits : Noms seuls, épurés et responsives sur mobile et tablette */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categoryProducts.map((product) => {
            const displayName = product.name;
            const whatsappUrl = getWhatsAppUrl(displayName);

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-[#123D32] hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={displayName}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    containerClassName="w-full h-full flex items-center justify-center bg-slate-50/50"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#123D32] border border-neutral-200 shadow-2xs">
                    {product.brand}
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                      {product.categoryLabel}
                    </div>
                    {/* Nom seul, sans surcharge technique */}
                    <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 leading-snug line-clamp-2">
                      {displayName}
                    </h3>
                  </div>

                  {/* Boutons d'action clairs */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenQuoteModal(displayName)}
                      className="w-full py-2.5 px-3 bg-[#123D32] hover:bg-[#1a5142] text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Définir mes critères &amp; Devis</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Prix WhatsApp</span>
                      </a>

                      <Link
                        to={`/produits/${product.slug}`}
                        className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors text-center"
                      >
                        Détails
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
