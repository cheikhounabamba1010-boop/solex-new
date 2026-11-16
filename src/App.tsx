import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { ScrollToTop } from './components/common/ScrollToTop';

// Dedicated Multipage Views
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SolutionsPage } from './pages/SolutionsPage';
import { AboutPage } from './pages/AboutPage';
import { BrandsPage } from './pages/BrandsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Views & Context
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminQuotesPage } from './pages/admin/AdminQuotesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminVisualBuilderPage } from './pages/admin/AdminVisualBuilderPage';
import { AdminMediaLibraryPage } from './pages/admin/AdminMediaLibraryPage';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteTargetProduct, setQuoteTargetProduct] = useState<string>('');

  const handleOpenQuoteModal = (productName?: string) => {
    setQuoteTargetProduct(productName || '');
    setQuoteModalOpen(true);
  };

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin Login (Isolated) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Private Area (Protected by AdminLayout) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="constructeur" element={<AdminVisualBuilderPage />} />
            <Route path="produits" element={<AdminProductsPage />} />
            <Route path="mediatheque" element={<AdminMediaLibraryPage />} />
            <Route path="demandes" element={<AdminQuotesPage />} />
            <Route path="reglages" element={<AdminSettingsPage />} />
          </Route>

          {/* Public Website Shell */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col bg-[#F8F8F5] text-[#202522] selection:bg-[#123D32] selection:text-white">
                {/* Global Multipage Header with Dropdowns */}
                <Header onOpenQuoteModal={handleOpenQuoteModal} />

                {/* Dynamic Route View */}
                <main className="flex-1">
                  <Routes>
                    {/* 1. Accueil */}
                    <Route path="/" element={<HomePage onOpenQuoteModal={handleOpenQuoteModal} />} />

                    {/* 2. Catalogue Général */}
                    <Route path="/produits" element={<ProductsPage onOpenQuoteModal={handleOpenQuoteModal} />} />

                    {/* 3. Catégories spécifiques demandées */}
                    <Route path="/produits/panneaux-solaires" element={<CategoryPage onOpenQuoteModal={handleOpenQuoteModal} />} />
                    <Route path="/produits/batteries" element={<CategoryPage onOpenQuoteModal={handleOpenQuoteModal} />} />
                    <Route path="/produits/onduleurs" element={<CategoryPage onOpenQuoteModal={handleOpenQuoteModal} />} />
                    <Route path="/produits/regulateurs-mppt" element={<CategoryPage onOpenQuoteModal={handleOpenQuoteModal} />} />
                    <Route path="/produits/kits-solaires" element={<CategoryPage onOpenQuoteModal={handleOpenQuoteModal} />} />
                    <Route path="/produits/accessoires" element={<CategoryPage onOpenQuoteModal={handleOpenQuoteModal} />} />
                    <Route path="/produits/pompes-solaires" element={<CategoryPage onOpenQuoteModal={handleOpenQuoteModal} />} />

                    {/* 4. Fiches détaillées de produits ou slugs de catégories */}
                    <Route path="/produits/:productSlug" element={<ProductDetailPage onOpenQuoteModal={handleOpenQuoteModal} />} />

                    {/* 5. Nos solutions */}
                    <Route path="/solutions" element={<SolutionsPage onOpenQuoteModal={handleOpenQuoteModal} />} />

                    {/* 6. À propos */}
                    <Route path="/a-propos" element={<AboutPage />} />

                    {/* 7. Nos marques */}
                    <Route path="/marques" element={<BrandsPage />} />

                    {/* 8. Contact */}
                    <Route path="/contact" element={<ContactPage />} />

                    {/* 9. Page 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>

                {/* Global Footer */}
                <Footer onOpenQuoteModal={() => handleOpenQuoteModal()} />

                {/* Floating WhatsApp Action Button */}
                <WhatsAppFloat />

                {/* Global Quote / Price Modal */}
                <QuoteModal
                  isOpen={quoteModalOpen}
                  onClose={() => {
                    setQuoteModalOpen(false);
                    setQuoteTargetProduct('');
                  }}
                  productName={quoteTargetProduct}
                />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}

