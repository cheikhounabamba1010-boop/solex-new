import { ASSETS } from '../data/assets';
import { CATEGORIES } from '../data/categories';
import { SOLUTIONS } from '../data/solutions';
import { BRANDS } from '../data/brands';

/**
 * REGISTRE DES CONTENUS MODIFIABLES
 * ---------------------------------
 * Chaque champ a une clé unique, un libellé pour l'admin et une valeur PAR DÉFAUT
 * (= le texte actuel du site). Tant que rien n'est modifié dans l'admin, le site
 * s'affiche exactement comme avant.
 */
/** 'lines' = une liste : un élément par ligne. */
export type FieldType = 'text' | 'textarea' | 'image' | 'lines';

export interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  help?: string;
}

export interface ContentGroup {
  title: string;
  fields: ContentField[];
}

export interface ContentPage {
  id: string;
  label: string;
  path: string;
  description: string;
  groups: ContentGroup[];
}

export const CONTENT_PAGES: ContentPage[] = [
  {
    id: 'about',
    label: 'À propos',
    path: '/a-propos',
    description: 'Présentation de SOLEX, mission et engagements.',
    groups: [
      {
        title: 'Bannière du haut',
        fields: [
          { key: 'about.header.kicker', label: 'Petit texte au-dessus du titre', type: 'text', default: 'NOTRE HISTOIRE & ENGAGEMENT' },
          { key: 'about.header.title', label: 'Titre', type: 'text', default: 'À propos de SOLEX' },
          { key: 'about.header.description', label: 'Description', type: 'textarea', default: "Entreprise sénégalaise spécialisée dans la distribution d'équipements solaires photovoltaïques." },
          { key: 'about.header.image', label: 'Image de fond', type: 'image', default: ASSETS.banners.about },
        ],
      },
      {
        title: 'Notre mission',
        fields: [
          { key: 'about.mission.label', label: 'Étiquette', type: 'text', default: 'Notre mission' },
          {
            key: 'about.mission.quote',
            label: 'Citation principale',
            type: 'textarea',
            default:
              '« SOLEX accompagne les particuliers et les professionnels dans leurs besoins en équipements solaires en proposant une gamme de produits adaptés aux différents projets énergétiques. Notre ambition est de rendre les solutions solaires plus accessibles grâce à une offre claire, des équipements sélectionnés et une relation de proximité avec nos clients. »',
          },
          {
            key: 'about.mission.text',
            label: 'Paragraphe',
            type: 'textarea',
            default:
              "Basée à Dakar, SOLEX sélectionne des équipements conçus pour résister aux contraintes du climat sénégalais : fortes chaleurs, poussières et variations de tension du réseau électrique.",
          },
          { key: 'about.mission.signatureLabel', label: 'Libellé de la signature', type: 'text', default: 'Signature :' },
          { key: 'about.mission.signature', label: 'Signature', type: 'text', default: '« Le solaire à votre portée. »' },
          { key: 'about.mission.image', label: 'Photo de l’équipe', type: 'image', default: ASSETS.team },
        ],
      },
      {
        title: 'Engagement 1',
        fields: [
          { key: 'about.eng1.title', label: 'Titre', type: 'text', default: 'Résistance aux fortes chaleurs' },
          { key: 'about.eng1.text', label: 'Texte', type: 'textarea', default: 'Matériel éprouvé pour conserver un rendement élevé sous les températures du Sénégal.' },
        ],
      },
      {
        title: 'Engagement 2',
        fields: [
          { key: 'about.eng2.title', label: 'Titre', type: 'text', default: 'Garanties constructeurs' },
          { key: 'about.eng2.text', label: 'Texte', type: 'textarea', default: "Équipements certifiés d'origine, garantis jusqu'à 25 ans selon les gammes." },
        ],
      },
      {
        title: 'Engagement 3',
        fields: [
          { key: 'about.eng3.title', label: 'Titre', type: 'text', default: 'Conseil & Dimensionnement' },
          { key: 'about.eng3.text', label: 'Texte', type: 'textarea', default: 'Accompagnement technique pour sélectionner la puissance exacte de vos appareils.' },
        ],
      },
      {
        title: 'Engagement 4',
        fields: [
          { key: 'about.eng4.title', label: 'Titre', type: 'text', default: 'Proximité à Dakar' },
          { key: 'about.eng4.text', label: 'Texte', type: 'textarea', default: 'Une équipe disponible pour répondre à vos questions et expédier vos commandes dans toutes les régions.' },
        ],
      },
      {
        title: 'Bloc « Nous contacter » (bas de page)',
        fields: [
          { key: 'about.cta.title', label: 'Titre', type: 'text', default: 'Vous avez une question sur nos activités ?' },
          { key: 'about.cta.text', label: 'Texte', type: 'textarea', default: 'Nos conseillers sont à votre écoute pour échanger sur vos projets énergétiques.' },
          { key: 'about.cta.button', label: 'Texte du bouton', type: 'text', default: 'Nous contacter' },
        ],
      },
    ],
  },
  {
    id: 'brands',
    label: 'Marques',
    path: '/marques',
    description: 'Bannière et libellés de la page des marques partenaires.',
    groups: [
      {
        title: 'Bannière du haut',
        fields: [
          { key: 'brands.header.kicker', label: 'Petit texte au-dessus du titre', type: 'text', default: 'FABRICANTS TIER-1' },
          { key: 'brands.header.title', label: 'Titre', type: 'text', default: 'Nos marques partenaires' },
          {
            key: 'brands.header.description',
            label: 'Description',
            type: 'textarea',
            default: 'Constructeurs mondiaux sélectionnés par SOLEX pour la fiabilité et la garantie de leurs équipements solaires.',
          },
          { key: 'brands.header.image', label: 'Image de fond', type: 'image', default: ASSETS.banners.brands },
        ],
      },
      {
        title: 'Cartes des marques',
        fields: [
          { key: 'brands.card.warranty', label: 'Libellé « Garantie »', type: 'text', default: 'Garantie constructeur' },
          { key: 'brands.card.link', label: 'Texte du lien', type: 'text', default: 'Voir le matériel' },
        ],
      },
    ],
  },
];


