export const SOLEX_PHONE_1 = '+221 77 498 51 25';
export const SOLEX_PHONE_2 = '+221 76 945 75 49';
export const SOLEX_PHONE_1_RAW = '221774985125';
export const SOLEX_PHONE_2_RAW = '221769457549';
export const SOLEX_EMAIL = 'contact@solex-sn.com';
export const SOLEX_WEBSITE = 'www.solex-sn.com';

export function getWhatsAppUrl(productName?: string, customMessage?: string): string {
  let message = '';
  if (customMessage) {
    message = customMessage;
  } else if (productName) {
    message = `Bonjour SOLEX, je vous contacte depuis votre site web. Je souhaite connaître le prix et la disponibilité pour l'équipement suivant :\n\n- Produit : ${productName}\n\nMerci de m'indiquer les modalités et délais.`;
  } else {
    message = `Bonjour SOLEX, je vous contacte depuis votre site internet www.solex-sn.com. Je souhaite obtenir des informations et un devis pour des équipements solaires.`;
  }

  return `https://wa.me/${SOLEX_PHONE_1_RAW}?text=${encodeURIComponent(message)}`;
}
