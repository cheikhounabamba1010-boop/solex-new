import { ASSETS } from '../data/assets';

/**
 * REGISTRE DES CONTENUS MODIFIABLES
 * ---------------------------------
 * Chaque champ a une clé unique, un libellé pour l'admin et une valeur PAR DÉFAUT
 * (= le texte actuel du site). Tant que rien n'est modifié dans l'admin, le site
 * s'affiche exactement comme avant.
 */
export type FieldType = 'text' | 'textarea' | 'image';

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

/** Table clé -> valeur par défaut (utilisée par le site public). */
export const CONTENT_DEFAULTS: Record<string, string> = {};
for (const page of CONTENT_PAGES) {
  for (const group of page.groups) {
    for (const field of group.fields) {
      CONTENT_DEFAULTS[field.key] = field.default;
    }
  }
}
