import React, { useEffect, useState, useMemo } from 'react';
import {
  Inbox,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Tag,
  CheckCircle,
  Clock,
  Trash2,
  X,
  FileText,
  AlertCircle,
  Save,
} from 'lucide-react';
import { api, QuoteItem } from '../../services/api';

const STATUS_OPTIONS: { id: QuoteItem['status']; label: string; color: string }[] = [
  { id: 'nouveau', label: 'Nouveau', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'en_cours', label: 'En cours', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'devis_envoye', label: 'Devis envoyé', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'traite', label: 'Traité & Validé', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'archive', label: 'Archivé', color: 'bg-slate-100 text-slate-700 border-slate-200' },
];

export const AdminQuotesPage: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<QuoteItem | null>(null);

  // Detail Modal internal notes state
  const [currentNotes, setCurrentNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const data = await api.getQuotes();
      setQuotes(data);
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        q.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.phone.includes(searchQuery) ||
        (q.email && q.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.productName && q.productName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.category && q.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.message && q.message.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTab = activeTab === 'all' || q.status === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [quotes, searchQuery, activeTab]);

  const handleOpenDetail = (quote: QuoteItem) => {
    setSelectedQuote(quote);
    setCurrentNotes(quote.notes || '');
  };

  const handleUpdateStatus = async (id: string, newStatus: QuoteItem['status']) => {
    try {
      setUpdatingStatus(true);
      const updated = await api.updateQuoteStatus(id, newStatus);
      setQuotes((prev) => prev.map((q) => (q.id === id ? updated : q)));
      if (selectedQuote?.id === id) {
        setSelectedQuote(updated);
      }
    } catch {
      alert('Erreur lors de la mise à jour du statut.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedQuote) return;
    try {
      setSavingNotes(true);
      const updated = await api.updateQuoteStatus(selectedQuote.id, selectedQuote.status, currentNotes);
      setQuotes((prev) => prev.map((q) => (q.id === selectedQuote.id ? updated : q)));
      setSelectedQuote(updated);
    } catch {
      alert('Erreur lors de la sauvegarde des notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteQuote(id);
      setQuotes((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuote?.id === id) setSelectedQuote(null);
      setDeleteConfirmId(null);
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Demandes de Devis & Contacts
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi commercial des demandes de prix, fiches techniques et projets solaires reçus sur le site.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs">
          Total : <strong className="text-slate-900">{quotes.length}</strong> demandes enregistrées
        </div>
      </div>

      {/* 2. Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#123D32] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Toutes ({quotes.length})
          </button>
          {STATUS_OPTIONS.map((opt) => {
            const count = quotes.filter((q) => q.status === opt.id).length;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveTab(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === opt.id
                    ? 'bg-[#123D32] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeTab === opt.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom de client, numéro de téléphone, produit ou région..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
          />
        </div>
      </div>

      {/* 3. Table of Quotes */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Chargement des demandes...</span>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">Aucune demande trouvée.</p>
            <p className="mt-1 text-slate-400">Aucun message ne correspond aux critères sélectionnés.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Client / Profil</th>
                  <th className="px-5 py-3.5 font-bold">Contact</th>
                  <th className="px-5 py-3.5 font-bold">Besoin / Équipement</th>
                  <th className="px-5 py-3.5 font-bold">Région</th>
                  <th className="px-5 py-3.5 font-bold">Date</th>
                  <th className="px-5 py-3.5 font-bold">Statut</th>
                  <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotes.map((quote) => {
                  const cleanPhone = quote.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('221') ? cleanPhone : `221${cleanPhone}`;
                  const formattedDate = new Date(quote.createdAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={quote.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => handleOpenDetail(quote)}
                    >
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{quote.fullName}</div>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {quote.clientType || 'Particulier'}
                        </div>
                      </td>

                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <div className="font-mono text-slate-800 font-medium">{quote.phone}</div>
                        {quote.email && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                            {quote.email}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">
                          {quote.productName || quote.category || 'Demande globale'}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[220px]">
                          {quote.message}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-slate-700">
                        {quote.region || 'Dakar'}
                      </td>

                      <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                        {formattedDate}
                      </td>

                      <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={quote.status}
                          onChange={(e) =>
                            handleUpdateStatus(quote.id, e.target.value as QuoteItem['status'])
                          }
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="nouveau">🟡 Nouveau</option>
                          <option value="en_cours">🔵 En cours</option>
                          <option value="devis_envoye">🟣 Devis envoyé</option>
                          <option value="traite">🟢 Traité & Validé</option>
                          <option value="archive">⚪ Archivé</option>
                        </select>
                      </td>

                      <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                              `Bonjour ${quote.fullName}, nous faisons suite à votre demande sur SOLEX concernant ${
                                quote.productName || 'votre projet solaire'
                              }.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Répondre sur WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* Call */}
                          <a
                            href={`tel:${quote.phone}`}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            title="Appeler"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          {/* Detail button */}
                          <button
                            onClick={() => handleOpenDetail(quote)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Détails
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(quote.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Supprimer la demande"
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
              Supprimer cette demande ?
            </h3>
            <p className="text-center text-xs text-slate-500 mt-1">
              Cette demande sera définitivement retirée de l'historique SOLEX.
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
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-xs cursor-pointer"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Detail & Note Drawer Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 my-auto overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Fiche Demande #{selectedQuote.id.slice(-6)}
                </h2>
              </div>

              <button
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Contact Information Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-base font-extrabold text-slate-900">
                    {selectedQuote.fullName}
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                    {selectedQuote.clientType || 'Particulier'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono font-medium">{selectedQuote.phone}</span>
                  </div>
                  {selectedQuote.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{selectedQuote.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{selectedQuote.region || 'Dakar'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{new Date(selectedQuote.createdAt).toLocaleString('fr-FR')}</span>
                  </div>
                </div>

                {/* Direct Action buttons */}
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedQuote.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Bonjour ${selectedQuote.fullName}, suite à votre demande sur le site SOLEX pour ${
                        selectedQuote.productName || 'votre projet solaire'
                      }...`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ouvrir dans WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${selectedQuote.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Appeler</span>
                  </a>
                </div>
              </div>

              {/* Message & Equipment Requested */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Détail du besoin
                </h3>
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  {selectedQuote.productName && (
                    <div className="flex items-center gap-2 text-xs">
                      <Tag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-500">Matériel demandé :</span>
                      <strong className="text-slate-900">{selectedQuote.productName}</strong>
                    </div>
                  )}

                  {selectedQuote.category && (
                    <div className="flex items-center gap-2 text-xs">
                      <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-500">Catégorie :</span>
                      <span className="text-slate-800 font-medium">{selectedQuote.category}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {selectedQuote.message}
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Changer le statut
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus(selectedQuote.id, opt.id)}
                      className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        selectedQuote.status === opt.id
                          ? `${opt.color} ring-2 ring-emerald-600 shadow-xs font-extrabold`
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Notes internes (commercial / suivi)
                  </h3>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingNotes ? 'Enregistrement...' : 'Enregistrer la note'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  placeholder="Ex: Devis envoyé par email à 14h30, en attente de validation client..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setDeleteConfirmId(selectedQuote.id)}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer cette demande</span>
              </button>

              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
