import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface ProductRecord {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  categoryLabel: string;
  brand: string;
  tagline: string;
  summary: string;
  description: string;
  image: string;
  gallery: string[];
  specs: { label: string; value: string }[];
  keyFeatures: string[];
  warranty: string;
  application: string;
  availabilityNote: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRecord {
  id: string;
  type: 'devis' | 'contact';
  fullName: string;
  phone: string;
  email?: string;
  clientType: string;
  category?: string;
  productName?: string;
  region: string;
  message: string;
  status: 'nouveau' | 'en_cours' | 'devis_envoye' | 'traite' | 'archive';
  notes?: string;
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  signature: string;
  phone1: string;
  phone2: string;
  email: string;
  website: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
}

export interface AdminCredentials {
  username: string;
  salt: string;
  hash: string;
  tokenSecret: string;
}

export interface PageSection {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  data: Record<string, any>;
}

export interface DatabaseStore {
  admin: AdminCredentials;
  settings: SiteSettings;
  layout: PageSection[];
  products: ProductRecord[];
  quotes: QuoteRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Password hashing utility using standard crypto
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function generateToken(username: string, secret: string): string {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24h
  const payload = `${username}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

export function verifyToken(token: string, secret: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return { valid: false };
    const [username, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return { valid: false };

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${username}:${expiresAt}`)
      .digest('hex');

    if (signature === expectedSignature) {
      return { valid: true, username };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

export function getDefaultLayout(): PageSection[] {
  return [
    {
      id: 'hero',
      name: 'Bannière Héro & Configurateur Express',
      visible: true,
      order: 0,
      data: {
        title: "L'énergie solaire, à portée de vos projets.",
        subtitle: "Distribution d'équipements solaires fiables et certifiés au Sénégal. Panneaux, batteries, onduleurs et pompes solaires disponibles à Dakar et expédiés dans toutes les régions.",
        kicker: "SOLEX SÉNÉGAL · LE SOLAIRE À VOTRE PORTÉE",
        bgImage: '',
        ctaPrimaryText: 'Explorer le catalogue',
        ctaPrimaryLink: '/produits',
        ctaSecondaryText: 'Donner mon matériel & specs',
        badge1: 'Matériel certifié constructeur',
        badge2: 'Stock disponible à Dakar',
        badge3: 'Livraison partout au Sénégal',
      },
    },
    {
      id: 'highlights',
      name: 'Les 3 Engagements Clés SOLEX',
      visible: true,
      order: 1,
      data: {
        item1Title: 'Vente détail & gros',
        item1Desc: 'Panneaux, batteries lithium, onduleurs et pompes adaptés aux particuliers, artisans et entreprises.',
        item2Title: 'Marques de référence',
        item2Desc: "LONGi, Jinko Solar, Deye, MUST, Felicity Solar, Victron. Matériel d'origine avec garanties constructeurs.",
        item3Title: 'Devis & Conseil sous 24h',
        item3Desc: 'Étude de dimensionnement claire et sans engagement pour choisir la bonne puissance.',
      },
    },
    {
      id: 'categories',
      name: 'Grille des Catégories Solaires',
      visible: true,
      order: 2,
      data: {
        kicker: 'CATALOGUE SOLEX',
        title: 'Nos équipements solaires',
        linkText: 'Voir tout le catalogue',
      },
    },
    {
      id: 'solutions',
      name: 'Solutions par Profil (Particuliers, Commerces, Pompage, Pros)',
      visible: true,
      order: 3,
      data: {
        kicker: 'SOLUTIONS SUR-MESURE',
        title: 'Une solution adaptée à votre situation',
        subtitle: 'Chaque installation a ses priorités. Découvrez la formule qui correspond à votre projet.',
      },
    },
    {
      id: 'featured_products',
      name: 'Équipements Phares en Stock (Noms & Devis)',
      visible: true,
      order: 4,
      data: {
        kicker: 'MATÉRIEL POPULAIRE DISPONIBLE',
        title: 'Références en stock',
        linkText: "Consulter l'ensemble du catalogue",
        limit: 4,
      },
    },
    {
      id: 'cta_banner',
      name: 'Bandeau Contact & Devis Express',
      visible: true,
      order: 5,
      data: {
        title: 'Un projet solaire en vue ?',
        subtitle: 'Transmettez-nous la liste de vos appareils ou votre besoin. Nos conseillers vous répondent sous 24h avec une proposition claire.',
        buttonText: 'Demander un devis',
        whatsappText: 'WhatsApp direct',
      },
    },
  ];
}

// Initial seed data
function getInitialStore(): DatabaseStore {
  const defaultSalt = crypto.randomBytes(16).toString('hex');
  const defaultHash = hashPassword(process.env.ADMIN_PASSWORD || 'solex2026', defaultSalt);
  const tokenSecret = crypto.randomBytes(32).toString('hex');

  const initialProducts: ProductRecord[] = [
    {
      id: 'longi-lr5-72hth-580m',
      slug: 'panneau-solaire-longi-hi-mo-6-580w',
      name: 'LONGi Solar Hi-MO 6 Explorer 580W',
      category: 'panneaux',
      categorySlug: 'panneaux-solaires',
      categoryLabel: 'Panneaux solaires',
      brand: 'LONGi Solar',
      tagline: 'Module monocristallin HPBC haute efficacité à tolérance thermique avancée',
      summary: 'Module photovoltaïque de référence mondiale doté de la technologie HPBC 22.5% de rendement.',
      description: 'Le module LONGi Hi-MO 6 Explorer 580W est conçu pour offrir des performances énergétiques exceptionnelles sur les toitures résidentielles et commerciales au Sénégal.',
      image: '/assets/images/real_solar_panel_1794073469182.jpg',
      gallery: ['/assets/images/real_solar_panel_1794073469182.jpg'],
      specs: [
        { label: 'Puissance crête (Pmax)', value: '580 Wc' },
        { label: 'Technologie de cellule', value: 'Monocristallin HPBC' },
        { label: 'Rendement du module', value: '22.5 %' },
        { label: 'Dimensions', value: '2278 × 1134 × 35 mm' },
      ],
      keyFeatures: [
        'Cellules HPBC de dernière génération',
        'Excellente tenue aux fortes chaleurs sahéliennes',
        'Verre trempé haute transmission',
      ],
      warranty: 'Garantie produit 15 ans · Garantie linéaire 25 ans',
      application: 'Villas, toitures commerciales, cliniques et hangars industriels.',
      availabilityNote: 'En stock à Dakar · Expédition régionale rapide',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'felicity-solar-lpba48100-5kwh',
      slug: 'batterie-lithium-felicity-solar-5kwh-48v',
      name: 'Felicity Solar Batterie Lithium LiFePO4 48V 100Ah (5.12 kWh)',
      category: 'batteries',
      categorySlug: 'batteries',
      categoryLabel: 'Batteries solaires',
      brand: 'Felicity Solar',
      tagline: 'Batterie murale LiFePO4 avec BMS intelligent et communication onduleur',
      summary: 'Solution de stockage résidentielle sécurisée garantissant plus de 6 000 cycles.',
      description: 'La batterie Felicity Solar LPBA48100 est l\'un des équipements de stockage les plus répandus et fiables au Sénégal. Compatible nativement avec les onduleurs Deye et MUST.',
      image: '/assets/images/real_lithium_battery_1794073471133.jpg',
      gallery: ['/assets/images/real_lithium_battery_1794073471133.jpg'],
      specs: [
        { label: 'Capacité de stockage', value: '5.12 kWh' },
        { label: 'Tension nominale', value: '51.2 V (48V standard)' },
        { label: 'Durée de vie (Cycles)', value: '> 6000 cycles à 80% DoD' },
        { label: 'Poids', value: '46 kg' },
      ],
      keyFeatures: [
        'Cellules prismatiques LiFePO4 sécurisées',
        'BMS intégré gérant tension et température',
        'Support mural inclus',
      ],
      warranty: 'Garantie constructeur 5 ans ou 6 000 cycles',
      application: 'Autonomie nocturne pour maisons, villas, pharmacies et bureaux.',
      availabilityNote: 'Disponible sur stock à Dakar',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'deye-sun-5k-sg03lp1-eu',
      slug: 'onduleur-hybride-deye-5kw-monophase',
      name: 'Deye Onduleur Hybride 5kW Monophasé (SUN-5K-SG03LP1-EU)',
      category: 'onduleurs',
      categorySlug: 'onduleurs',
      categoryLabel: 'Onduleurs',
      brand: 'Deye Inverters',
      tagline: 'Onduleur hybride pur sinus avec écran couleur et 2 trackers MPPT',
      summary: 'Gestion intelligente du solaire, de la batterie et du réseau avec commutation sans coupure (< 4ms).',
      description: 'Deye est la référence des onduleurs hybrides intelligents. Permet d\'alimenter votre logement avec les panneaux et d\'enclencher la batterie instantanément lors des coupures.',
      image: '/assets/images/real_hybrid_inverter_1794073471330.jpg',
      gallery: ['/assets/images/real_hybrid_inverter_1794073471330.jpg'],
      specs: [
        { label: 'Puissance continue', value: '5 000 W Pur Sinus' },
        { label: 'Tension batterie supportée', value: '48 V (Plomb ou Lithium)' },
        { label: 'Temps de commutation UPS', value: '< 4 ms (instantané)' },
        { label: 'Étanchéité', value: 'IP65' },
      ],
      keyFeatures: [
        'Écran tactile couleur interactif',
        'Port direct pour groupe électrogène avec démarrage automatique',
        'Application mobile de supervision',
      ],
      warranty: 'Garantie constructeur 5 ans',
      application: 'Villas, commerces, cliniques et sites sensibles.',
      availabilityNote: 'Fourni avec pince ampèremétrique et Wi-Fi',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pompe-solaire-immergée-forage-3kw',
      slug: 'systeme-pompage-solaire-immerge-agricole',
      name: 'Système de Pompage Solaire Immergé Inox pour Forage',
      category: 'pompes',
      categorySlug: 'pompes-solaires',
      categoryLabel: 'Pompes solaires',
      brand: 'Gamme Agricole SOLEX',
      tagline: 'Pompe en inox 304 avec variateur de fréquence MPPT automatique',
      summary: 'Système au fil du soleil pour forages de 30 à 120 mètres, débit jusqu\'à 20 m³/h sans carburant.',
      description: 'Conçu spécifiquement pour l\'agriculture maraîchère et les forages ruraux au Sénégal. Démarre automatiquement dès le lever du soleil sans gasoil.',
      image: '/assets/images/real_solar_pump_1794073473894.jpg',
      gallery: ['/assets/images/real_solar_pump_1794073473894.jpg'],
      specs: [
        { label: 'Débit journalier', value: '25 à 80 m³ / jour' },
        { label: 'Profondeur max (HMT)', value: 'Jusqu\'à 120 mètres' },
        { label: 'Matériau', value: 'Acier inoxydable AISI 304' },
      ],
      keyFeatures: [
        'Zéro coût de carburant gasoil',
        'Démarrage automatique progressif',
        'Sonde de puits manque d\'eau incluse',
      ],
      warranty: 'Garantie matériel 2 ans',
      application: 'Périmètres maraîchers, forages de village et abreuvement du bétail.',
      availabilityNote: 'Dimensionnement gratuit sur mesure',
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const initialQuotes: QuoteRecord[] = [
    {
      id: 'dev-001',
      type: 'devis',
      fullName: 'Mamadou Ndiaye',
      phone: '+221 77 654 32 10',
      email: 'm.ndiaye@example.sn',
      clientType: 'Particulier',
      category: 'Panneaux solaires',
      productName: 'Kit Solaire Complet Villa Confort 5kW',
      region: 'Dakar',
      message: 'Besoin d\'un devis pour alimenter 2 climatiseurs et 1 réfrigérateur à Almadies.',
      status: 'nouveau',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'dev-002',
      type: 'contact',
      fullName: 'Ibrahima Sarr',
      phone: '+221 76 890 12 34',
      email: 'contact@sarrelec.com',
      clientType: 'Installateur',
      region: 'Thiès',
      message: 'Demande de tarif installateur pour 2 palettes de panneaux LONGi 580W livrées à Mbour.',
      status: 'en_cours',
      notes: 'Rappeler pour confirmer la remise installateur',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    },
  ];

  return {
    admin: {
      username: 'admin',
      salt: defaultSalt,
      hash: defaultHash,
      tokenSecret,
    },
    settings: {
      companyName: 'SOLEX',
      signature: 'Le solaire à votre portée.',
      phone1: '+221 77 498 51 25',
      phone2: '+221 76 945 75 49',
      email: 'contact@solex-sn.com',
      website: 'www.solex-sn.com',
      address: 'Dakar, Sénégal',
      heroTitle: "L'énergie solaire, à portée de vos projets.",
      heroSubtitle:
        "Distribution d'équipements solaires fiables et certifiés au Sénégal. Panneaux, batteries, onduleurs et pompes solaires disponibles à Dakar et expédiés dans toutes les régions.",
    },
    layout: getDefaultLayout(),
    products: initialProducts,
    quotes: initialQuotes,
  };
}

// -----------------------------------------------------------------------------
// Persistence layer
//  - Production: Supabase (table `solex_store`, one JSON row) -> survives redeploys
//  - Local dev without Supabase env vars: falls back to data/store.json
// -----------------------------------------------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
    : null;

export const STORAGE_BUCKET = process.env.SUPABASE_BUCKET || 'uploads';
const STORE_ROW_ID = 1;

function normalizeStore(parsed: any): DatabaseStore {
  // Old data may reference /src/assets/... which does not exist after a production build
  const fixed = JSON.parse(JSON.stringify(parsed).split('/src/assets/images/').join('/assets/images/'));
  if (!fixed.layout || !Array.isArray(fixed.layout) || fixed.layout.length === 0) {
    fixed.layout = getDefaultLayout();
  }
  return fixed;
}

class Database {
  private store!: DatabaseStore;
  private saveQueue: Promise<void> = Promise.resolve();

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  /** Must be awaited once before the server starts listening. */
  public async init(): Promise<void> {
    if (supabase) {
      const { data, error } = await supabase
        .from('solex_store')
        .select('data')
        .eq('id', STORE_ROW_ID)
        .maybeSingle();

      if (error) {
        throw new Error(
          `Supabase inaccessible (${error.message}). Vérifiez SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY et que la table solex_store existe.`
        );
      }

      if (data?.data) {
        this.store = normalizeStore(data.data);
        console.log('[SOLEX DB] Données chargées depuis Supabase.');
      } else {
        this.store = getInitialStore();
        await this.persist();
        console.log('[SOLEX DB] Base initialisée dans Supabase (première exécution).');
      }
      return;
    }

    console.warn('[SOLEX DB] Supabase non configuré : utilisation du fichier local data/store.json (non persistant en hébergement).');
    this.ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      try {
        this.store = normalizeStore(JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')));
        return;
      } catch (err) {
        console.error('Failed to parse database file, re-initializing store', err);
      }
    }
    this.store = getInitialStore();
    await this.persist();
  }

  private async persist(): Promise<void> {
    if (supabase) {
      const { error } = await supabase
        .from('solex_store')
        .upsert({ id: STORE_ROW_ID, data: this.store, updated_at: new Date().toISOString() });
      if (error) console.error('[SOLEX DB] Échec de sauvegarde Supabase :', error.message);
      return;
    }
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database file', err);
    }
  }

  /** Writes are serialized so that two quick edits never overwrite each other out of order. */
  public save() {
    this.saveQueue = this.saveQueue.then(() => this.persist()).catch(() => {});
  }

  // --- Admin Auth ---
  public getAdmin(): AdminCredentials {
    return this.store.admin;
  }

  public updateAdminPassword(newPassword: string) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(newPassword, salt);
    this.store.admin.salt = salt;
    this.store.admin.hash = hash;
    this.save();
  }

  // --- Settings ---
  public getSettings(): SiteSettings {
    return this.store.settings;
  }

  public updateSettings(partial: Partial<SiteSettings>): SiteSettings {
    this.store.settings = { ...this.store.settings, ...partial };
    this.save();
    return this.store.settings;
  }

  // --- Visual Layout Builder ---
  public getLayout(): PageSection[] {
    if (!this.store.layout || !Array.isArray(this.store.layout) || this.store.layout.length === 0) {
      this.store.layout = getDefaultLayout();
      this.save();
    }
    // Return sorted by order
    return [...this.store.layout].sort((a, b) => a.order - b.order);
  }

  public updateLayout(sections: PageSection[]): PageSection[] {
    // Normalize order index
    this.store.layout = sections.map((sec, idx) => ({
      ...sec,
      order: idx,
    }));
    this.save();
    return this.store.layout;
  }

  public updateSection(id: string, partial: Partial<PageSection>): PageSection | null {
    const idx = this.store.layout.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.store.layout[idx] = {
      ...this.store.layout[idx],
      ...partial,
      data: {
        ...(this.store.layout[idx].data || {}),
        ...(partial.data || {}),
      },
    };
    this.save();
    return this.store.layout[idx];
  }

  public resetLayout(): PageSection[] {
    this.store.layout = getDefaultLayout();
    this.save();
    return this.store.layout;
  }

  // --- Products ---
  public getProducts(includeUnpublished = false): ProductRecord[] {
    if (includeUnpublished) {
      return this.store.products;
    }
    return this.store.products.filter((p) => p.isPublished);
  }

  public getProductById(id: string): ProductRecord | undefined {
    return this.store.products.find((p) => p.id === id || p.slug === id);
  }

  public createProduct(data: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'>): ProductRecord {
    const id = data.slug || `solex-${Date.now()}`;
    const newProduct: ProductRecord = {
      ...data,
      id,
      slug: data.slug || id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, partial: Partial<ProductRecord>): ProductRecord | null {
    const idx = this.store.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    this.store.products[idx] = {
      ...this.store.products[idx],
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.store.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.store.products.length;
    this.store.products = this.store.products.filter((p) => p.id !== id);
    if (this.store.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Quotes & Inquiries ---
  public getQuotes(): QuoteRecord[] {
    return this.store.quotes;
  }

  public createQuote(data: Omit<QuoteRecord, 'id' | 'createdAt' | 'status'>): QuoteRecord {
    const id = `dev-${Date.now().toString().slice(-6)}`;
    const newQuote: QuoteRecord = {
      ...data,
      id,
      status: 'nouveau',
      createdAt: new Date().toISOString(),
    };
    this.store.quotes.unshift(newQuote);
    this.save();
    return newQuote;
  }

  public updateQuoteStatus(id: string, status: QuoteRecord['status'], notes?: string): QuoteRecord | null {
    const quote = this.store.quotes.find((q) => q.id === id);
    if (!quote) return null;
    quote.status = status;
    if (notes !== undefined) {
      quote.notes = notes;
    }
    this.save();
    return quote;
  }

  public deleteQuote(id: string): boolean {
    const initialLen = this.store.quotes.length;
    this.store.quotes = this.store.quotes.filter((q) => q.id !== id);
    if (this.store.quotes.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
}

export const db = new Database();
