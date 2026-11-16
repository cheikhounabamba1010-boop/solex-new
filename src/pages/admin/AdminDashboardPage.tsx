import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Inbox,
  Clock,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Settings,
  Phone,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Layers,
  FolderOpen,
} from 'lucide-react';
import { api, AdminStats } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getStats();
      setStats(data);
    } catch {
      setError('Impossible de charger les données du tableau de bord.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Tableau de Bord
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vue d'ensemble de l'activité, du catalogue et des demandes de devis SOLEX.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Rafraîchir les données"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Actualiser</span>
          </button>

          <Link
            to="/admin/produits?action=new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#123D32] hover:bg-[#1b5244] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nouveau produit</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Demandes reçues */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Demandes reçues
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.totalQuotes ?? 0}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              {stats?.pendingQuotes ?? 0} en attente
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{stats?.inProgressQuotes ?? 0} en cours de traitement</span>
          </div>
        </div>

        {/* Metric 2: Produits au catalogue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Produits en ligne
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.publishedProducts ?? 0}
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              sur {stats?.totalProducts ?? 0} total
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <span>{stats?.draftProducts ?? 0} brouillon(s) non visible(s)</span>
          </div>
        </div>

        {/* Metric 3: Devis traités */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Devis traités
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats?.completedQuotes ?? 0}
            </span>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Finalisés
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Taux de réponse actif</span>
          </div>
        </div>

        {/* Metric 4: Visibilité et statut */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Statut du site
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-3 text-sm font-bold text-slate-900">
            SOLEX Sénégal Public
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Boutique & fiches techniques synchronisées en temps réel.
          </div>
          <div className="mt-3">
            <Link
              to="/admin/reglages"
              className="text-xs font-bold text-[#123D32] hover:underline inline-flex items-center gap-1"
            >
              <span>Gérer les coordonnées</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions shortcuts */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-extrabold tracking-wide">
            Accès rapide aux fonctionnalités clés
          </h2>
          <p className="text-xs text-slate-300">
            Mettez à jour le stock, répondez aux prospects ou personnalisez les informations de contact.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/constructeur"
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span>Constructeur Visuel (Glisser-Déposer)</span>
          </Link>
          <Link
            to="/admin/produits"
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gérer les produits</span>
          </Link>
          <Link
            to="/admin/mediatheque"
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FolderOpen className="w-3.5 h-3.5 text-sky-400" />
            <span>Médiathèque (Photos)</span>
          </Link>
          <Link
            to="/admin/demandes"
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Inbox className="w-3.5 h-3.5 text-amber-400" />
            <span>Voir les demandes ({stats?.pendingQuotes ?? 0})</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Voir le site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4. Recent Quotes Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              Dernières demandes de devis et contacts
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {stats?.recentQuotes?.length ?? 0}
            </span>
          </div>

          <Link
            to="/admin/demandes"
            className="text-xs font-bold text-[#123D32] hover:text-[#247A54] flex items-center gap-1"
          >
            <span>Toutes les demandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Chargement des dernières demandes...</span>
          </div>
        ) : !stats?.recentQuotes || stats.recentQuotes.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-600">Aucune demande reçue pour le moment.</p>
            <p className="mt-1 text-[11px]">Les demandes envoyées via les formulaires du site apparaîtront ici.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 font-bold">Client</th>
                  <th className="px-5 py-3 font-bold">Téléphone / Contact</th>
                  <th className="px-5 py-3 font-bold">Intérêt / Produit</th>
                  <th className="px-5 py-3 font-bold">Région</th>
                  <th className="px-5 py-3 font-bold">Statut</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentQuotes.slice(0, 6).map((quote) => {
                  const cleanPhone = quote.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('221') ? cleanPhone : `221${cleanPhone}`;

                  return (
                    <tr key={quote.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{quote.fullName}</div>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {quote.clientType || 'Particulier'}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-mono text-slate-800 font-medium">{quote.phone}</div>
                        {quote.email && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {quote.email}
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">
                          {quote.productName || quote.category || 'Demande générale'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                          {quote.message}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-slate-700">
                        {quote.region || 'Dakar'}
                      </td>

                      <td className="px-5 py-3.5">
                        {quote.status === 'nouveau' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            Nouveau
                          </span>
                        )}
                        {quote.status === 'en_cours' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                            En cours
                          </span>
                        )}
                        {quote.status === 'devis_envoye' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
                            Devis envoyé
                          </span>
                        )}
                        {quote.status === 'traite' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            Traité
                          </span>
                        )}
                        {quote.status === 'archive' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                            Archivé
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                              `Bonjour ${quote.fullName}, nous faisons suite à votre demande sur SOLEX concernant ${
                                quote.productName || 'votre projet solaire'
                              }.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="Répondre par WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={`tel:${quote.phone}`}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                            title="Appeler le client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>

                          <Link
                            to="/admin/demandes"
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold transition-colors"
                          >
                            Détails
                          </Link>
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
    </div>
  );
};
