import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MessageCircle,
  Check,
  Sun,
  Zap,
  ShieldCheck,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useCategories } from '../content/useData';
import { PRODUCTS } from '../data/products';
import { ASSETS } from '../data/assets';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { api, SiteSettings, PageSectionItem } from '../services/api';

interface HomePageProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuoteModal }) => {
  const categories = useCategories();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [products, setProducts] = useState(PRODUCTS);
  const [layoutSections, setLayoutSections] = useState<PageSectionItem[]>([]);

  useEffect(() => {
    let mounted = true;
    api.getSettings().then((s) => {
      if (mounted) setSettings(s);
    });
    api.getProducts().then((p) => {
      if (mounted && Array.isArray(p) && p.length > 0) {
        setProducts(p as any);
      }
    });
    api.getLayout().then((l) => {
      if (mounted && Array.isArray(l) && l.length > 0) {
        setLayoutSections(l);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Show 4 popular products only to avoid card overload
  const featuredProducts = products.slice(0, 4);

  // Default fallback sections if layout hasn't loaded yet
  const defaultSections: PageSectionItem[] = [
    {
      id: 'hero',
      name: 'Bannière Héro & Configurateur Express',
      visible: true,
      order: 0,
      data: {
        title: settings?.heroTitle || "L'énergie solaire, à portée de vos projets.",
        subtitle: settings?.heroSubtitle || "Distribution d'équipements solaires fiables et certifiés au Sénégal. Panneaux, batteries, onduleurs et pompes solaires disponibles à Dakar et expédiés dans toutes les régions.",
        kicker: `${settings?.companyName || 'SOLEX'} SÉNÉGAL · ${settings?.signature || 'LE SOLAIRE À VOTRE PORTÉE'}`,
        bgImage: '',
        ctaPrimaryText: 'Explorer le catalogue',
        ctaSecondaryText: 'Donner mon matériel & specs',
      },
    },
    {
      id: 'highlights',
      name: 'Les 3 Engagements Clés SOLEX',
      visible: true,
      order: 1,
      data: {
        item1Title: 'Vente détail & gros',
        item1Desc: 'Panneaux, batteries lithium, onduleurs et pompes adaptés aux particuliers, artisans et entreprises.',
        item2Title: 'Marques de référence',
        item2Desc: "LONGi, Jinko Solar, Deye, MUST, Felicity Solar, Victron. Matériel d'origine avec garanties constructeurs.",
        item3Title: 'Devis & Conseil sous 24h',
        item3Desc: 'Étude de dimensionnement claire et sans engagement pour choisir la bonne puissance.',
      },
    },
    {
      id: 'categories',
      name: 'Grille des Catégories Solaires',
      visible: true,
      order: 2,
      data: {
        kicker: 'CATALOGUE SOLEX',
        title: 'Nos équipements solaires',
        linkText: 'Voir tout le catalogue',
      },
    },
    {
      id: 'solutions',
      name: 'Solutions par Profil',
      visible: true,
      order: 3,
      data: {
        kicker: 'SOLUTIONS SUR-MESURE',
        title: 'Une solution adaptée à votre situation',
        subtitle: 'Chaque installation a ses priorités. Découvrez la formule qui correspond à votre projet.',
      },
    },
    {
      id: 'featured_products',
      name: 'Équipements Phares en Stock',
      visible: true,
      order: 4,
      data: {
        kicker: 'MATÉRIEL POPULAIRE DISPONIBLE',
        title: 'Références en stock',
        linkText: "Consulter l'ensemble du catalogue",
      },
    },
    {
      id: 'cta_banner',
      name: 'Bandeau Contact & Devis Express',
      visible: true,
      order: 5,
      data: {
        title: 'Un projet solaire en vue ?',
        subtitle: 'Transmettez-nous la liste de vos appareils ou votre besoin. Nos conseillers vous répondent sous 24h avec une proposition claire.',
        buttonText: 'Demander un devis',
        whatsappText: 'WhatsApp direct',
      },
    },
  ];

  const activeSections = layoutSections.length > 0 ? layoutSections : defaultSections;
  const visibleSections = activeSections.filter((s) => s.visible !== false);

  const renderSection = (section: PageSectionItem) => {
    switch (section.id) {
      case 'hero': {
        const bg = section.data?.bgImage || ASSETS.banners.home;
        const heroTitle = section.data?.title || settings?.heroTitle || "L'énergie solaire, à portée de vos projets.";
        const heroSubtitle = section.data?.subtitle || settings?.heroSubtitle || "Distribution d'équipements solaires fiables et certifiés au Sénégal. Panneaux, batteries, onduleurs et pompes solaires disponibles à Dakar et expédiés dans toutes les régions.";
        const heroKicker = section.data?.kicker || `${settings?.companyName || 'SOLEX'} SÉNÉGAL · ${settings?.signature || 'LE SOLAIRE À VOTRE PORTÉE'}`;
        const cta1 = section.data?.ctaPrimaryText || 'Explorer le catalogue';
        const cta2 = section.data?.ctaSecondaryText || 'Donner mon matériel & specs';

        return (
          <section key="hero" className="relative min-h-[80vh] flex items-center bg-[#123D32] overflow-hidden w-full">
            {/* Photographie solaire */}
            <div className="absolute inset-0 z-0">
              <ImageWithFallback
                src={bg}
                alt="Installation solaire moderne"
                className="w-full h-full object-cover object-center filter brightness-[0.60]"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#123D32]/98 via-[#123D32]/90 to-transparent/40" />
            </div>

            <div className="relative z-10 w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Colonne gauche : Titre & Présentation */}
                <div className="lg:col-span-7 space-y-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wider uppercase border border-emerald-500/30">
                    <Sun className="w-3.5 h-3.5 text-[#F5A623]" />
                    <span>{heroKicker}</span>
                  </span>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                    {heroTitle}
                  </h1>

                  <p className="text-base sm:text-lg text-emerald-50/90 leading-relaxed font-normal max-w-xl">
                    {heroSubtitle}
                  </p>

                  {/* Boutons d'action clairs */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      to="/produits"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-[#123D32] bg-white hover:bg-neutral-100 rounded-xl transition-all shadow-md"
                    >
                      <span>{cta1}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => onOpenQuoteModal()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white bg-[#247A54] hover:bg-[#1E6746] rounded-xl transition-all border border-emerald-400/30 cursor-pointer shadow-md"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>{cta2}</span>
                    </button>
                  </div>

                  {/* Reassurance points courts */}
                  <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-emerald-100/80">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{section.data?.badge1 || 'Matériel certifié constructeur'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{section.data?.badge2 || 'Stock disponible à Dakar'}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#F5A623]" />
                      <span>{section.data?.badge3 || 'Livraison partout au Sénégal'}</span>
                    </span>
                  </div>
                </div>

                {/* Colonne droite : Carte d'accès direct pour donner son matériel ou demander une proposition */}
                <div className="lg:col-span-5">
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-neutral-800 space-y-5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#123D32] bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        CONFIGURATION RAPIDE EN 1 MINUTE
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 mt-2">
                        Comment pouvons-nous vous aider ?
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Sélectionnez la démarche qui vous convient pour recevoir une offre sous 24h.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Option 1 */}
                      <button
                        type="button"
                        onClick={() => onOpenQuoteModal()}
                        className="w-full text-left p-4 rounded-2xl border-2 border-emerald-600/30 hover:border-emerald-700 bg-emerald-50/40 hover:bg-emerald-50 transition-all flex items-start gap-3.5 group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#123D32] text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Sliders className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold text-neutral-900 group-hover:text-[#123D32] transition-colors">
                            1. J&apos;indique mon matériel &amp; mes specs
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                            Donnez l&apos;équipement (panneaux, batterie, onduleur), la marque et la puissance souhaitée.
                          </div>
                        </div>
                      </button>

                      {/* Option 2 */}
                      <button
                        type="button"
                        onClick={() => onOpenQuoteModal('Proposition personnalisée')}
                        className="w-full text-left p-4 rounded-2xl border-2 border-amber-500/30 hover:border-amber-600 bg-amber-50/40 hover:bg-amber-50 transition-all flex items-start gap-3.5 group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#F5A623] text-slate-950 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold text-neutral-900 group-hover:text-[#123D32] transition-colors">
                            2. Je demande une proposition sur mesure
                          </div>
                          <div className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">
                            Étude gratuite et dimensionnement personnalisé pour votre villa, commerce ou pompage.
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="pt-2 text-center">
                      <a
                        href={getWhatsAppUrl(undefined, 'Bonjour SOLEX, je souhaite échanger directement avec un conseiller technique pour mon projet solaire.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#123D32] font-bold hover:underline inline-flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Ou écrivez-nous directement sur WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'highlights': {
        const item1T = section.data?.item1Title || 'Vente détail & gros';
        const item1D = section.data?.item1Desc || 'Panneaux, batteries lithium, onduleurs et pompes adaptés aux particuliers, artisans et entreprises.';
        const item2T = section.data?.item2Title || 'Marques de référence';
        const item2D = section.data?.item2Desc || "LONGi, Jinko Solar, Deye, MUST, Felicity Solar, Victron. Matériel d'origine avec garanties constructeurs.";
        const item3T = section.data?.item3Title || 'Devis & Conseil sous 24h';
        const item3D = section.data?.item3Desc || 'Étude de dimensionnement claire et sans engagement pour choisir la bonne puissance.';

        return (
          <section key="highlights" className="py-12 bg-white border-b border-neutral-200 w-full">
            <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 text-[#123D32] shrink-0">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-neutral-900">{item1T}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{item1D}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 text-[#123D32] shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-neutral-900">{item2T}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{item2D}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50 text-[#123D32] shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-neutral-900">{item3T}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">{item3D}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'categories': {
        const kicker = section.data?.kicker || 'CATALOGUE SOLEX';
        const title = section.data?.title || 'Nos équipements solaires';
        const linkText = section.data?.linkText || 'Voir tout le catalogue';

        return (
          <section key="categories" className="py-16 sm:py-20 bg-[#F8F8F5] border-b border-neutral-200 w-full">
            <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#123D32]">
                    {kicker}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202522] mt-1">
                    {title}
                  </h2>
                </div>

                <Link
                  to="/produits"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123D32] hover:text-[#247A54] transition-colors"
                >
                  <span>{linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Grille visuelle des 6 catégories principales */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/produits/${cat.slug}`}
                    className="group flex flex-col bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-[#123D32] hover:shadow-md transition-all"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-neutral-100 relative">
                      <ImageWithFallback
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        containerClassName="w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-xs font-bold text-neutral-900 group-hover:text-[#123D32] transition-colors line-clamp-1">
                        {cat.title}
                      </h3>
                      <span className="text-[11px] text-[#247A54] font-semibold mt-0.5 inline-block">
                        Découvrir &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      }

      case 'solutions': {
        const kicker = section.data?.kicker || 'SOLUTIONS SUR-MESURE';
        const title = section.data?.title || 'Une solution adaptée à votre situation';
        const subtitle = section.data?.subtitle || 'Chaque installation a ses priorités. Découvrez la formule qui correspond à votre projet.';

        return (
          <section key="solutions" className="py-16 sm:py-20 bg-white border-b border-neutral-200 w-full">
            <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="max-w-2xl mb-10">
                <span className="text-xs font-bold uppercase tracking-wider text-[#123D32]">
                  {kicker}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202522] mt-1">
                  {title}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2">
                  {subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Maison & Particuliers */}
                <div className="p-6 bg-[#F8F8F5] rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#247A54]">
                      Particuliers
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900">
                      Maisons &amp; Villas
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Éliminez les coupures d&apos;électricité et réduisez vos factures en alimentant climatiseurs, réfrigérateurs et éclairage.
                    </p>
                  </div>
                  <Link
                    to="/solutions#solutions-particuliers-residences"
                    className="text-xs font-bold text-[#123D32] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Voir la solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* 2. Entreprises & Commerces */}
                <div className="p-6 bg-[#F8F8F5] rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#247A54]">
                      Entreprises
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900">
                      Commerces &amp; PME
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Zéro arrêt d&apos;activité pour vos bureaux, commerces, chambres froides et cliniques sans ruiner votre budget en carburant.
                    </p>
                  </div>
                  <Link
                    to="/solutions#solutions-entreprises-commerces"
                    className="text-xs font-bold text-[#123D32] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Voir la solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* 3. Agriculture & Pompage */}
                <div className="p-6 bg-[#F8F8F5] rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#247A54]">
                      Agriculture
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900">
                      Pompage &amp; Forages
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Pompes solaires immergées pour puits et forages. Arrosez vos cultures gratuitement dès le lever du soleil.
                    </p>
                  </div>
                  <Link
                    to="/solutions#pompage-solaire-agricole"
                    className="text-xs font-bold text-[#123D32] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Voir la solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* 4. Installateurs */}
                <div className="p-6 bg-[#F8F8F5] rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#247A54]">
                      Professionnels
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900">
                      Installateurs Solaires
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Approvisionnement direct, matériel certifié en stock, fiches constructeurs et tarifs professionnels adaptés.
                    </p>
                  </div>
                  <Link
                    to="/solutions#equipements-installateurs-pros"
                    className="text-xs font-bold text-[#123D32] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Voir la solution</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'featured_products': {
        const kicker = section.data?.kicker || 'MATÉRIEL POPULAIRE DISPONIBLE';
        const title = section.data?.title || 'Références en stock';
        const linkText = section.data?.linkText || "Consulter l'ensemble du catalogue";

        return (
          <section key="featured_products" className="py-16 sm:py-20 bg-[#F8F8F5] border-b border-neutral-200 w-full">
            <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#123D32]">
                    {kicker}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202522] mt-1">
                    {title}
                  </h2>
                </div>

                <Link
                  to="/produits"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#123D32] hover:text-[#247A54] transition-colors"
                >
                  <span>{linkText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {featuredProducts.map((product: any) => {
                  const displayName = product.name || product.title || 'Équipement Solaire';
                  const displayCat = product.categoryLabel || product.category || 'Solaire';
                  const whatsappUrl = getWhatsAppUrl(displayName);

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-[#123D32] hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <Link
                        to={`/produits/${product.slug || product.id}`}
                        className="aspect-[4/3] bg-neutral-100 relative block overflow-hidden"
                      >
                        <ImageWithFallback
                          src={product.image}
                          alt={displayName}
                          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          containerClassName="w-full h-full flex items-center justify-center bg-slate-50/50"
                        />
                        <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#123D32] border border-neutral-200 shadow-2xs">
                          {product.brand}
                        </div>
                      </Link>

                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <div className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                            {displayCat}
                          </div>
                          {/* Nom uniquement, propre et épuré */}
                          <Link
                            to={`/produits/${product.slug || product.id}`}
                            className="text-sm sm:text-base font-extrabold text-neutral-900 hover:text-[#123D32] transition-colors line-clamp-2 block leading-snug"
                          >
                            {displayName}
                          </Link>
                        </div>

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
                              className="flex-1 text-center py-2 px-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Prix WhatsApp</span>
                            </a>

                            <Link
                              to={`/produits/${product.slug || product.id}`}
                              className="py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors text-center"
                            >
                              Fiche
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }

      case 'cta_banner': {
        const title = section.data?.title || 'Un projet solaire en vue ?';
        const subtitle = section.data?.subtitle || 'Transmettez-nous la liste de vos appareils ou votre besoin. Nos conseillers vous répondent sous 24h avec une proposition claire.';
        const btnText = section.data?.buttonText || 'Demander un devis';
        const waText = section.data?.whatsappText || 'WhatsApp direct';

        return (
          <section key="cta_banner" className="py-14 sm:py-16 bg-white w-full">
            <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="bg-[#123D32] rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left max-w-xl">
                  <h2 className="text-2xl font-extrabold text-white">
                    {title}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90">
                    {subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenQuoteModal()}
                    className="px-6 py-3 bg-white text-[#123D32] hover:bg-neutral-100 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {btnText}
                  </button>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{waText}</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#F8F8F5] w-full">
      {visibleSections.map((sec) => renderSection(sec))}
    </div>
  );
};
