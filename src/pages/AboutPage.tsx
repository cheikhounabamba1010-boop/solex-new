import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Users, Sun, ArrowRight } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { PageHeader } from '../components/common/PageHeader';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#F8F8F5] min-h-screen">
      {/* En-tête concis */}
      <PageHeader
        title="À propos de SOLEX"
        description="Entreprise sénégalaise spécialisée dans la distribution d'équipements solaires photovoltaïques."
        kicker="NOTRE HISTOIRE & ENGAGEMENT"
        imageSrc={ASSETS.banners.about}
        breadcrumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'À propos' },
        ]}
      />

      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-12">
        {/* Mission officielle & Présentation claire */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-neutral-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#247A54]">
              Notre mission
            </span>

            {/* Citation officielle SOLEX */}
            <blockquote className="text-base sm:text-lg font-medium text-neutral-900 leading-relaxed border-l-4 border-[#123D32] pl-4 py-1">
              « SOLEX accompagne les particuliers et les professionnels dans leurs besoins en équipements solaires en proposant une gamme de produits adaptés aux différents projets énergétiques. Notre ambition est de rendre les solutions solaires plus accessibles grâce à une offre claire, des équipements sélectionnés et une relation de proximité avec nos clients. »
            </blockquote>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Basée à Dakar, SOLEX sélectionne des équipements conçus pour résister aux contraintes du climat sénégalais : fortes chaleurs, poussières et variations de tension du réseau électrique.
            </p>

            <div className="pt-2 text-xs font-semibold text-[#123D32]">
              Signature : <span className="text-[#F5A623]">« Le solaire à votre portée. »</span>
            </div>
          </div>

          <div className="lg:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100">
            <ImageWithFallback
              src={ASSETS.team}
              alt="Techniciens et ingénieurs solaires SOLEX au Sénégal"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
        </div>

        {/* 4 Engagements concrets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#123D32] flex items-center justify-center font-bold">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              Résistance aux fortes chaleurs
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Matériel éprouvé pour conserver un rendement élevé sous les températures du Sénégal.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#123D32] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              Garanties constructeurs
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Équipements certifiés d&apos;origine, garantis jusqu&apos;à 25 ans selon les gammes.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#123D32] flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              Conseil &amp; Dimensionnement
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Accompagnement technique pour sélectionner la puissance exacte de vos appareils.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#123D32] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              Proximité à Dakar
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Une équipe disponible pour répondre à vos questions et expédier vos commandes dans toutes les régions.
            </p>
          </div>
        </div>

        {/* Action simple vers le contact */}
        <div className="bg-[#123D32] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">
              Vous avez une question sur nos activités ?
            </h3>
            <p className="text-xs text-emerald-100/90">
              Nos conseillers sont à votre écoute pour échanger sur vos projets énergétiques.
            </p>
          </div>

          <Link
            to="/contact"
            className="px-5 py-2.5 bg-white text-[#123D32] hover:bg-neutral-100 rounded-lg text-xs font-bold transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
          >
            <span>Nous contacter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
