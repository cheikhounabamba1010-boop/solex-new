import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Building2, Wrench, Droplets, PackageCheck, Check, MessageCircle, ArrowRight } from 'lucide-react';
import { useSolutions } from '../content/useData';
import { useContent } from '../context/ContentContext';
import { PageHeader } from '../components/common/PageHeader';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { getWhatsAppUrl } from '../utils/whatsapp';

interface SolutionsPageProps {
  onOpenQuoteModal: (solutionTitle?: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onOpenQuoteModal }) => {
  const SOLUTIONS = useSolutions();
  const { get } = useContent();
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-4 h-4" />;
      case 'Building2':
        return <Building2 className="w-4 h-4" />;
      case 'Wrench':
        return <Wrench className="w-4 h-4" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4" />;
      case 'PackageCheck':
        return <PackageCheck className="w-4 h-4" />;
      default:
        return <Home className="w-4 h-4" />;
    }
  };

  const scrollToSolution = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#F8F8F5] min-h-screen">
      {/* En-tête de page concis */}
      <PageHeader
        title={get('solutions.header.title')}
        description={get('solutions.header.description')}
        kicker={get('solutions.header.kicker')}
        imageSrc={get('solutions.header.image')}
        breadcrumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'Solutions' },
        ]}
      />

      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-10">
        {/* Barre d'accès rapide par profil (UX directe) */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-neutral-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2 shrink-0 hidden sm:inline">
            {get('solutions.label.profiles')}
          </span>
          {SOLUTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSolution(s.slug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 hover:bg-[#123D32] hover:text-white text-neutral-700 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              {getIcon(s.icon)}
              <span>{s.title.split('pour')[1] || s.title}</span>
            </button>
          ))}
        </div>

        {/* Liste des solutions aérée et facile à parcourir */}
        <div className="space-y-10">
          {SOLUTIONS.map((solution, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div
                key={solution.id}
                id={solution.slug}
                className="bg-white rounded-2xl overflow-hidden border border-neutral-200 scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
              >
                {/* Photo représentative */}
                <div
                  className={`lg:col-span-5 h-[260px] sm:h-[320px] relative ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <ImageWithFallback
                    src={solution.heroImage}
                    alt={solution.title}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Contenu synthétique et direct */}
                <div
                  className={`lg:col-span-7 p-6 sm:p-8 space-y-4 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#247A54]">
                      {solution.targetAudience}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                      {solution.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1">
                      {solution.subtitle}
                    </p>
                  </div>

                  {/* 3 Bénéfices concrets */}
                  <div className="space-y-1.5 pt-1">
                    {solution.benefits.slice(0, 3).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-neutral-700">
                        <Check className="w-4 h-4 text-[#247A54] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Matériel recommandé concis */}
                  <div className="pt-2 text-xs text-neutral-500 border-t border-neutral-100">
                    <span className="font-semibold text-neutral-800">{get('solutions.label.gear')} </span>
                    {solution.recommendedGear.slice(0, 3).join(' · ')}
                  </div>

                  {/* Actions claires */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenQuoteModal(solution.title)}
                      className="px-5 py-2.5 bg-[#123D32] hover:bg-[#1E6746] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {get('solutions.label.quote')}
                    </button>

                    <a
                      href={getWhatsAppUrl(`Demande d'information : ${solution.title}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
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
