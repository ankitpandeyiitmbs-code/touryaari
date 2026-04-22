import { Metadata } from 'next';
import { getSiteSettings } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Refund Policy - Touryaari Travels',
  description: 'Read our refund and cancellation policy.',
  robots: { index: false, follow: false },
};

const FALLBACK = `
<h2>Refund Policy</h2>
<p>Last updated: January 2025</p>
<p>We want you to be completely satisfied with your travel experience.</p>
<h3>Cancellation Refunds</h3>
<ul>
  <li><strong>30+ days before departure:</strong> 100% refund</li>
  <li><strong>15–30 days before departure:</strong> 75% refund</li>
  <li><strong>7–15 days before departure:</strong> 50% refund</li>
  <li><strong>Less than 7 days:</strong> No refund</li>
</ul>
<h3>Processing Time</h3>
<p>Approved refunds are processed within 7–10 business days to the original payment method.</p>
<h3>Non-Refundable Items</h3>
<p>Permit fees, visa charges, and airline tickets are non-refundable once booked.</p>
<h3>How to Request a Refund</h3>
<p>Contact us at info@touryaaritravels.com or call +91 85956 89569 with your booking reference.</p>
`;

export default async function RefundPolicyPage() {
  const settings = await getSiteSettings();
  const content = settings?.refund_policy_content || FALLBACK;

  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-pine-dark mb-3">Refund Policy</h1>
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
