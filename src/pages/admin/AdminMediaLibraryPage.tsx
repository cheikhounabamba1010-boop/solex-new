import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FolderOpen,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Loader2,
  HardDrive,
} from 'lucide-react';
import { api, MediaItem } from '../../services/api';

export const AdminMediaLibraryPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const data = await api.getMedia();
      setMediaList(data);
    } catch (err) {
      console.error('Failed to load media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      try {
        await api.uploadImage(file);
        successCount++;
      } catch (err) {
        console.error('Upload failed for file:', file.name, err);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (successCount > 0) {
      showNotice(`${successCount} image(s) uploadée(s) avec succès !`);
      await loadMedia();
    }
  };

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Supprimer définitivement l'image "${filename}" ?`)) return;

    try {
      await api.deleteMedia(filename);
      setMediaList((prev) => prev.filter((m) => m.filename !== filename));
      showNotice('Image supprimée de la médiathèque.');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredMedia = mediaList.filter((m) =>
    m.filename.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-wider uppercase border border-emerald-200">
            <HardDrive className="w-3 h-3 text-[#F5A623]" />
            <span>MÉDIATHÈQUE SOLEX (TYPE WORDPRESS)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Gestionnaire des fichiers &amp; photos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Uploadez vos photos depuis votre téléphone ou votre ordinateur et utilisez-les partout sur le site.
          </p>
        </div>

        {/* Upload Trigger */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFilesUpload(e.target.files)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl bg-[#123D32] hover:bg-[#1a5142] text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Upload en cours...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Téléverser des images (PC / Smartphone)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Drag & Drop Upload Banner */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFilesUpload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50/70 hover:bg-emerald-50/30 rounded-2xl p-6 sm:p-8 text-center transition-colors flex flex-col items-center justify-center space-y-2 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-[#123D32] flex items-center justify-center">
          <Smartphone className="w-6 h-6" />
        </div>
        <div className="text-xs sm:text-sm font-extrabold text-slate-800">
          Glissez vos images ici ou cliquez pour choisir depuis votre appareil
        </div>
        <p className="text-[11px] text-slate-500 max-w-sm">
          Compatible photos smartphone haute définition, formats JPG, PNG, WebP. Fichiers sauvegardés directement sur votre serveur SOLEX.
        </p>
      </div>

      {/* Search & Counter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom de fichier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold self-end sm:self-center">
          {filteredMedia.length} image(s) dans la médiathèque
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#123D32]" />
          <span>Chargement de la médiathèque...</span>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-extrabold text-slate-800">
            {searchQuery ? 'Aucun fichier correspondant' : 'Médiathèque vide'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchQuery
              ? 'Essayez une autre recherche.'
              : 'Commencez par ajouter des photos depuis votre smartphone ou votre ordinateur.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((media) => (
            <div
              key={media.filename}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#123D32] hover:shadow-md transition-all group flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center p-2">
                <img
                  src={media.url}
                  alt={media.filename}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />

                {/* Hover overlay with action buttons */}
                <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-2xs">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(media.url)}
                    className="p-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-md cursor-pointer"
                    title="Copier le lien"
                  >
                    {copiedUrl === media.url ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 shadow-md inline-block"
                    title="Ouvrir l'image originale"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(media.filename)}
                    className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-md cursor-pointer"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Media details */}
              <div className="p-3 bg-white space-y-1">
                <div className="text-xs font-bold text-slate-900 truncate" title={media.filename}>
                  {media.filename}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{formatFileSize(media.size)}</span>
                  <span>{new Date(media.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
