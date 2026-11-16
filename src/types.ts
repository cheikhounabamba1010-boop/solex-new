export type ProductCategory = 
  | 'panneaux'
  | 'batteries'
  | 'onduleurs'
  | 'regulateurs'
  | 'kits'
  | 'pompes'
  | 'accessoires';

export interface CategoryInfo {
  id: ProductCategory;
  slug: string;
  title: string;
  headline: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  heroImage: string;
  itemCount: string;
  tags: string[];
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categorySlug: string;
  categoryLabel: string;
  brand: string;
  tagline: string;
  summary: string;
  description: string;
  image: string;
  gallery: string[];
  specs: {
    label: string;
    value: string;
  }[];
  keyFeatures: string[];
  warranty: string;
  application: string;
  availabilityNote: string;
  isExample: boolean;
}

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  targetAudience: string;
  challenges: string[];
  benefits: string[];
  recommendedGear: string[];
  icon: string;
}

export interface BrandItem {
  name: string;
  slug: string;
  tier: string;
  origin: string;
  specialty: string;
  description: string;
  topEquipment: string[];
}

export interface QuoteFormData {
  fullName: string;
  phone: string;
  email: string;
  clientType: 'Particulier' | 'Installateur' | 'Entreprise' | 'Revendeur';
  category: string;
  productName?: string;
  region: string;
  message: string;
}
