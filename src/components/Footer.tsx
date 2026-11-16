import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Globe, MessageCircle, MapPin } from 'lucide-react';
import {
  SOLEX_PHONE_1,
  SOLEX_PHONE_2,
  SOLEX_EMAIL,
  SOLEX_WEBSITE,
  getWhatsAppUrl,
} from '../utils/whatsapp';
import { CATEGORIES } from '../data/categories';

interface FooterProps {
  onOpenQuoteModal?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-[#123D32] text-white border-t border-[#1C5042] w-full">
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1 : Marque & Présentation synthétique (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-2 rounded-lg inline-block">
              <img
                src="/assets/aistudio/LOGO_80dbff4a.png"
                alt="SOLEX Logo officiel"
                className="h-8 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-[#F5A623] font-bold text-xs tracking-wider uppercase">
              « Le solaire à votre portée. »
            </p>

            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-sm">
              Distribution de matériel solaire photovoltaïque certifié au Sénégal : panneaux, batteries lithium, onduleurs hybrides et pompes solaires.
            </p>

            <div className="pt-1 text-xs text-emerald-100/70 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
              <span>Dakar, Sénégal · Expéditions nationales</span>
            </div>
          </div>

          {/* Col 2 : Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5A623]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/produits" className="hover:text-white transition-colors">
                  Nos produits
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="hover:text-white transition-colors">
                  Nos solutions
                </Link>
              </li>
              <li>
                <Link to="/marques" className="hover:text-white transition-colors">
                  Nos marques
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 : Catégories d'équipements (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5A623]">
              Équipements
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-100/80">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/produits/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 : Coordonnées officielles uniques (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5A623]">
              Contact direct
            </h4>

            <div className="space-y-2 text-xs text-emerald-100/90">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                <a
                  href={`tel:${SOLEX_PHONE_1.replace(/\s+/g, '')}`}
                  className="font-mono hover:text-white hover:underline font-semibold"
                >
                  {SOLEX_PHONE_1}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                <a
                  href={`tel:${SOLEX_PHONE_2.replace(/\s+/g, '')}`}
                  className="font-mono hover:text-white hover:underline"
                >
                  {SOLEX_PHONE_2}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                <a
                  href={`mailto:${SOLEX_EMAIL}`}
                  className="hover:text-white hover:underline"
                >
                  {SOLEX_EMAIL}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#F5A623] shrink-0" />
                <span className="font-mono">{SOLEX_WEBSITE}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white rounded-md text-xs font-bold hover:bg-[#20ba59] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp direct</span>
              </a>
            </div>
          </div>
        </div>

        {/* Ligne inférieure légale */}
        <div className="mt-10 pt-6 border-t border-[#1C5042] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-emerald-200/60">
          <div>
            &copy; {new Date().getFullYear()} SOLEX. Tous droits réservés.
          </div>
          <div className="flex items-center gap-3">
            <span>Distribution officielle de matériel solaire au Sénégal</span>
            <span className="text-emerald-400/40">·</span>
            <Link
              to="/admin/login"
              className="text-emerald-300/60 hover:text-white transition-colors"
            >
              Espace Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
