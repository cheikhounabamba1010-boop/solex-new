import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Image as ImageIcon,
  PlusCircle,
  ExternalLink,
  Copy,
  Upload,
} from 'lucide-react';
import { api } from '../../services/api';
import { ProductItem } from '../../types';
import { ImageUploadDropzone } from '../../components/admin/ImageUploadDropzone';

const CATEGORIES = [
  'Panneaux photovoltaïques',
  'Batteries solaires',
  'Onduleurs hybrides',
  'Régulateurs MPPT',
  'Kits solaires complets',
  'Pompes solaires',
  'Câbles & Accessoires',
];

const PRESET_ASSETS = [
  { label: 'Onduleur Hybride Deye (Studio Réel)', url: '/assets/images/real_hybrid_inverter_1794073471330.jpg' },
  { label: 'Batterie Lithium Rack (Studio Réel)', url: '/assets/images/real_lithium_battery_1794073471133.jpg' },
  { label: 'Panneau Solaire Monocristallin (Studio Réel)', url: '/assets/images/real_solar_panel_1794073469182.jpg' },
  { label: 'Régulateur MPPT (Studio Réel)', url: '/assets/images/real_mppt_controller_1794073472649.jpg' },
  { label: 'Système Pompage Solaire Inox (Studio Réel)', url: '/assets/images/real_solar_pump_1794073473894.jpg' },
  { label: 'Câbles Solaires & MC4 (Studio Réel)', url: '/assets/images/real_solar_cables_1794073473741.jpg' },
  { label: 'Onduleur Hybride Référence (Photo Réelle)', url: '/assets/3.png' },
  { label: 'Armoire Batterie Lithium (Photo Réelle)', url: '/assets/2.png' },
  { label: 'Régulateur MPPT (Photo Réelle)', url: '/assets/4.png' },
];

