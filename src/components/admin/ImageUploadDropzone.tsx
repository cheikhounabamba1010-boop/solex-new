import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  FolderOpen,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { api, MediaItem } from '../../services/api';

interface ImageUploadDropzoneProps {
  currentValue?: string;
  onImageSelected: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'landscape' | 'square' | 'wide' | 'auto';
  className?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  currentValue = '',
  onImageSelected,
  label = 'Image du produit ou visuel',
  helperText = 'Uploadez une photo depuis votre ordinateur ou smartphone (JPG, PNG, WebP).',
  aspectRatio = 'landscape',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setUploadError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await api.uploadImage(file);
      onImageSelected(res.url);
    } catch (err: any) {
      setUploadError(err.message || "Erreur lors de l'upload de l'image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const openMediaLibrary = async () => {
    setShowMediaPicker(true);
    setLoadingMedia(true);
    try {
      const items = await api.getMedia();
      setMediaList(items);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoadingMedia(false);
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : aspectRatio === 'landscape'
      ? 'aspect-[16/10]'
      : 'min-h-[160px]';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">{label}</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openMediaLibrary}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#123D32] hover:text-[#247A54] transition-colors cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Médiathèque SOLEX</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input supporting camera & gallery on mobile / desktop */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture={undefined}
        onChange={(e) => handleFileChange(e.target.files)}
        className="hidden"
      />

      {/* Dropzone Container */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden flex flex-col items-center justify-center p-4 text-center ${
          dragActive
            ? 'border-emerald-500 bg-emerald-50/50'
            : currentValue
            ? 'border-slate-300 bg-slate-50/70 hover:border-emerald-600'
            : 'border-slate-300 bg-white hover:border-emerald-600 hover:bg-slate-50'
        } ${aspectClass}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-6 space-y-3">
            <Loader2 className="w-8 h-8 text-[#123D32] animate-spin" />
            <div className="text-xs font-bold text-slate-800">
              Envoi de l&apos;image en cours...
            </div>
            <div className="text-[11px] text-slate-500">
              Traitement du fichier depuis votre appareil
            </div>
          </div>
        ) : currentValue ? (
          /* Preview Mode with Replace & Remove */
          <div className="relative w-full h-full flex flex-col items-center justify-center group">
            <img
              src={currentValue}
              alt="Aperçu sélectionné"
              className="max-h-48 sm:max-h-56 max-w-full object-contain rounded-xl p-1"
            />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl backdrop-blur-xs p-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Changer</span>
              </button>
              <button
                type="button"
                onClick={openMediaLibrary}
                className="px-3 py-1.5 rounded-lg bg-[#123D32] text-white text-xs font-bold hover:bg-[#1e5847] shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Médiathèque</span>
              </button>
              <button
                type="button"
                onClick={() => onImageSelected('')}
                className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer"
                title="Supprimer l'image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Upload Prompt */
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#123D32] flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-extrabold text-slate-800">
                Glissez-déposez une photo ici
              </div>
              <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
                {helperText}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#123D32] hover:bg-[#1a5142] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Parcourir / Photo téléphone</span>
              </button>

              <button
                type="button"
                onClick={openMediaLibrary}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Choisir dans la Médiathèque</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
          <X className="w-3.5 h-3.5" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Modal Médiathèque SOLEX */}
      {showMediaPicker && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setShowMediaPicker(false)}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#123D32] text-white flex items-center justify-center">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Médiathèque SOLEX (Type WordPress)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Sélectionnez une image enregistrée ou ajoutez-en une nouvelle
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaPicker(false);
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 bg-[#123D32] text-white text-xs font-bold rounded-lg hover:bg-[#1a5142] flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ajouter une image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMediaPicker(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingMedia ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-500 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-[#123D32]" />
                  <span>Chargement des médias...</span>
                </div>
              ) : mediaList.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
                  <div className="text-xs font-bold text-slate-700">
                    Aucune image encore uploadée dans les médias
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Vous pouvez envoyer directement une photo depuis votre téléphone ou votre ordinateur.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMediaPicker(false);
                      fileInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#123D32] text-white text-xs font-bold rounded-xl hover:bg-[#1a5142] cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choisir une photo maintenant</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {mediaList.map((m) => {
                    const isSelected = currentValue === m.url;
                    return (
                      <div
                        key={m.filename}
                        onClick={() => {
                          onImageSelected(m.url);
                          setShowMediaPicker(false);
                        }}
                        className={`group relative aspect-square bg-slate-100 rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-102 ${
                          isSelected
                            ? 'border-[#123D32] ring-2 ring-[#123D32]/30'
                            : 'border-slate-200 hover:border-[#123D32]'
                        }`}
                      >
                        <img
                          src={m.url}
                          alt={m.filename}
                          className="w-full h-full object-cover p-1"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#123D32] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 p-1.5 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition-opacity">
                          {m.filename}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
