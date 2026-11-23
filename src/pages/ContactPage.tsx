import React, { useState } from 'react';
import { Phone, Mail, Globe, MessageCircle, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';
import {
  SOLEX_PHONE_1,
  SOLEX_PHONE_2,
  SOLEX_EMAIL,
  SOLEX_WEBSITE,
  getWhatsAppUrl,
} from '../utils/whatsapp';
import { QuoteFormData } from '../types';
import { useContent } from '../context/ContentContext';
import { PageHeader } from '../components/common/PageHeader';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const { get } = useContent();
  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: '',
    phone: '',
    email: '',
    clientType: 'Particulier',
    category: 'Tous équipements',
    productName: '',
    region: 'Dakar',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Veuillez saisir votre nom.';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Veuillez saisir votre numéro de téléphone.';
    } else if (formData.phone.trim().length < 8) {
      newErrors.phone = 'Numéro de téléphone incomplet.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSending(true);
      try {
        await api.submitQuote({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          clientType: formData.clientType,
          category: formData.category,
          productName: formData.productName,
          region: formData.region,
          message: formData.message,
          type: 'contact',
        });
      } catch (err) {
        console.error('Failed to submit contact quote:', err);
      } finally {
        setSending(false);
        setSubmitted(true);
      }
    }
  };

  const buildWhatsAppMessage = () => {
    return `Bonjour SOLEX, je vous contacte depuis votre site internet :\n\n- Nom : ${formData.fullName}\n- Téléphone : ${formData.phone}\n- Profil : ${formData.clientType}\n- Région : ${formData.region}\n- Demande : ${formData.message || 'Demande de renseignement / cotation'}`;
  };

  return (
    <div className="bg-[#F8F8F5] min-h-screen">
      {/* En-tête concis */}
      <PageHeader
        title={get('contact.header.title')}
        description={get('contact.header.description')}
        kicker={get('contact.header.kicker')}
        imageSrc={get('contact.header.image')}
        breadcrumbs={[
          { label: 'Accueil', to: '/' },
          { label: 'Contact' },
        ]}
      />

      <div className="w-full max-w-[1560px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Coordonnées officielles groupées */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#247A54]">
                  {get('contact.info.label')}
                </span>
                <h2 className="text-xl font-bold text-neutral-900 mt-1">
                  {get('contact.info.title')}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {get('contact.info.text')}
                </p>
              </div>

              {/* Téléphones clairs */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-[#123D32] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Téléphone principal :</span>
                    <div>
                      <a
                        href={`tel:${SOLEX_PHONE_1.replace(/\s+/g, '')}`}
                        className="text-base font-bold font-mono text-[#123D32] hover:underline"
                      >
                        {SOLEX_PHONE_1}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 text-neutral-600 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Téléphone secondaire :</span>
                    <div>
                      <a
                        href={`tel:${SOLEX_PHONE_2.replace(/\s+/g, '')}`}
                        className="text-base font-bold font-mono text-neutral-800 hover:underline"
                      >
                        {SOLEX_PHONE_2}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-[#123D32] shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Email :</span>
                    <div>
                      <a
                        href={`mailto:${SOLEX_EMAIL}`}
                        className="text-sm font-semibold text-neutral-900 hover:underline"
                      >
                        {SOLEX_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-[#123D32] shrink-0 mt-0.5">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Site web :</span>
                    <div className="text-sm font-mono text-neutral-800">
                      {SOLEX_WEBSITE}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-50 text-[#D98205] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Localisation :</span>
                    <div className="text-sm font-medium text-neutral-800">
                      Dakar, Sénégal (Livraisons nationales)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 text-neutral-600 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 font-medium">Horaires d&apos;ouverture :</span>
                    <div className="text-xs font-medium text-neutral-800">
                      Lundi – Samedi : 08h30 – 18h00
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton WhatsApp direct */}
              <div className="pt-2">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discussion directe sur WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Formulaire simple et direct */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 text-[#123D32] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Votre message a bien été transmis
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                    Merci {formData.fullName}. Un conseiller SOLEX examinera votre demande et vous contactera au{' '}
                    <span className="font-mono font-bold text-neutral-800">{formData.phone}</span> dans les 24 heures.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <a
                      href={getWhatsAppUrl(buildWhatsAppMessage())}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-lg text-xs font-bold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirmer aussi sur WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          phone: '',
                          email: '',
                          clientType: 'Particulier',
                          category: 'Tous équipements',
                          productName: '',
                          region: 'Dakar',
                          message: '',
                        });
                      }}
                      className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Nouveau message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">
                      Envoyez-nous votre demande
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Remplissez ce formulaire court pour recevoir une cotation adaptée.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Nom complet */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">
                        Nom complet <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Cheikh Diop"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123D32] ${
                          errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                        }`}
                      />
                      {errors.fullName && <p className="text-[11px] text-rose-500">{errors.fullName}</p>}
                    </div>

                    {/* Téléphone */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">
                        Téléphone (WhatsApp) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: 77 123 45 67"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-3.5 py-2.5 text-xs bg-neutral-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123D32] ${
                          errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-neutral-200'
                        }`}
                      />
                      {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Vous êtes */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">
                        Vous êtes
                      </label>
                      <select
                        value={formData.clientType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientType: e.target.value as QuoteFormData['clientType'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      >
                        <option value="Particulier">Particulier (Maison / Villa)</option>
                        <option value="Installateur">Installateur / Électricien pro</option>
                        <option value="Entreprise">Entreprise / Commerce / Clinique</option>
                        <option value="Revendeur">Revendeur / Distributeur</option>
                      </select>
                    </div>

                    {/* Région */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-700">
                        Région de livraison
                      </label>
                      <select
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#123D32]"
                      >
                        <option value="Dakar">Dakar et banlieue</option>
                        <option value="Thiès">Thiès (Mbour, Saly)</option>
                        <option value="Saint-Louis">Saint-Louis / Vallée</option>
                        <option value="Kaolack">Kaolack / Fatick</option>
                        <option value="Ziguinchor">Casamance (Ziguinchor, Cap Skirring)</option>
                        <option value="Autre région">Autre région du Sénégal</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-700">
                      Votre besoin ou liste d&apos;appareils
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Précisez votre besoin (ex: pack solaire pour villa avec 2 climatiseurs, ou devis sur onduleur Deye 5kW...)"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#123D32] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3 px-6 bg-[#123D32] hover:bg-[#1E6746] text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {sending ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Envoi en cours...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Envoyer ma demande de devis</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
