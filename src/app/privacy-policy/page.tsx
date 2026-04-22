import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Privacy Policy - Touryaari Travels',
  description: 'Read our privacy policy to understand how we collect and use your data.',
  robots: { index: false, follow: false },
};

const FALLBACK = `
<h2>Privacy Policy</h2>
<p>Last updated: January 2025</p>
<p>Touryaari Travels ("we", "our", or "us") is committed to protecting your personal information.</p>
<h3>Information We Collect</h3>
<p>We collect information you provide when booking tours, contacting us, or creating an account — including name, email, phone number, and payment details.</p>
<h3>How We Use Your Information</h3>
<p>We use your information to process bookings, send confirmations, provide customer support, and improve our services.</p>
<h3>Data Security</h3>
<p>We implement appropriate security measures to protect your personal information against unauthorised access.</p>
<h3>Contact Us</h3>
<p>For questions about this policy, contact us at info@touryaaritravels.com</p>
`;

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  const content = settings?.privacy_policy_content || FALLBACK;

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-pine-dark mb-3">Privacy Policy</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
        </div>
        <div
          className="bg-white rounded-xl p-8 shadow-card border border-cream-dark prose prose-stone max-w-none
            [&_h2]:font-serif [&_h2]:text-pine-dark [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
            [&_h3]:font-serif [&_h3]:text-pine-dark [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:text-stone [&_p]:mb-4 [&_p]:leading-relaxed
            [&_ul]:text-stone [&_ul]:mb-4 [&_li]:mb-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
