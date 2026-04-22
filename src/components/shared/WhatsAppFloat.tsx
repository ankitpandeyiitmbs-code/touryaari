'use client';

import { Phone, MessageCircle } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';

export default function WhatsAppFloat() {
  const settings = useSettings();
  
  const phone = settings.whatsapp || settings.phone_primary || '+918595689569';
  const message = settings.whatsapp_message_template || 'Hi! I want to know more about your tour packages.';
  const whatsappLink = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      {settings.show_whatsapp_widget !== false && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat on WhatsApp
          </span>
        </a>
      )}

      {/* Call Button */}
      {settings.show_call_widget !== false && settings.phone_primary && (
        <a
          href={`tel:${settings.phone_primary.replace(/\s/g, '')}`}
          className="flex items-center justify-center w-14 h-14 bg-gold text-pine-dark rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group"
          aria-label="Call us"
        >
          <Phone className="w-6 h-6" />
          <span className="absolute right-16 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Call Now
          </span>
        </a>
      )}
    </div>
  );
}
