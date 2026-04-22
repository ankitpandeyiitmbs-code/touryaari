'use client';

import { useSettings } from '@/components/providers/SettingsProvider';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const settings = useSettings();

  // Read from settings or fallback to env variable
  const rawNumber =
    (settings as any).whatsapp_number ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '';

  if (!rawNumber) return null;

  // Strip non-digits and ensure country code
  const number = rawNumber.replace(/\D/g, '');

  const message = encodeURIComponent(
    "Hi! I'm interested in booking a tour. Can you help me?"
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg hover:shadow-xl rounded-full px-5 py-3.5 transition-all duration-200 group"
    >
      <MessageCircle className="w-5 h-5 fill-white stroke-none" />
      <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-[120px] whitespace-nowrap transition-all duration-300 ease-out">
        Chat with us
      </span>
    </a>
  );
}
