import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Terms & Conditions - Touryaari Travels',
  description: 'Read our terms and conditions before booking a tour.',
  robots: { index: false, follow: false },
};

const FALLBACK = `
<h2>Terms &amp; Conditions</h2>
<p>Last updated: January 2025</p>
<p>By booking a tour with Touryaari Travels, you agree to these terms and conditions.</p>
<h3>Booking & Payment</h3>
<p>A 30% advance is required to confirm your booking. The remaining balance must be paid before departure.</p>
<h3>Cancellation Policy</h3>
<p>Cancellations made 30+ days before departure receive a full refund. Cancellations within 15–30 days incur a 25% fee. Within 15 days, 50% is non-refundable.</p>
<h3>Changes to Itinerary</h3>
<p>We reserve the right to modify itineraries due to weather, road conditions, or safety concerns.</p>
<h3>Liability</h3>
<p>Touryaari Travels is not liable for accidents, delays, or losses beyond our reasonable control.</p>
<h3>Contact Us</h3>
<p>For questions about these terms, contact us at info@touryaaritravels.com</p>
`;

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const content = settings?.terms_content || FALLBACK;

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-pine-dark mb-3">Terms &amp; Conditions</h1>
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
