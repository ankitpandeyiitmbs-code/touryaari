'use client';
import { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface PageSettings {
  hero_title: string;
  hero_subtitle: string;
  popular_tours_heading: string;
  popular_tours_subtext: string;
  destinations_heading: string;
  destinations_subtext: string;
  why_choose_heading: string;
  why_choose_subtext: string;
  testimonials_heading: string;
  blog_heading: string;
  blog_subtext: string;
  newsletter_heading: string;
  newsletter_subtext: string;
  about_text: string;
  stat1_number: string;
  stat1_label: string;
  stat2_number: string;
  stat2_label: string;
  stat3_number: string;
  stat3_label: string;
  stat4_number: string;
  stat4_label: string;
}

export default function PageContentSettingsPage() {
  const [settings, setSettings] = useState<PageSettings>({
    hero_title: "Discover India's Hidden Wonders",
    hero_subtitle: 'Handcrafted tours for the curious traveler',
    popular_tours_heading: 'Popular Tours',
    popular_tours_subtext: 'Explore our most loved journeys',
    destinations_heading: 'Top Destinations',
    destinations_subtext: "Discover India's most beautiful places",
    why_choose_heading: 'Why Choose Us',
    why_choose_subtext: 'We make every journey extraordinary',
    testimonials_heading: 'What Travelers Say',
    blog_heading: 'Travel Stories',
    blog_subtext: 'Inspiration for your next adventure',
    newsletter_heading: 'Get Travel Updates',
    newsletter_subtext: 'Subscribe for exclusive deals and travel tips',
    about_text: '',
    stat1_number: '500+', stat1_label: 'Happy Travelers',
    stat2_number: '50+', stat2_label: 'Destinations',
    stat3_number: '100+', stat3_label: 'Tours Completed',
    stat4_number: '4.9', stat4_label: 'Average Rating',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => { if (d.settings) setSettings((p) => ({ ...p, ...d.settings })); })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) toast.success('Page content saved!');
      else toast.error('Failed to save');
    } catch { toast.error('Error saving'); }
    finally { setIsSaving(false); }
  };

  const set = (k: keyof PageSettings, v: string) => setSettings((p) => ({ ...p, [k]: v }));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  const sections = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'stats', label: 'Statistics' },
    { id: 'sections', label: 'Section Headings' },
    { id: 'about', label: 'About Text' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Page Content</h1>
          <p className="text-stone mt-1">Edit headings, text and stats across your website</p>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light disabled:opacity-50">
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark">
        <div className="border-b border-cream-dark flex flex-wrap">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeSection === s.id ? 'border-gold text-gold' : 'border-transparent text-stone hover:text-pine-dark'
              }`}>
              <FileText className="w-4 h-4" />{s.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {activeSection === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Hero Main Title</label>
                <input type="text" value={settings.hero_title} onChange={(e) => set('hero_title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Hero Subtitle</label>
                <input type="text" value={settings.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none" />
              </div>
            </>
          )}
          {activeSection === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-4 bg-cream rounded-lg">
                  <p className="text-sm font-semibold text-pine-dark mb-3">Stat #{n}</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-stone mb-1">Number / Value</label>
                      <input type="text" value={(settings as any)[`stat${n}_number`]} onChange={(e) => set(`stat${n}_number` as any, e.target.value)}
                        className="w-full px-3 py-2 border border-cream-dark rounded-lg focus:border-gold focus:outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-stone mb-1">Label</label>
                      <input type="text" value={(settings as any)[`stat${n}_label`]} onChange={(e) => set(`stat${n}_label` as any, e.target.value)}
                        className="w-full px-3 py-2 border border-cream-dark rounded-lg focus:border-gold focus:outline-none text-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'sections' && (
            <div className="space-y-6">
              {[
                { h: 'popular_tours_heading', s: 'popular_tours_subtext', label: 'Popular Tours Section' },
                { h: 'destinations_heading', s: 'destinations_subtext', label: 'Destinations Section' },
                { h: 'why_choose_heading', s: 'why_choose_subtext', label: 'Why Choose Us Section' },
                { h: 'blog_heading', s: 'blog_subtext', label: 'Blog Section' },
                { h: 'newsletter_heading', s: 'newsletter_subtext', label: 'Newsletter Section' },
              ].map(({ h, s, label }) => (
                <div key={h} className="p-4 bg-cream rounded-lg">
                  <p className="text-sm font-semibold text-pine-dark mb-3">{label}</p>
                  <div className="space-y-3">
                    <input type="text" placeholder="Heading" value={(settings as any)[h]} onChange={(e) => set(h as any, e.target.value)}
                      className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none" />
                    <input type="text" placeholder="Subtext" value={(settings as any)[s]} onChange={(e) => set(s as any, e.target.value)}
                      className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeSection === 'about' && (
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-2">About Us Text</label>
              <textarea value={settings.about_text} onChange={(e) => set('about_text', e.target.value)}
                rows={8} placeholder="Tell visitors about your company, values, and what makes you special..."
                className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
