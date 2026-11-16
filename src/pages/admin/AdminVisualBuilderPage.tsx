import React, { useState, useEffect } from 'react';
import {
  GripVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Sliders,
  Type,
  Image as ImageIcon,
  Layers,
  ChevronRight,
  Sun,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { api, PageSectionItem } from '../../services/api';
import { ImageUploadDropzone } from '../../components/admin/ImageUploadDropzone';

export const AdminVisualBuilderPage: React.FC = () => {
  const [sections, setSections] = useState<PageSectionItem[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = async () => {
    setLoading(true);
    try {
      const data = await api.getLayout();
      if (Array.isArray(data) && data.length > 0) {
        setSections(data);
        setSelectedSectionId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load layout:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.updateLayout(sections);
      setSections(updated);
      showToast('Disposition et contenus du site enregistrés avec succès !');
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'enregistrement", true);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Voulez-vous réinitialiser toutes les sections à leur disposition et textes d\'origine ?')) {
      return;
    }
    setSaving(true);
    try {
      const reset = await api.resetLayout();
      setSections(reset);
      showToast('Sections réinitialisées par défaut.');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la réinitialisation', true);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg: string, isError = false) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...sections];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    // Update order indexes
    const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
    setSections(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const updated = reordered.map((item, idx) => ({ ...item, order: idx }));
    setSections(updated);
  };

  const toggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  const updateSectionField = (field: string, value: any) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === selectedSectionId) {
          return {
            ...s,
            data: {
              ...s.data,
              [field]: value,
            },
          };
        }
        return s;
      })
    );
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center text-slate-500 text-xs">
        <div className="w-5 h-5 border-2 border-[#123D32] border-t-transparent rounded-full animate-spin mr-2" />
        <span>Chargement du constructeur visuel SOLEX...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions Bar (Type Elementor / WordPress) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-wider uppercase border border-emerald-200">
            <Layers className="w-3 h-3 text-[#F5A623]" />
            <span>CONSTRUCTEUR VISUEL INTERACTIF</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Éditeur du site par glisser-déposer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Réorganisez les sections, modifiez les textes et uploadez vos photos sans aucune ligne de code.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Device Switcher */}
          <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                previewDevice === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Aperçu Ordinateur"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                previewDevice === 'tablet' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Aperçu Tablette (iPad)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                previewDevice === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Aperçu Mobile (iPhone)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-[#123D32] hover:bg-[#1a5142] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Enregistrer les modifications</span>
              </>
            )}
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Visual Builder Workspace (Split 2-Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Drag & Drop Sections Tree + Editor Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Section Tree with Drag Handles */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Arborescence des Sections (Glisser-Déposer)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Attrapez et déplacez pour changer l&apos;ordre sur le site
                </p>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {sections.length} sections
              </span>
            </div>

            <div className="p-2 space-y-1.5">
              {sections.map((section, idx) => {
                const isSelected = selectedSectionId === section.id;
                const isDragged = draggedIndex === idx;
                const isOver = dragOverIndex === idx;

                return (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-emerald-50/80 border-[#123D32] shadow-xs ring-1 ring-[#123D32]/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    } ${isDragged ? 'opacity-40 border-dashed border-emerald-500' : ''} ${
                      isOver ? 'border-t-4 border-t-emerald-600' : ''
                    }`}
                  >
                    {/* Left: Drag Handle & Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700 p-1 rounded-md"
                        title="Glisser pour réorganiser"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-extrabold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>

                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {section.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {section.id} {!section.visible && '· (Masquée)'}
                        </div>
                      </div>
                    </div>

                    {/* Right: Quick Up/Down and Visibility toggle */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, 'up');
                        }}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                        title="Monter"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, 'down');
                        }}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                        title="Descendre"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleVisibility(section.id, e)}
                        className={`p-1 rounded cursor-pointer transition-colors ${
                          section.visible
                            ? 'text-emerald-700 hover:text-emerald-800'
                            : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={section.visible ? 'Visible sur le site' : 'Masquée du site'}
                      >
                        {section.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Content Editor (WordPress Elementor style form) */}
          {selectedSection && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-[#123D32] uppercase tracking-wider">
                    ÉDITION EN DIRECT
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {selectedSection.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={(e) => toggleVisibility(selectedSection.id, e)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    selectedSection.visible
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedSection.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{selectedSection.visible ? 'Visible' : 'Masquée'}</span>
                </button>
              </div>

              {/* Dynamic Fields Depending on Section */}
              {selectedSection.id === 'hero' && (
                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Kicker / Badge du haut
                    </label>
                    <input
                      type="text"
                      value={selectedSection.data.kicker || ''}
                      onChange={(e) => updateSectionField('kicker', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#123D32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre principal du site
                    </label>
                    <textarea
                      rows={2}
                      value={selectedSection.data.title || ''}
                      onChange={(e) => updateSectionField('title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#123D32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Sous-titre / Présentation
                    </label>
                    <textarea
                      rows={3}
                      value={selectedSection.data.subtitle || ''}
                      onChange={(e) => updateSectionField('subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#123D32] focus:outline-none"
                    />
                  </div>

                  {/* Photo de fond de la bannière avec upload direct PC / Smartphone */}
                  <div className="pt-1">
                    <ImageUploadDropzone
                      label="Image de fond de la bannière Héro"
                      helperText="Prenez une photo avec votre smartphone ou glissez une image depuis votre ordinateur."
                      currentValue={selectedSection.data.bgImage || ''}
                      onImageSelected={(url) => updateSectionField('bgImage', url)}
                      aspectRatio="wide"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Bouton 1
                      </label>
                      <input
                        type="text"
                        value={selectedSection.data.ctaPrimaryText || ''}
                        onChange={(e) => updateSectionField('ctaPrimaryText', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Bouton 2
                      </label>
                      <input
                        type="text"
                        value={selectedSection.data.ctaSecondaryText || ''}
                        onChange={(e) => updateSectionField('ctaSecondaryText', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedSection.id === 'highlights' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-emerald-800">Point 1</span>
                    <input
                      type="text"
                      placeholder="Titre"
                      value={selectedSection.data.item1Title || ''}
                      onChange={(e) => updateSectionField('item1Title', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={selectedSection.data.item1Desc || ''}
                      onChange={(e) => updateSectionField('item1Desc', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-emerald-800">Point 2</span>
                    <input
                      type="text"
                      placeholder="Titre"
                      value={selectedSection.data.item2Title || ''}
                      onChange={(e) => updateSectionField('item2Title', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={selectedSection.data.item2Desc || ''}
                      onChange={(e) => updateSectionField('item2Desc', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-emerald-800">Point 3</span>
                    <input
                      type="text"
                      placeholder="Titre"
                      value={selectedSection.data.item3Title || ''}
                      onChange={(e) => updateSectionField('item3Title', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description"
                      value={selectedSection.data.item3Desc || ''}
                      onChange={(e) => updateSectionField('item3Desc', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {selectedSection.id === 'categories' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Kicker
                    </label>
                    <input
                      type="text"
                      value={selectedSection.data.kicker || ''}
                      onChange={(e) => updateSectionField('kicker', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre de la section
                    </label>
                    <input
                      type="text"
                      value={selectedSection.data.title || ''}
                      onChange={(e) => updateSectionField('title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {selectedSection.id === 'solutions' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Kicker
                    </label>
                    <input
                      type="text"
                      value={selectedSection.data.kicker || ''}
                      onChange={(e) => updateSectionField('kicker', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={selectedSection.data.title || ''}
                      onChange={(e) => updateSectionField('title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Sous-titre explicatif
                    </label>
                    <textarea
                      rows={2}
                      value={selectedSection.data.subtitle || ''}
                      onChange={(e) => updateSectionField('subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {selectedSection.id === 'featured_products' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre de la section
                    </label>
                    <input
                      type="text"
                      value={selectedSection.data.title || ''}
                      onChange={(e) => updateSectionField('title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Lien &apos;Consulter l&apos;ensemble du catalogue&apos;
                    </label>
                    <input
                      type="text"
                      value={selectedSection.data.linkText || ''}
                      onChange={(e) => updateSectionField('linkText', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {selectedSection.id === 'cta_banner' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Titre de la bannière
                    </label>
                    <input
                      type="text"
                      value={selectedSection.data.title || ''}
                      onChange={(e) => updateSectionField('title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Message d&apos;accroche
                    </label>
                    <textarea
                      rows={2}
                      value={selectedSection.data.subtitle || ''}
                      onChange={(e) => updateSectionField('subtitle', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Bouton Devis
                      </label>
                      <input
                        type="text"
                        value={selectedSection.data.buttonText || ''}
                        onChange={(e) => updateSectionField('buttonText', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Bouton WhatsApp
                      </label>
                      <input
                        type="text"
                        value={selectedSection.data.whatsappText || ''}
                        onChange={(e) => updateSectionField('whatsappText', e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Device Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3 sticky top-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-bold flex items-center gap-1.5 text-slate-800">
              <Sparkles className="w-4 h-4 text-[#F5A623]" />
              <span>Aperçu interactif en direct (Temps Réel)</span>
            </span>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#123D32] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Voir le site public</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Device Frame */}
          <div className="bg-slate-900 p-2 sm:p-4 rounded-3xl shadow-xl flex justify-center">
            <div
              className={`bg-[#F8F8F5] text-slate-900 rounded-2xl overflow-y-auto max-h-[750px] transition-all duration-300 border border-slate-800 shadow-inner ${
                previewDevice === 'mobile'
                  ? 'w-[375px] text-[11px]'
                  : previewDevice === 'tablet'
                  ? 'w-[768px] text-xs'
                  : 'w-full text-xs'
              }`}
            >
              {/* Dynamic render of sections in current drag & drop order */}
              {sections
                .filter((s) => s.visible)
                .map((sec) => (
                  <div
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`relative transition-all cursor-pointer border-2 border-transparent hover:border-emerald-500/70 ${
                      selectedSectionId === sec.id ? 'ring-2 ring-[#123D32] border-[#123D32]' : ''
                    }`}
                  >
                    {/* Badge Indicator in preview */}
                    <div className="absolute top-2 right-2 z-20 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs opacity-0 hover:opacity-100 transition-opacity">
                      Cliquer pour modifier
                    </div>

                    {/* Section 1: Hero */}
                    {sec.id === 'hero' && (
                      <div className="relative bg-[#123D32] text-white p-6 sm:p-10 overflow-hidden">
                        {sec.data.bgImage && (
                          <div className="absolute inset-0 z-0 opacity-40">
                            <img src={sec.data.bgImage} alt="Fond héro" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="relative z-10 space-y-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {sec.data.kicker || 'SOLEX SÉNÉGAL'}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                            {sec.data.title || "L'énergie solaire, à portée de vos projets."}
                          </h2>
                          <p className="text-xs text-emerald-100/90 leading-relaxed max-w-lg">
                            {sec.data.subtitle}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            <button className="px-4 py-2 bg-white text-[#123D32] rounded-lg font-bold text-xs">
                              {sec.data.ctaPrimaryText || 'Explorer le catalogue'}
                            </button>
                            <button className="px-4 py-2 bg-[#247A54] text-white rounded-lg font-bold text-xs">
                              {sec.data.ctaSecondaryText || 'Donner mon matériel & specs'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section 2: Highlights */}
                    {sec.id === 'highlights' && (
                      <div className="p-6 bg-white border-b border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-emerald-50 text-[#123D32] shrink-0">
                              <Sun className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{sec.data.item1Title}</div>
                              <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{sec.data.item1Desc}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-emerald-50 text-[#123D32] shrink-0">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{sec.data.item2Title}</div>
                              <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{sec.data.item2Desc}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-lg bg-emerald-50 text-[#123D32] shrink-0">
                              <Zap className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{sec.data.item3Title}</div>
                              <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{sec.data.item3Desc}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section 3: Categories */}
                    {sec.id === 'categories' && (
                      <div className="p-6 bg-[#F8F8F5] border-b border-slate-200">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <div className="text-[10px] font-bold text-[#123D32] uppercase">{sec.data.kicker}</div>
                            <div className="text-base font-extrabold text-slate-900">{sec.data.title}</div>
                          </div>
                          <span className="text-[10px] font-bold text-[#123D32]">{sec.data.linkText} &rarr;</span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {['Panneaux', 'Batteries', 'Onduleurs', 'MPPT', 'Kits', 'Pompage'].map((cat) => (
                            <div key={cat} className="p-2 bg-white rounded-lg border border-slate-200 text-center font-bold text-[10px]">
                              {cat}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 4: Solutions */}
                    {sec.id === 'solutions' && (
                      <div className="p-6 bg-white border-b border-slate-200">
                        <div className="mb-4">
                          <div className="text-[10px] font-bold text-[#123D32] uppercase">{sec.data.kicker}</div>
                          <div className="text-base font-extrabold text-slate-900">{sec.data.title}</div>
                          <div className="text-[11px] text-slate-500">{sec.data.subtitle}</div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['Maisons & Villas', 'Commerces & PME', 'Pompage & Forages', 'Installateurs'].map((sol) => (
                            <div key={sol} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                              <div className="font-bold text-xs text-slate-900">{sol}</div>
                              <div className="text-[10px] text-emerald-700 font-semibold mt-1">Découvrir &rarr;</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 5: Featured Products */}
                    {sec.id === 'featured_products' && (
                      <div className="p-6 bg-[#F8F8F5] border-b border-slate-200">
                        <div className="flex justify-between items-end mb-4">
                          <div>
                            <div className="text-[10px] font-bold text-[#123D32] uppercase">{sec.data.kicker}</div>
                            <div className="text-base font-extrabold text-slate-900">{sec.data.title}</div>
                          </div>
                          <span className="text-[10px] font-bold text-[#123D32]">{sec.data.linkText} &rarr;</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['LONGi Solar 580W', 'Felicity 5.12kWh', 'Deye Hybride 5kW', 'Pompe Inox Maraîchage'].map((item) => (
                            <div key={item} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                              <div className="aspect-[4/3] bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-slate-400">
                                Photo Produit
                              </div>
                              <div className="font-extrabold text-[11px] text-slate-900 truncate">{item}</div>
                              <div className="text-[9px] text-[#123D32] font-bold">Devis &amp; Prix WhatsApp</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 6: CTA Banner */}
                    {sec.id === 'cta_banner' && (
                      <div className="p-6 bg-[#123D32] text-white">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <h3 className="text-sm font-extrabold text-white">{sec.data.title}</h3>
                            <p className="text-[10px] text-emerald-100/90 mt-0.5">{sec.data.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-3 py-1.5 bg-white text-[#123D32] rounded-lg font-bold text-xs">
                              {sec.data.buttonText || 'Demander un devis'}
                            </span>
                            <span className="px-3 py-1.5 bg-[#25D366] text-white rounded-lg font-bold text-xs">
                              {sec.data.whatsappText || 'WhatsApp direct'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
