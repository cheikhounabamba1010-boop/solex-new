import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';
import { ProductItem } from '../types';

export interface AdminUser {
  username: string;
  role: string;
}

export interface QuoteItem {
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

export interface PageSectionItem {
  id: string;
  name: string;
  visible: boolean;
  order: number;
  data: Record<string, any>;
}

export interface MediaItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface AdminStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalQuotes: number;
  pendingQuotes: number;
  inProgressQuotes: number;
  completedQuotes: number;
  recentQuotes: QuoteItem[];
}

async function safeJson(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "Le serveur ne répond pas correctement (API injoignable). Vérifiez que le site est bien hébergé sur un serveur Node et réessayez dans quelques secondes."
    );
  }
}

const TOKEN_KEY = 'solex_admin_token';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  // Token management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Identifiant ou mot de passe incorrect.');
    }

    this.setToken(data.token);
    return data;
  },

  async verifyAuth(): Promise<{ valid: boolean; user?: AdminUser }> {
    const token = this.getToken();
    if (!token) return { valid: false };

    try {
      const res = await fetch('/api/auth/verify', {
        headers: getAuthHeader(),
      });
      if (!res.ok) {
        this.clearToken();
        return { valid: false };
      }
      return await safeJson(res);
    } catch {
      return { valid: false };
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de la modification du mot de passe.');
    }
  },

  // Products
  async getProducts(): Promise<ProductItem[]> {
    try {
      const res = await fetch('/api/products', {
        headers: getAuthHeader(),
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await safeJson(res);
      return Array.isArray(data) && data.length > 0 ? data : FALLBACK_PRODUCTS;
    } catch {
      // Fallback to static data if API is loading or network error
      return FALLBACK_PRODUCTS;
    }
  },

  async getProduct(id: string): Promise<ProductItem | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) return null;
      return await safeJson(res);
    } catch {
      return FALLBACK_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
    }
  },

  async createProduct(data: Partial<ProductItem>): Promise<ProductItem> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await safeJson(res);
    if (!res.ok) {
      throw new Error(json.error || 'Impossible de créer le produit.');
    }
    return json;
  },

  async updateProduct(id: string, data: Partial<ProductItem>): Promise<ProductItem> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await safeJson(res);
    if (!res.ok) {
      throw new Error(json.error || 'Impossible de modifier le produit.');
    }
    return json;
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!res.ok) {
      const json = await safeJson(res);
      throw new Error(json.error || 'Impossible de supprimer le produit.');
    }
  },

  // Quotes / Inquiries
  async submitQuote(payload: {
    fullName: string;
    phone: string;
    email?: string;
    clientType?: string;
    category?: string;
    productName?: string;
    region?: string;
    message?: string;
    type?: 'devis' | 'contact';
  }): Promise<{ success: boolean; id: string; message: string }> {
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Erreur lors de la transmission du devis.');
    }
    return data;
  },

  async getQuotes(): Promise<QuoteItem[]> {
    const res = await fetch('/api/quotes', {
      headers: getAuthHeader(),
    });

    if (!res.ok) {
      throw new Error('Impossible de charger les demandes.');
    }
    return await safeJson(res);
  },

  async updateQuoteStatus(id: string, status: QuoteItem['status'], notes?: string): Promise<QuoteItem> {
    const res = await fetch(`/api/quotes/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, notes }),
    });

    const json = await safeJson(res);
    if (!res.ok) {
      throw new Error(json.error || 'Impossible de mettre à jour le statut.');
    }
    return json;
  },

  async deleteQuote(id: string): Promise<void> {
    const res = await fetch(`/api/quotes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!res.ok) {
      throw new Error('Impossible de supprimer la demande.');
    }
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error();
      return await safeJson(res);
    } catch {
      return {
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
      };
    }
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    const json = await safeJson(res);
    if (!res.ok) {
      throw new Error(json.error || 'Impossible de mettre à jour les réglages.');
    }
    return json;
  },

  // Admin Stats
  async getStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats', {
      headers: getAuthHeader(),
    });

    if (!res.ok) {
      throw new Error('Impossible de charger les statistiques.');
    }
    return await safeJson(res);
  },

  // Visual Layout Builder (Drag & Drop)
  async getLayout(): Promise<PageSectionItem[]> {
    try {
      const res = await fetch('/api/layout');
      if (!res.ok) throw new Error();
      return await safeJson(res);
    } catch {
      return [];
    }
  },

  async getContent(): Promise<Record<string, string>> {
    const res = await fetch('/api/content');
    if (!res.ok) throw new Error('Contenus indisponibles.');
    return await safeJson(res);
  },

  async updateContent(values: Record<string, string | null>): Promise<Record<string, string>> {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ values }),
    });
    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Impossible de sauvegarder les contenus.');
    }
    return data;
  },

  async updateLayout(sections: PageSectionItem[]): Promise<PageSectionItem[]> {
    const res = await fetch('/api/layout', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ sections }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Impossible de sauvegarder la disposition.');
    }
    return data;
  },

  async updateSection(id: string, partial: Partial<PageSectionItem>): Promise<PageSectionItem> {
    const res = await fetch(`/api/layout/sections/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(partial),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Impossible de mettre à jour la section.');
    }
    return data;
  },

  async resetLayout(): Promise<PageSectionItem[]> {
    const res = await fetch('/api/layout/reset', {
      method: 'POST',
      headers: getAuthHeader(),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Impossible de réinitialiser la disposition.');
    }
    return data.layout;
  },

  // Upload Images from Smartphone / Computer
  async uploadImage(file: File): Promise<{ url: string; filename: string; size: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const fileData = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
            body: JSON.stringify({
              filename: file.name,
              fileData,
              mimeType: file.type,
            }),
          });
          const data = await safeJson(res);
          if (!res.ok) throw new Error(data.error || "Échec de l'upload.");
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
      reader.readAsDataURL(file);
    });
  },

  // Media Library
  async getMedia(): Promise<MediaItem[]> {
    const res = await fetch('/api/media', {
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      throw new Error('Impossible de charger les fichiers médias.');
    }
    return await safeJson(res);
  },

  async deleteMedia(filename: string): Promise<void> {
    const res = await fetch(`/api/media/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      const data = await safeJson(res);
      throw new Error(data.error || 'Impossible de supprimer le fichier.');
    }
  },
};
