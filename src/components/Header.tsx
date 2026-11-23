import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MessageCircle, Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { useCategories } from '../content/useData';
import { useContent } from '../context/ContentContext';

interface HeaderProps {
  onOpenQuoteModal: (productName?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal }) => {
  const categories = useCategories();
  const { get } = useContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProductsDropdownOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isProductsActive = location.pathname.startsWith('/produits');

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 bg-white border-b ${
        isScrolled ? 'border-neutral-200 shadow-xs py-3' : 'border-neutral-200/80 py-4'
      }`}
    >
      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-4 sm:gap-6">
        {/* Logo SOLEX */}
        <Link
          to="/"
          className="flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#123D32] rounded-md"
          aria-label="SOLEX Accueil"
        >
          <img
            src={get('global.logo')}
            alt="SOLEX - Le solaire à votre portée"
            className="h-9 sm:h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>

        {/* Navigation principale courte et claire */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-neutral-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors ${
                isActive && location.pathname === '/'
                  ? 'text-[#123D32] font-bold'
                  : 'text-neutral-700 hover:text-[#123D32]'
              }`
            }
          >
            Accueil
          </NavLink>

          {/* Menu déroulant Produits */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
              onMouseEnter={() => setProductsDropdownOpen(true)}
              className={`inline-flex items-center gap-1 transition-colors focus:outline-none cursor-pointer ${
                isProductsActive
                  ? 'text-[#123D32] font-bold'
                  : 'text-neutral-700 hover:text-[#123D32]'
              }`}
              aria-expanded={productsDropdownOpen}
            >
              <span>Produits</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  productsDropdownOpen ? 'rotate-180 text-[#123D32]' : 'text-neutral-400'
                }`}
              />
            </button>

            {productsDropdownOpen && (
              <div
                onMouseLeave={() => setProductsDropdownOpen(false)}
                className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 mt-2 z-50 animate-in fade-in duration-100"
              >
                <div className="p-1 space-y-0.5">
                  <Link
                    to="/produits"
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-neutral-900 hover:bg-neutral-50 transition-colors"
                  >
                    Voir tous les produits &rarr;
                  </Link>
                  <div className="my-1 border-t border-neutral-100" />
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/produits/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-neutral-700 hover:text-[#123D32] hover:bg-emerald-50/50 transition-colors"
                    >
                      <span>{cat.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/solutions"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? 'text-[#123D32] font-bold'
                  : 'text-neutral-700 hover:text-[#123D32]'
              }`
            }
          >
            Solutions
          </NavLink>

          <NavLink
            to="/a-propos"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? 'text-[#123D32] font-bold'
                  : 'text-neutral-700 hover:text-[#123D32]'
              }`
            }
          >
            À propos
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition-colors ${
                isActive
                  ? 'text-[#123D32] font-bold'
                  : 'text-neutral-700 hover:text-[#123D32]'
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Actions utilisateur : WhatsApp direct + Devis / Proposition */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-[#25D366] transition-colors"
            title="Échanger sur WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => onOpenQuoteModal()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#123D32] rounded-xl hover:bg-[#1E6746] transition-all shadow-xs focus:outline-none cursor-pointer whitespace-nowrap"
          >
            <span>Devis &amp; Proposition</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hamburger Mobile & Tablet */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => onOpenQuoteModal()}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#123D32] rounded-xl cursor-pointer"
          >
            Devis &amp; Specs
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-800 hover:text-neutral-950 focus:outline-none cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile & tablette épuré */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-5 py-4 shadow-xl space-y-4 animate-in fade-in duration-150">
          <div className="space-y-1 text-sm font-semibold text-neutral-800">
            <Link to="/" className="block py-2 px-2.5 rounded-xl hover:bg-neutral-50">
              Accueil
            </Link>
            <Link to="/produits" className="block py-2 px-2.5 rounded-xl text-[#123D32] bg-emerald-50/60 font-bold">
              Tous les équipements solaires
            </Link>
            <div className="pl-4 space-y-1 text-xs text-neutral-600">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/produits/${cat.slug}`}
                  className="block py-1.5 hover:text-[#123D32]"
                >
                  {cat.title}
                </Link>
              ))}
            </div>
            <Link to="/solutions" className="block py-2 px-2.5 rounded-xl hover:bg-neutral-50">
              Solutions &amp; Usages
            </Link>
            <Link to="/a-propos" className="block py-2 px-2.5 rounded-xl hover:bg-neutral-50">
              À propos
            </Link>
            <Link to="/contact" className="block py-2 px-2.5 rounded-xl hover:bg-neutral-50">
              Contact &amp; Accès
            </Link>
          </div>

          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#123D32] rounded-xl text-center shadow-xs cursor-pointer"
            >
              Définir mon équipement &amp; mes specs
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal('Proposition personnalisée');
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-slate-900 bg-[#F5A623] rounded-xl text-center shadow-xs cursor-pointer"
            >
              Demander une proposition sur mesure
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
