import { getSiteSettings } from '@/lib/settings';

export default async function MaintenancePage() {
  const settings = await getSiteSettings();
  const s = settings || {
    maintenance_message: '',
    phone_primary: '',
    email: '',
    whatsapp: '',
    site_name: '',
  };

  return (
    <div className="min-h-screen bg-pine-dark flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
            Under Maintenance
          </h1>
          <p className="text-cream text-lg mb-2">
            {s.maintenance_message || 'We are updating our website. Back soon!'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-gold font-semibold mb-4">Contact Us</h2>
          <div className="space-y-2 text-cream">
            {s.phone_primary && (
              <p>Phone: {s.phone_primary}</p>
            )}
            {s.email && (
              <p>Email: {s.email}</p>
            )}
            {s.whatsapp && (
              <p>WhatsApp: {s.whatsapp}</p>
            )}
          </div>
        </div>

        <p className="text-cream/60 text-sm mt-8">
          &copy; {new Date().getFullYear()} {s.site_name || 'Touryaari Travels'}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
