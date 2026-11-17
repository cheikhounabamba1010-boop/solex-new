import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Users, Sun, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useContent } from '../context/ContentContext';

export const AboutPage: React.FC = () => {
  const { get } = useContent();
  return (
    <div className="bg-[#F8F8F5] min-h-screen">
      {/* En-tête concis */}
      <PageHeader
        title={get('about.header.title')}
        description={get('about.header.description')}
        kicker={get('about.header.kicker')}
        imageSrc={get('about.header.image')}
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
              {get('about.mission.label')}
            </span>

            {/* Citation officielle SOLEX */}
            <blockquote className="text-base sm:text-lg font-medium text-neutral-900 leading-relaxed border-l-4 border-[#123D32] pl-4 py-1">
              {get('about.mission.quote')}
            </blockquote>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {get('about.mission.text')}
            </p>

            <div className="pt-2 text-xs font-semibold text-[#123D32]">
              {get('about.mission.signatureLabel')} <span className="text-[#F5A623]">{get('about.mission.signature')}</span>
            </div>
          </div>

          <div className="lg:col-span-5 aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100">
            <ImageWithFallback
              src={get('about.mission.image')}
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
              {get('about.eng1.title')}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {get('about.eng1.text')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#123D32] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              {get('about.eng2.title')}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {get('about.eng2.text')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#123D32] flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              {get('about.eng3.title')}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {get('about.eng3.text')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-neutral-200 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#123D32] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              {get('about.eng4.title')}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {get('about.eng4.text')}
            </p>
          </div>
        </div>

        {/* Action simple vers le contact */}
        <div className="bg-[#123D32] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">
              {get('about.cta.title')}
            </h3>
            <p className="text-xs text-emerald-100/90">
              {get('about.cta.text')}
            </p>
          </div>

          <Link
            to="/contact"
            className="px-5 py-2.5 bg-white text-[#123D32] hover:bg-neutral-100 rounded-lg text-xs font-bold transition-colors whitespace-nowrap inline-flex items-center gap-1.5"
          >
            <span>{get('about.cta.button')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
