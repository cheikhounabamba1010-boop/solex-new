import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  MessageCircle,
  Sliders,
  Sparkles,
  Zap,
  Building,
  User,
  Wrench,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';
import { api } from '../services/api';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  initialMode?: 'custom' | 'proposal';
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  productName = '',
  initialMode = 'custom',
}) => {
  // Mode: 'custom' (le client donne équipement, marque, specs) ou 'proposal' (demande une proposition / dimensionnement)
  const [mode, setMode] = useState<'custom' | 'proposal'>(initialMode);

  // Form states
  const [clientType, setClientType] = useState<'Particulier' | 'Installateur' | 'Entreprise' | 'Revendeur'>('Particulier');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('Dakar');

  // Custom equipment specifications fields
  const [equipmentType, setEquipmentType] = useState(productName || 'Panneaux solaires');
  const [customBrand, setCustomBrand] = useState('');
  const [technicalSpecs, setTechnicalSpecs] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [appliancesOrNeeds, setAppliancesOrNeeds] = useState('');

  // Proposal / Sizing fields
  const [usageType, setUsageType] = useState('Maison / Villa résidentielle');
  const [monthlyBill, setMonthlyBill] = useState('30 000 - 80 000 FCFA');
  const [energyGoal, setEnergyGoal] = useState('Réduire la facture Senelec & secours coupures');

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (productName) {
      setEquipmentType(productName);
      setMode('custom');
    }
  }, [productName]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) newErrors.fullName = 'Veuillez saisir votre nom.';
    if (!phone.trim()) {
      newErrors.phone = 'Veuillez renseigner votre numéro de téléphone (WhatsApp).';
    } else if (phone.trim().replace(/[^0-9]/g, '').length < 8) {
      newErrors.phone = 'Numéro de téléphone incomplet.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFullSummaryMessage = () => {
    if (mode === 'custom') {
      return `Demande d'équipement spécifique :\n- Équipement : ${equipmentType}\n- Marque souhaitée : ${customBrand || 'Non précisée / Conseillée par SOLEX'}\n- Spécifications techniques : ${technicalSpecs || 'Selon recommandation SOLEX'}\n- Quantité : ${quantity}\n- Besoins / Appareils : ${appliancesOrNeeds || 'Non spécifié'}`;
    } else {
      return `Demande de proposition personnalisée (Dimensionnement) :\n- Usage : ${usageType}\n- Facture électrique mensuelle : ${monthlyBill}\n- Objectif énergétique : ${energyGoal}\n- Appareils à faire fonctionner : ${appliancesOrNeeds || 'Standard'}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    try {
      const summaryMessage = getFullSummaryMessage();
      await api.submitQuote({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        clientType,
        category: mode === 'custom' ? equipmentType : 'Proposition sur mesure',
        productName: mode === 'custom' ? `${equipmentType} ${customBrand ? `(${customBrand})` : ''}` : 'Dimensionnement personnalisé',
        region,
        message: summaryMessage,
        type: 'devis',
      });
    } catch (err) {
      console.error('Failed to submit quote:', err);
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  };

  const buildWhatsAppMessage = () => {
    return `Bonjour SOLEX, je transmets mes besoins solaires depuis votre site :\n\n👤 *Client* : ${fullName} (${clientType})\n📍 *Région* : ${region}\n📞 *Téléphone* : ${phone}\n\n📋 *Détail de ma demande* :\n${getFullSummaryMessage()}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-neutral-200 bg-neutral-50/90 shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#123D32] bg-emerald-100/70 px-2 py-0.5 rounded-full">
              SOLEX SÉNÉGAL · ÉQUIPEMENTS &amp; SOLUTIONS
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 mt-1">
              Configuration de votre besoin &amp; Cotation
            </h3>
            <p className="text-xs text-neutral-500">
              Définissez votre matériel ou sollicitez une proposition de nos ingénieurs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200/60 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 sm:py-12 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-100 text-[#123D32] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-[#247A54]" />
              </div>
              <h4 className="text-xl font-extrabold text-neutral-900">
                Demande enregistrée avec succès !
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Merci <span className="font-bold text-neutral-900">{fullName}</span>. Notre équipe technique SOLEX examine vos critères et vous répondra au{' '}
                <span className="font-mono font-bold text-neutral-900">{phone}</span> sous 24h.
              </p>

              <div className="pt-4 flex flex-col gap-2.5">
                <a
                  href={getWhatsAppUrl(undefined, buildWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#25D366] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-[#20ba59] transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Accélérer et échanger directement sur WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="text-xs text-neutral-500 hover:text-neutral-800 py-1.5 font-medium cursor-pointer"
                >
                  Fermer cette fenêtre
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Option Selector: Donner son matériel OU Demander une proposition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 bg-neutral-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setMode('custom')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'custom'
                      ? 'bg-white text-[#123D32] shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>1. Je définis mon matériel &amp; mes specs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('proposal')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'proposal'
                      ? 'bg-[#123D32] text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
                  <span>2. Demander une proposition sur mesure</span>
                </button>
              </div>

              {/* Mode A: L'utilisateur saisit lui-même équipement, marque et spécifications */}
              {mode === 'custom' ? (
                <div className="space-y-4 bg-neutral-50/60 p-4 sm:p-5 rounded-2xl border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#123D32]" />
                      Votre sélection de matériel
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Remplissez librement
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Équipement recherché */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Type d&apos;équipement
                      </label>
                      <input
                        type="text"
                        value={equipmentType}
                        onChange={(e) => setEquipmentType(e.target.value)}
                        placeholder="Ex: Onduleur hybride, Panneaux, Batterie lithium..."
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      />
                    </div>

                    {/* Marque souhaitée */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Marque souhaitée
                      </label>
                      <input
                        type="text"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        placeholder="Ex: Deye, Felicity, Jinko, Growatt, Victron ou Sans préférence"
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      />
                    </div>

                    {/* Spécifications techniques */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Spécifications techniques &amp; Caractéristiques
                      </label>
                      <input
                        type="text"
                        value={technicalSpecs}
                        onChange={(e) => setTechnicalSpecs(e.target.value)}
                        placeholder="Ex: 5 kW / 48V / 10 kWh / 550Wc / Monophasé / MPPT 100A..."
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      />
                    </div>

                    {/* Quantité */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Quantité souhaitée
                      </label>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Ex: 1 pièce, 6 panneaux, 2 batteries..."
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      />
                    </div>

                    {/* Appareils à alimenter / besoins */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Appareils prioritaires à alimenter
                      </label>
                      <input
                        type="text"
                        value={appliancesOrNeeds}
                        onChange={(e) => setAppliancesOrNeeds(e.target.value)}
                        placeholder="Ex: 2 clim, réfrigérateur, télé, éclairage..."
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Mode B: Demande de proposition sur mesure / Dimensionnement */
                <div className="space-y-4 bg-emerald-50/40 p-4 sm:p-5 rounded-2xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#123D32] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
                      Proposition sur mesure par nos ingénieurs
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold">
                      Étude gratuite &amp; sans engagement
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Usage */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Type de projet / Bâtiment
                      </label>
                      <select
                        value={usageType}
                        onChange={(e) => setUsageType(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      >
                        <option value="Maison / Villa résidentielle">Maison / Villa résidentielle</option>
                        <option value="Commerce / Magasin / Bureau">Commerce / Magasin / Bureau</option>
                        <option value="Pompage agricole / Puits / Forage">Pompage agricole / Puits / Forage</option>
                        <option value="Clinique / École / Hangar">Clinique / École / Hangar</option>
                        <option value="Site isolé sans réseau électrique">Site isolé (autonomie 100%)</option>
                      </select>
                    </div>

                    {/* Facture électrique */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Facture Senelec moyenne par mois
                      </label>
                      <select
                        value={monthlyBill}
                        onChange={(e) => setMonthlyBill(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      >
                        <option value="Moins de 30 000 FCFA">Moins de 30 000 FCFA</option>
                        <option value="30 000 - 80 000 FCFA">30 000 - 80 000 FCFA</option>
                        <option value="80 000 - 200 000 FCFA">80 000 - 200 000 FCFA</option>
                        <option value="Plus de 200 000 FCFA">Plus de 200 000 FCFA</option>
                        <option value="Pas de réseau (site autonome)">Pas de réseau (site autonome)</option>
                      </select>
                    </div>

                    {/* Objectif principal */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Votre priorité principale
                      </label>
                      <select
                        value={energyGoal}
                        onChange={(e) => setEnergyGoal(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      >
                        <option value="Réduire la facture Senelec & secours coupures">
                          Réduire ma facture d&apos;électricité et me protéger des coupures
                        </option>
                        <option value="Autonomie totale (zéro facture)">
                          Autonomie complète (indépendance énergétique totale)
                        </option>
                        <option value="Pompage solaire uniquement (agriculture / élevage)">
                          Pompage solaire pour forage ou irrigation
                        </option>
                        <option value="Sécuriser des équipements sensibles (serveurs, froid)">
                          Sécuriser des équipements professionnels (froid, serveurs, médical)
                        </option>
                      </select>
                    </div>

                    {/* Détail libre */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Vos appareils ou remarques particulières
                      </label>
                      <textarea
                        rows={2}
                        value={appliancesOrNeeds}
                        onChange={(e) => setAppliancesOrNeeds(e.target.value)}
                        placeholder="Ex : J'aimerais alimenter 2 climatiseurs la nuit et garder mon frigo allumé en permanence..."
                        className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Vos coordonnées & Profil */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  Vos coordonnées pour vous transmettre la proposition
                </span>

                {/* Profil client */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
                  {(['Particulier', 'Installateur', 'Entreprise', 'Revendeur'] as const).map(
                    (type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setClientType(type)}
                        className={`py-2 px-2.5 rounded-xl border text-center text-[11px] font-semibold transition-all cursor-pointer ${
                          clientType === type
                            ? 'bg-[#123D32] text-white border-[#123D32] shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Nom complet <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Cheikh Diop"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32] ${
                        errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-300'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-rose-500">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Téléphone WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+221 77 ... ou 76 ..."
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32] font-mono ${
                        errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-300'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-rose-500">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Région au Sénégal
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                    >
                      <option value="Dakar">Dakar &amp; banlieue</option>
                      <option value="Thiès">Thiès (Mbour, Saly, Tivaouane)</option>
                      <option value="Saint-Louis">Saint-Louis &amp; Vallée</option>
                      <option value="Kaolack">Kaolack / Fatick / Kaffrine</option>
                      <option value="Touba / Diourbel">Touba / Diourbel</option>
                      <option value="Ziguinchor">Casamance (Ziguinchor, Cap Skirring)</option>
                      <option value="Autre région">Autre région du Sénégal</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Pour recevoir le devis au format PDF"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:flex-1 py-3 px-5 bg-[#123D32] hover:bg-[#1a5142] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmission en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {mode === 'custom'
                          ? 'Transmettre mes critères & Demander le devis'
                          : 'Demander ma proposition sur mesure'}
                      </span>
                    </>
                  )}
                </button>

                <a
                  href={getWhatsAppUrl(undefined, buildWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Sur WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
