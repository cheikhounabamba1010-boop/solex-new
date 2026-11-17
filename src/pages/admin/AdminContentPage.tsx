import React, { useEffect, useMemo, useState } from 'react';
import { Check, ExternalLink, Loader2, RotateCcw, Save } from 'lucide-react';
import { api } from '../../services/api';
import { CONTENT_PAGES, CONTENT_DEFAULTS, ContentField } from '../../content/registry';
import { ImageUploadDropzone } from '../../components/admin/ImageUploadDropzone';
import { useContent } from '../../context/ContentContext';

export const AdminContentPage: React.FC = () => {
  const { refresh } = useContent();
  const [pageId, setPageId] = useState(CONTENT_PAGES[0].id);
  const [saved, setSaved] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const page = CONTENT_PAGES.find((p) => p.id === pageId) || CONTENT_PAGES[0];

  const buildDraft = (overrides: Record<string, string>) => {
    const d: Record<string, string> = {};
    for (const key of Object.keys(CONTENT_DEFAULTS)) {
      d[key] = overrides[key] && overrides[key] !== '' ? overrides[key] : CONTENT_DEFAULTS[key];
    }
    return d;
  };

  useEffect(() => {
    api
      .getContent()
      .then((data) => {
        setSaved(data);
        setDraft(buildDraft(data));
      })
      .catch(() => {
        setError('Impossible de charger les contenus. Rafraîchissez la page.');
        setDraft(buildDraft({}));
      })
      .finally(() => setLoading(false));
  }, []);

  const pageKeys = useMemo(
    () => page.groups.flatMap((g) => g.fields.map((f) => f.key)),
    [page]
  );

  const effectiveSaved = (key: string) =>
    saved[key] && saved[key] !== '' ? saved[key] : CONTENT_DEFAULTS[key];

  const dirtyKeys = pageKeys.filter((k) => draft[k] !== effectiveSaved(k));
  const isDirty = dirtyKeys.length > 0;

  const setValue = (key: string, value: string) => {
    setSuccess(false);
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Une valeur identique au texte par défaut = on supprime la modification (null)
      const values: Record<string, string | null> = {};
      for (const key of pageKeys) {
        values[key] = draft[key] === CONTENT_DEFAULTS[key] ? null : draft[key];
      }
      const result = await api.updateContent(values);
      setSaved(result);
      await refresh();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Échec de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field: ContentField) => {
    const modified = draft[field.key] !== CONTENT_DEFAULTS[field.key];
    return (
      <div key={field.key} className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <label className="block text-xs font-semibold text-slate-700">{field.label}</label>
          {modified && (
            <button
              type="button"
              onClick={() => setValue(field.key, CONTENT_DEFAULTS[field.key])}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 cursor-pointer"
              title="Revenir au texte d'origine"
            >
              <RotateCcw className="w-3 h-3" />
              Rétablir l'original
            </button>
          )}
        </div>

        {field.type === 'text' && (
          <input
            type="text"
            value={draft[field.key] ?? ''}
            onChange={(e) => setValue(field.key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
          />
        )}

        {field.type === 'textarea' && (
          <textarea
            rows={4}
            value={draft[field.key] ?? ''}
            onChange={(e) => setValue(field.key, e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
          />
        )}

        {field.type === 'image' && (
          <ImageUploadDropzone
            label="Image"
            helperText="Glissez une photo, ou choisissez-en une dans la médiathèque."
            currentValue={draft[field.key] ?? ''}
            onImageSelected={(url) => setValue(field.key, url || CONTENT_DEFAULTS[field.key])}
            aspectRatio="landscape"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Textes & images des pages
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Modifiez les contenus de chaque page. Le site public est mis à jour dès que vous enregistrez.
          La page d'accueil se modifie dans « Constructeur Visuel ».
        </p>
      </div>

      {/* Choix de la page */}
      <div className="flex flex-wrap gap-2">
        {CONTENT_PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPageId(p.id);
              setSuccess(false);
              setError(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              p.id === pageId
                ? 'bg-[#123D32] text-white border-[#123D32]'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{page.description}</p>
        <a
          href={page.path}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
        >
          Voir la page <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Groupes de champs */}
      <div className="space-y-5">
        {page.groups.map((group) => (
          <section key={group.title} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">{group.title}</h2>
            <div className="space-y-4">{group.fields.map(renderField)}</div>
          </section>
        ))}
      </div>

      {/* Barre d'enregistrement */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-slate-200 px-4 py-3 flex items-center justify-end gap-3 lg:pl-72">
        {success && !isDirty && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <Check className="w-4 h-4" /> Enregistré, le site est à jour
          </span>
        )}
        {isDirty && (
          <span className="text-xs text-slate-500">
            {dirtyKeys.length} modification{dirtyKeys.length > 1 ? 's' : ''} non enregistrée{dirtyKeys.length > 1 ? 's' : ''}
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !isDirty}
          className="px-5 py-2.5 rounded-xl bg-[#123D32] hover:bg-[#1a5142] text-xs font-bold text-white flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Enregistrer cette page
        </button>
      </div>
    </div>
  );
};