// -----------------------------------------------------------------------------
// Pages supplémentaires (bannières, contact, logo & bas de page)
// -----------------------------------------------------------------------------
CONTENT_PAGES.push(
  {
    id: 'global',
    label: 'Logo & bas de page',
    path: '/',
    description: 'Logo du site (en-tête et bas de page) et textes du bas de page.',
    groups: [
      {
        title: 'Logo',
        fields: [{ key: 'global.logo', label: 'Logo du site', type: 'image', default: ASSETS.logo }],
      },
      {
        title: 'Bas de page',
        fields: [
          { key: 'footer.slogan', label: 'Slogan', type: 'text', default: '« Le solaire à votre portée. »' },
          {
            key: 'footer.description',
            label: 'Présentation',
            type: 'textarea',
            default:
              'Distribution de matériel solaire photovoltaïque certifié au Sénégal : panneaux, batteries lithium, onduleurs hybrides et pompes solaires.',
          },
          { key: 'footer.location', label: 'Ligne de localisation', type: 'text', default: 'Dakar, Sénégal · Expéditions nationales' },
        ],
      },
    ],
  },
  {
    id: 'products',
    label: 'Catalogue produits',
    path: '/produits',
    description: 'Bannière de la page catalogue. Les produits eux-mêmes se gèrent dans « Gestion des produits ».',
    groups: [
      {
        title: 'Bannière du haut',
        fields: [
          { key: 'products.header.kicker', label: 'Petit texte au-dessus du titre', type: 'text', default: 'DISTRIBUTION OFFICIELLE' },
          { key: 'products.header.title', label: 'Titre', type: 'text', default: 'Catalogue Équipements Solaires' },
          {
            key: 'products.header.description',
            label: 'Description',
            type: 'textarea',
            default:
              'Modules photovoltaïques, batteries lithium, onduleurs et pompes solaires disponibles à Dakar et expédiés dans tout le Sénégal.',
          },
          { key: 'products.header.image', label: 'Image de fond', type: 'image', default: ASSETS.banners.products },
        ],
      },
    ],
  },
  {
    id: 'categories',
    label: 'Catégories de produits',
    path: '/produits',
    description:
      'Chaque catégorie (panneaux, batteries, onduleurs…) : nom, textes et photos. Ces informations apparaissent dans le menu, la page d’accueil, le catalogue et le bas de page.',
    groups: CATEGORIES.map((c) => ({
      title: c.title,
      fields: [
        { key: `cat.${c.id}.title`, label: 'Nom de la catégorie', type: 'text' as FieldType, default: c.title },
        { key: `cat.${c.id}.headline`, label: 'Accroche', type: 'text' as FieldType, default: c.headline },
        { key: `cat.${c.id}.shortDesc`, label: 'Description courte', type: 'textarea' as FieldType, default: c.shortDesc },
        { key: `cat.${c.id}.fullDesc`, label: 'Description complète', type: 'textarea' as FieldType, default: c.fullDesc },
        { key: `cat.${c.id}.itemCount`, label: 'Gamme (ex : 400Wc à 600Wc+)', type: 'text' as FieldType, default: c.itemCount },
        {
          key: `cat.${c.id}.tags`,
          label: 'Mots-clés (un par ligne)',
          type: 'lines' as FieldType,
          default: c.tags.join('\n'),
        },
        {
          key: `cat.${c.id}.image`,
          label: 'Photo de la catégorie (cartes)',
          type: 'image' as FieldType,
          default: c.image,
        },
        {
          key: `cat.${c.id}.heroImage`,
          label: 'Image de la bannière de la catégorie',
          type: 'image' as FieldType,
          default: c.heroImage,
        },
      ],
    })),
  },
  {
    id: 'solutions',
    label: 'Solutions',
    path: '/solutions',
    description: 'Bannière et fiches des solutions par profil (particuliers, entreprises, agriculture…).',
    groups: [
      {
        title: 'Bannière du haut',
        fields: [
          { key: 'solutions.header.kicker', label: 'Petit texte au-dessus du titre', type: 'text', default: 'SOLUTIONS CLÉS EN MAIN' },
          { key: 'solutions.header.title', label: 'Titre', type: 'text', default: 'Solutions solaires par profil' },
          {
            key: 'solutions.header.description',
            label: 'Description',
            type: 'textarea',
            default: 'Packs dimensionnés pour particuliers, commerces, exploitants agricoles et professionnels au Sénégal.',
          },
          { key: 'solutions.header.image', label: 'Image de fond', type: 'image', default: ASSETS.banners.solutions },
        ],
      },
      {
        title: 'Libellés',
        fields: [
          { key: 'solutions.label.profiles', label: 'Libellé de la barre de profils', type: 'text', default: 'Profils :' },
          { key: 'solutions.label.gear', label: 'Libellé « équipements »', type: 'text', default: 'Équipements inclus :' },
          { key: 'solutions.label.quote', label: 'Bouton de devis', type: 'text', default: 'Demander un devis' },
        ],
      },
      ...SOLUTIONS.map((sol) => ({
        title: `Fiche : ${sol.title}`,
        fields: [
          { key: `sol.${sol.id}.title`, label: 'Titre', type: 'text' as FieldType, default: sol.title },
          { key: `sol.${sol.id}.subtitle`, label: 'Sous-titre', type: 'textarea' as FieldType, default: sol.subtitle },
          { key: `sol.${sol.id}.targetAudience`, label: 'Public visé', type: 'text' as FieldType, default: sol.targetAudience },
          { key: `sol.${sol.id}.description`, label: 'Description', type: 'textarea' as FieldType, default: sol.description },
          { key: `sol.${sol.id}.benefits`, label: 'Avantages (un par ligne)', type: 'lines' as FieldType, default: sol.benefits.join('\n') },
          { key: `sol.${sol.id}.challenges`, label: 'Problèmes résolus (un par ligne)', type: 'lines' as FieldType, default: sol.challenges.join('\n') },
          {
            key: `sol.${sol.id}.recommendedGear`,
            label: 'Équipements recommandés (un par ligne)',
            type: 'lines' as FieldType,
            default: sol.recommendedGear.join('\n'),
          },
          { key: `sol.${sol.id}.heroImage`, label: 'Photo', type: 'image' as FieldType, default: sol.heroImage },
        ],
      })),
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    description: 'Bannière et en-tête du bloc de coordonnées. Téléphones et e-mail se modifient dans « Contenus & Réglages ».',
    groups: [
      {
        title: 'Bannière du haut',
        fields: [
          { key: 'contact.header.kicker', label: 'Petit texte au-dessus du titre', type: 'text', default: 'CONTACTEZ SOLEX' },
          { key: 'contact.header.title', label: 'Titre', type: 'text', default: 'Contact & Devis' },
          {
            key: 'contact.header.description',
            label: 'Description',
            type: 'textarea',
            default: 'Une question technique ou une demande de prix ? Notre équipe vous répond sous 24h à Dakar.',
          },
          { key: 'contact.header.image', label: 'Image de fond', type: 'image', default: ASSETS.banners.contact },
        ],
      },
      {
        title: 'Bloc de coordonnées',
        fields: [
          { key: 'contact.info.label', label: 'Étiquette', type: 'text', default: 'Coordonnées directes' },
          { key: 'contact.info.title', label: 'Titre', type: 'text', default: 'SOLEX Sénégal' },
          { key: 'contact.info.text', label: 'Description', type: 'text', default: 'Distribution et commercialisation de matériel solaire.' },
        ],
      },
    ],
  }
);

// Fiches des marques (page Marques)
CONTENT_PAGES.find((p) => p.id === 'brands')!.groups.push(
  ...BRANDS.map((b) => ({
    title: `Marque : ${b.name}`,
    fields: [
      { key: `brand.${b.slug}.name`, label: 'Nom', type: 'text' as FieldType, default: b.name },
      { key: `brand.${b.slug}.tier`, label: 'Statut / niveau', type: 'text' as FieldType, default: b.tier },
      { key: `brand.${b.slug}.origin`, label: 'Positionnement', type: 'text' as FieldType, default: b.origin },
      { key: `brand.${b.slug}.specialty`, label: 'Spécialité', type: 'text' as FieldType, default: b.specialty },
      { key: `brand.${b.slug}.description`, label: 'Description', type: 'textarea' as FieldType, default: b.description },
    ],
  }))
);

// Ordre d'affichage dans l'admin
const PAGE_ORDER = ['global', 'about', 'products', 'categories', 'solutions', 'brands', 'contact'];
CONTENT_PAGES.sort((a, b) => PAGE_ORDER.indexOf(a.id) - PAGE_ORDER.indexOf(b.id));

/** Table clé -> valeur par défaut (utilisée par le site public). */
export const CONTENT_DEFAULTS: Record<string, string> = {};
for (const page of CONTENT_PAGES) {
  for (const group of page.groups) {
    for (const field of group.fields) {
      CONTENT_DEFAULTS[field.key] = field.default;
    }
  }
}
