import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-[#F8F8F5] min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 text-center space-y-6 shadow-sm">
        <div className="text-6xl font-extrabold text-[#123D32] font-mono">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-900">
            Page introuvable
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            L&apos;adresse demandée n&apos;existe pas ou a été déplacée. Explorez nos catégories d&apos;équipements solaires ou revenez à l&apos;accueil.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#123D32] text-white rounded-xl text-xs font-bold hover:bg-[#0E2E25] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Retourner à l&apos;accueil</span>
          </Link>

          <Link
            to="/produits"
            className="inline-flex items-center justify-center gap-2 py-3 px-5 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-bold hover:bg-neutral-200 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Consulter le catalogue produits</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