export const AdminProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous'); // 'tous' | 'published' | 'draft'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [brand, setBrand] = useState('SOLEX Pro');
  const [power, setPower] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [published, setPublished] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Dynamic Lists for Form
  const [images, setImages] = useState<string[]>(['/assets/3.png']);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Technologie', value: '' },
    { label: 'Garantie', value: '10 ans' },
  ]);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle open modal from URL query (?action=new)
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products.filter((item: any) => {
      const pTitle = (item.title || item.name || '').toLowerCase();
      const pBrand = (item.brand || '').toLowerCase();
      const pPower = (item.power || item.specs?.find((s: any) => s.label.toLowerCase().includes('puissance'))?.value || '').toLowerCase();
      const pCat = (item.categoryLabel || item.category || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        pTitle.includes(q) ||
        pBrand.includes(q) ||
        pPower.includes(q) ||
        pCat.includes(q);

      const matchesCat =
        categoryFilter === 'tous' ||
        (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase()) ||
        (item.categoryLabel && item.categoryLabel.toLowerCase() === categoryFilter.toLowerCase());

      const isItemPub = item.published !== false && item.isPublished !== false;
      const matchesStatus =
        statusFilter === 'tous' ||
        (statusFilter === 'published' && isItemPub) ||
        (statusFilter === 'draft' && !isItemPub);

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setSlug('');
    setCategory(CATEGORIES[0]);
    setBrand('SOLEX Pro');
    setPower('');
    setTagline('');
    setDescription('');
    setPublished(true);
    setInStock(true);
    setIsFeatured(false);
    setImages(['/assets/3.png']);
    setFeatures(['Rendement énergétique certifié', 'Adapté aux conditions tropicales']);
    setSpecs([
      { label: 'Garantie constructeur', value: '5 ans' },
      { label: 'Disponibilité', value: 'Dakar en stock' },
    ]);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setTitle(product.title || product.name || '');
    setSlug(product.slug || product.id);
    setCategory(product.categoryLabel || product.category || CATEGORIES[0]);
    setBrand(product.brand || 'SOLEX Pro');
    setPower(product.power || product.specs?.find((s: any) => s.label.toLowerCase().includes('puissance'))?.value || '');
    setTagline(product.tagline || '');
    setDescription(product.description || product.summary || '');
    setPublished(product.published !== false && product.isPublished !== false);
    setInStock(product.inStock !== false);
    setIsFeatured(!!product.isFeatured);
    setImages(product.images || product.gallery || (product.image ? [product.image] : ['/assets/3.png']));
    setFeatures(product.features || product.keyFeatures || ['']);
    setSpecs(
      product.specs && product.specs.length > 0
        ? product.specs
        : [{ label: 'Garantie', value: '10 ans' }]
    );
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (product: any) => {
    try {
      const isCurrentlyPub = product.published !== false && product.isPublished !== false;
      const updatedStatus = !isCurrentlyPub;
      // Optimistic update
      setProducts((prev) =>
        prev.map((p: any) => (p.id === product.id ? { ...p, published: updatedStatus, isPublished: updatedStatus } : p))
      );
      await api.updateProduct(product.id, { published: updatedStatus, isPublished: updatedStatus } as any);
    } catch {
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) {
      setFormError('Le titre et la catégorie sont obligatoires.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const generatedSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const validImages = images.filter((img) => img.trim().length > 0);
    const finalImages = validImages.length > 0 ? validImages : ['/assets/3.png'];

    const validFeatures = features.filter((f) => f.trim().length > 0);
    const validSpecs = specs.filter((s) => s.label.trim().length > 0 && s.value.trim().length > 0);

    const payload: any = {
      name: title.trim(),
      title: title.trim(),
      slug: generatedSlug,
      category,
      categoryLabel: category,
      categorySlug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: brand.trim() || 'SOLEX Pro',
      power: power.trim(),
      tagline: tagline.trim(),
      summary: tagline.trim() || description.trim().slice(0, 160),
      description: description.trim(),
      image: finalImages[0],
      images: finalImages,
      gallery: finalImages,
      features: validFeatures,
      keyFeatures: validFeatures,
      specs: validSpecs,
      published,
      isPublished: published,
      inStock,
      isFeatured,
      warranty: validSpecs.find((s) => s.label.toLowerCase().includes('garantie'))?.value || 'Garantie constructeur officielle',
      application: 'Résidentiel et professionnel au Sénégal',
      availabilityNote: inStock ? 'En stock à Dakar' : 'Sur commande',
      isExample: false,
    };

    try {
      if (isEditing && currentId) {
        const updated = await api.updateProduct(currentId, payload);
        setProducts((prev) => prev.map((p) => (p.id === currentId ? updated : p)));
      } else {
        const created = await api.createProduct(payload);
        setProducts((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Erreur lors de la sauvegarde.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateProduct = async (prod: ProductItem) => {
    try {
      const copyPayload: any = {
        ...prod,
        name: `${prod.name} (Copie)`,
        slug: `${prod.slug || prod.id}-copie-${Date.now().toString().slice(-4)}`,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        isPublished: false,
      };
      await api.createProduct(copyPayload);
      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la duplication.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestion du Catalogue Produits
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajoutez, éditez ou dépubliez les équipements solaires affichés sur le site SOLEX.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#123D32] hover:bg-[#1a5142] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, marque, puissance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="tous">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="tous">Tous les statuts</option>
            <option value="published">Publiés uniquement</option>
            <option value="draft">Brouillons uniquement</option>
          </select>
        </div>
      </div>

      {/* 3. Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Chargement du catalogue...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">Aucun produit ne correspond à votre recherche.</p>
            <p className="mt-1 text-slate-400">Modifiez vos filtres ou ajoutez un nouveau produit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Produit</th>
                  <th className="px-5 py-3.5 font-bold">Catégorie</th>
                  <th className="px-5 py-3.5 font-bold">Puissance / Marque</th>
                  <th className="px-5 py-3.5 font-bold">Stock</th>
                  <th className="px-5 py-3.5 font-bold">Visibilité</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product: any) => {
                  const isPub = product.published !== false && product.isPublished !== false;
                  const displayTitle = product.title || product.name || 'Produit sans titre';
                  const displayCategory = product.categoryLabel || product.category || 'Équipement';
                  const displayPower =
                    product.power ||
                    product.specs?.find((s: any) => s.label.toLowerCase().includes('puissance'))?.value ||
                    '—';

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Product Name & Photo */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
                            <img
                              src={product.image || '/assets/3.png'}
                              alt={displayTitle}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/assets/3.png';
                              }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">
                              {displayTitle}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-[260px]">
                              {product.tagline || product.summary || product.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {displayCategory}
                        </span>
                      </td>

                      {/* Power & Brand */}
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{displayPower}</div>
                        <div className="text-[11px] text-slate-400">{product.brand}</div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5">
                        {product.inStock !== false ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            En stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Sur commande
                          </span>
                        )}
                      </td>

                      {/* Visibility Toggle */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleTogglePublish(product)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                            isPub
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                          title={isPub ? 'Cliquer pour masquer (Brouillon)' : 'Cliquer pour publier sur le site'}
                        >
                          {isPub ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isPub ? 'Publié' : 'Brouillon'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View on public site */}
                          <a
                            href={`/produits/${product.slug || product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            title="Voir la fiche publique"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Duplicate button */}
                          <button
                            type="button"
                            onClick={() => handleDuplicateProduct(product)}
                            className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer"
                            title="Dupliquer le produit"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Modifier le produit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Supprimer le produit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-center text-sm font-bold text-slate-900">
              Confirmer la suppression
            </h3>
            <p className="text-center text-xs text-slate-500 mt-1">
              Êtes-vous sûr de vouloir supprimer ce produit du catalogue SOLEX ? Cette action est irréversible.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-xs cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 my-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit au catalogue'}
                </h2>
                <p className="text-[11px] text-slate-500">
                  Les modifications seront immédiatement visibles sur le site public.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Section 1: Informations de base */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  1. Informations Générales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nom du produit *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Onduleur Hybride Deye 8kW Monophasé"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Marque
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ex: Deye, Felicity, Jinko..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Puissance / Capacité
                    </label>
                    <input
                      type="text"
                      value={power}
                      onChange={(e) => setPower(e.target.value)}
                      placeholder="Ex: 8 kW / 550 W / 10 kWh"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Slug URL personnalisé (optionnel)
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="Ex: deye-8kw-hybride"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phrase d'accroche (Tagline)
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Ex: Onduleur solaire intelligent tout-en-un pour résidences et commerces"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description complète
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Détaillez les avantages, l'usage recommandé et les performances..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Photos du produit (Upload direct Smartphone / PC / Médiathèque) */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Photos du produit (Upload Smartphone / Ordinateur)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Prenez une photo en direct ou choisissez depuis votre galerie/disque
                    </p>
                  </div>
                </div>

                {/* Primary Image Uploader */}
                <ImageUploadDropzone
                  label="Photo principale du produit *"
                  helperText="Glissez une photo ou touchez pour ouvrir l'appareil photo/galerie de votre smartphone."
                  currentValue={images[0] || ''}
                  onImageSelected={(url) => {
                    if (!url) {
                      setImages(images.slice(1));
                    } else if (images.length === 0) {
                      setImages([url]);
                    } else {
                      const updated = [...images];
                      updated[0] = url;
                      setImages(updated);
                    }
                  }}
                  aspectRatio="landscape"
                />

                {/* Gallery thumbnails */}
                {images.length > 1 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Photos supplémentaires dans la galerie ({images.length - 1}) :
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {images.slice(1).map((extraUrl, idx) => (
                        <div
                          key={idx + 1}
                          className="relative w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden group p-1"
                        >
                          <img
                            src={extraUrl}
                            alt="Galerie"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== idx + 1))}
                            className="absolute inset-0 bg-rose-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                            title="Retirer cette photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add another image dropzone button */}
                <div className="pt-1">
                  <ImageUploadDropzone
                    label="+ Ajouter une photo supplémentaire à la galerie"
                    helperText="Ajoutez d'autres angles ou détails de l'équipement."
                    currentValue=""
                    onImageSelected={(newUrl) => {
                      if (newUrl && !images.includes(newUrl)) {
                        setImages([...images, newUrl]);
                      }
                    }}
                    aspectRatio="auto"
                  />
                </div>
              </div>

              {/* Section 3: Caractéristiques Techniques (Specs) */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    3. Spécifications Techniques
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSpecs([...specs, { label: '', value: '' }])}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Caractéristique (ex: Tension nominale)"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...specs];
                          updated[idx].label = e.target.value;
                          setSpecs(updated);
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium"
                      />
                      <input
                        type="text"
                        placeholder="Valeur (ex: 48V DC)"
                        value={item.value}
                        onChange={(e) => {
                          const updated = [...specs];
                          updated[idx].value = e.target.value;
                          setSpecs(updated);
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Points forts & Statuts */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  4. Visibilité et Disponibilité
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Publier en ligne</span>
                      <span className="text-[10px] text-slate-400">Visible sur le catalogue</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">En stock à Dakar</span>
                      <span className="text-[10px] text-slate-400">Livraison immédiate</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Produit Phare</span>
                      <span className="text-[10px] text-slate-400">Mis en avant en accueil</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#123D32] hover:bg-[#1a5142] text-xs font-bold text-white shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isEditing ? 'Sauvegarder les modifications' : 'Créer et publier'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
