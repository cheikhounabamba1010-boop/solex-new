import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  MessageCircle,
  ArrowRight,
  SlidersHorizontal,
  Sliders,
  Sparkles,
  Zap,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ASSETS } from '../data/assets';
import { PageHeader } from '../components/common/PageHeader';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { api } from '../services/api';

interface ProductsPageProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenQuoteModal }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';

  const [productList, setProductList] = useState(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    api.getProducts().then((data) => {
      if (mounted && Array.isArray(data) && data.length > 0) {
        setProductList(data as any);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return productList.filter((p: any) => {
      const isPub = p.published !== false && p.isPublished !== false;
      if (!isPub) return false;

      const matchCat =
        selectedCategory === 'all' ||
        p.category === selectedCategory ||
        (p.categorySlug && p.categorySlug.includes(selectedCategory));

      const q = searchQuery.toLowerCase().trim();
      const pName = (p.name || p.title || '').toLowerCase();
      const pBrand = (p.brand || '').toLowerCase();
      const pCatLabel = (p.categoryLabel || p.category || '').toLowerCase();

      const matchSearch =
        !q ||
        pName.includes(q) ||
        pBrand.includes(q) ||
        pCatLabel.includes(q);

      return matchCat && matchSearch;
    });
  }, [productList, selectedCategory, searchQuery]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-[#F8F8F5] min-h-screen w-full">
      {/* 1. En-tête concis avec bannière dédiée */}
      <PageHeader
        title="Catalogue Équipements Solaires"
        description="Modules photovoltaïques, batteries lithium, onduleurs et pompes solaires disponibles à Dakar et expédiés dans tout le Sénégal."
        kicker="DISTRIBUTION OFFICIELLE"
        imageSrc={ASSETS.banners.products}
        breadcrumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'Produits' },
        ]}
      />

      {/* 2. Full-Width Container */}
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
        {/* BANNIÈRE INTERACTIVE PLEINE LARGEUR : Définir son matériel ou Demander une proposition */}
        <div className="mb-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#123D32] via-[#164639] to-[#0d2a23] p-5 sm:p-8 md:p-10 text-white shadow-md relative overflow-hidden border border-emerald-800/40">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide border border-emerald-500/30">
                <Sliders className="w-3.5 h-3.5 text-[#F5A623]" />
                <span>BESOIN PARTICULIER OU PROPOSITION SUR MESURE</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Vous avez un équipement précis ou souhaitez une étude personnalisée ?
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Indiquez vous-même l&apos;équipement, la marque souhaitée (Deye, Felicity, Jinko...) et vos critères techniques, ou laissez nos ingénieurs dimensionner la solution idéale pour votre villa, commerce ou forage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onOpenQuoteModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#123D32] hover:bg-neutral-100 text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-[#123D32]" />
                <span>1. Je définis mon matériel &amp; mes specs</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenQuoteModal('Proposition personnalisée')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F5A623] hover:bg-[#e0961b] text-slate-950 text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>2. Demander une proposition</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Barre de recherche et filtres fluides pour mobile, tablette et desktop */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs mb-8 space-y-4">
          {/* Recherche rapide */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom d'équipement ou marque (Deye, Jinko, Felicity, MUST...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32] text-neutral-900 placeholder:text-neutral-400"
            />
          </div>

          {/* Filtres par catégorie */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#123D32] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Tous les équipements ({productList.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = productList.filter((p: any) => p.category === cat.id || p.categorySlug?.includes(cat.id)).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#123D32] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.title} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Grille de produits : cartes épurées mettant l'accent sur le nom */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-neutral-200 max-w-md mx-auto space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-neutral-400 mx-auto" />
            <h3 className="text-sm font-bold text-neutral-900">Aucun équipement trouvé</h3>
            <p className="text-xs text-neutral-500">
              Vous pouvez directement nous donner la référence souhaitée via le configurateur.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#123D32] text-white text-xs font-semibold rounded-lg hover:bg-[#1E6746] transition-colors cursor-pointer"
            >
              Voir tout le catalogue
            </button>
          </div>
        ) : (
          /* Multi-column responsive layout: 1 col on mobile, 2 on tablet portrait, 3 on tablet landscape/desktop, 4 on wide desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product: any) => {
              const displayName = product.name || product.title || 'Équipement Solaire';
              const displayCategory = product.categoryLabel || product.category || 'Équipement';
              const whatsappUrl = getWhatsAppUrl(displayName);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-[#123D32] hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  {/* Image & Brand */}
                  <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                    <ImageWithFallback
                      src={product.image || '/assets/3.png'}
                      alt={displayName}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      containerClassName="w-full h-full flex items-center justify-center bg-slate-50/50"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#123D32] border border-neutral-200 shadow-2xs">
                      {product.brand || 'SOLEX'}
                    </div>
                  </div>

                  {/* Body: NOM DU PRODUIT CLAIR & ÉPURÉ */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                        {displayCategory}
                      </div>

                      {/* Nom seul, mis en valeur de manière élégante et lisible */}
                      <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 leading-snug line-clamp-2">
                        {displayName}
                      </h3>
                    </div>

                    {/* Actions directes : Définir mes critères / Devis & Prix WhatsApp */}
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
                          to={`/produits/${product.slug || product.id}`}
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
        )}

        {/* 5. Bas de page : Appel d'action rapide pour demande personnalisée */}
        <div className="mt-12 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              Vous avez un projet solaire complet au Sénégal ?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500">
              Nos conseillers vous accompagnent pour chiffrer vos kits solaires, pompages et armoires batteries.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onOpenQuoteModal('Proposition personnalisée')}
              className="w-full sm:w-auto py-3 px-5 bg-[#123D32] hover:bg-[#1a5142] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Demander une proposition complète
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
