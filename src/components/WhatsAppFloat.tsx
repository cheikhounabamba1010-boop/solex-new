import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../utils/whatsapp';

export const WhatsAppFloat: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] text-white shadow-md hover:scale-105 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Contacter SOLEX sur WhatsApp"
        title="WhatsApp direct"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
};
