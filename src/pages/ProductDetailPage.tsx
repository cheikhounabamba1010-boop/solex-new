import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  MessageCircle,
  ShieldCheck,
  Truck,
  CheckCircle2,
  FileText,
  Phone,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { getWhatsAppUrl, SOLEX_PHONE_1, SOLEX_PHONE_2 } from '../utils/whatsapp';
import { api } from '../services/api';

interface ProductDetailPageProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onOpenQuoteModal }) => {
  const { productSlug } = useParams<{ productSlug: string }>();

  // Find product by slug or by id fallback, or load dynamically
  const [product, setProduct] = useState<any>(() =>
    PRODUCTS.find((p) => p.slug === productSlug || p.id === productSlug) || null
  );
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    let mounted = true;
    if (productSlug) {
      api.getProduct(productSlug).then((p) => {
        if (mounted && p) {
          setProduct(p);
          setLoading(false);
        } else if (mounted && !product) {
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [productSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F5] flex items-center justify-center text-xs text-neutral-500">
        <div className="w-5 h-5 border-2 border-[#123D32] border-t-transparent rounded-full animate-spin mr-2" />
        <span>Chargement de la fiche produit SOLEX...</span>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/produits" replace />;
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = (product.gallery && product.gallery.length > 0)
    ? product.gallery
    : ((product.images && product.images.length > 0) ? product.images : [product.image]);
  const activeImage = images[activeImageIndex] || product.image;

  // Similar products in the same category
  const similarProducts = PRODUCTS.filter(
    (p) => (p.category === product.category || p.categoryLabel === product.categoryLabel) && p.id !== product.id
  ).slice(0, 3);

  const whatsappUrl = getWhatsAppUrl(product.name || product.title);

  return (
    <div className="bg-[#F8F8F5] min-h-screen py-8 sm:py-12 w-full">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Breadcrumb Navigation - Anti-slop clean unboxed */}
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-8">
          <Link to="/" className="hover:text-[#123D32] transition-colors underline-offset-4 hover:underline">
            Accueil
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/produits" className="hover:text-[#123D32] transition-colors underline-offset-4 hover:underline">
            Produits
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/produits/${product.categorySlug}`}
            className="hover:text-[#123D32] transition-colors underline-offset-4 hover:underline"
          >
            {product.categoryLabel}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#123D32] font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Active Image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <ImageWithFallback
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-[#123D32] border border-neutral-200">
                {product.brand}
              </div>
              <div className="absolute top-4 right-4 bg-[#123D32] text-white px-2.5 py-1 rounded text-xs font-semibold">
                Sur devis officiel
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((imgUrl: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#123D32] shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-80'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} vue ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Assurance Box */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-2 mt-6">
              <div className="flex items-center gap-2 font-bold text-neutral-900">
                <ShieldCheck className="w-4 h-4 text-[#247A54]" />
                <span>Garantie &amp; Authenticité SOLEX</span>
              </div>
              <p className="leading-relaxed">
                {product.warranty}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
                <Truck className="w-3.5 h-3.5 text-[#123D32]" />
                <span>Expédition sécurisée depuis Dakar vers toutes les régions du Sénégal.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Specs & Actions */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#247A54]">
                <span>{product.categoryLabel}</span>
                <span className="text-neutral-300" aria-hidden="true">·</span>
                <span className="text-neutral-500 font-medium">{product.brand}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-sm font-semibold text-[#123D32] leading-relaxed">
                {product.tagline}
              </p>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>

              {/* Key Features List */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Points forts de cette référence
                </h3>
                <div className="space-y-1.5">
                  {(product.keyFeatures || product.features || []).map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                      <CheckCircle2 className="w-4 h-4 text-[#247A54] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Application */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 space-y-0.5">
                <span className="font-bold text-[#123D32]">Recommandé pour : </span>
                <span>{product.application}</span>
              </div>
            </div>

            {/* CTAs and WhatsApp quote */}
            <div className="pt-6 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Demander le prix sur WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => onOpenQuoteModal(product.name)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#123D32] hover:bg-[#0E2E25] text-white rounded-xl text-sm font-bold transition-colors shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Demander un devis</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                Caractéristiques techniques détaillées
              </h2>
              <p className="text-xs text-neutral-500">
                Spécifications conformes aux fiches constructeurs certifiées.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              Réf : {product.id}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <tbody>
                {(product.specs || []).map((spec: { label: string; value: string }, sIdx: number) => (
                  <tr
                    key={sIdx}
                    className={`border-b border-neutral-100 ${
                      sIdx % 2 === 0 ? 'bg-neutral-50/50' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-neutral-600 w-1/3">
                      {spec.label}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900 font-mono">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  Produits similaires dans la gamme {product.categoryLabel.toLowerCase()}
                </h3>
                <p className="text-xs text-neutral-500">
                  D&apos;autres puissances ou marques adaptées à vos besoins.
                </p>
              </div>
              <Link
                to={`/produits/${product.categorySlug}`}
                className="text-xs font-bold text-[#123D32] hover:underline"
              >
                Voir toute la catégorie &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similarProducts.map((sim) => (
                <Link
                  key={sim.id}
                  to={`/produits/${sim.slug}`}
                  className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-[#123D32] hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                    <ImageWithFallback
                      src={sim.image}
                      alt={sim.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute top-2 left-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-[#123D32]">
                      {sim.brand}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#123D32] transition-colors line-clamp-1">
                      {sim.name}
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {sim.summary}
                    </p>
                    <div className="text-[11px] font-bold text-[#247A54] pt-2">
                      Voir la fiche &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
