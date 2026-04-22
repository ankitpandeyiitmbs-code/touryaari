'use client';
import { useState, useEffect } from 'react';
import { Save, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface SEOSettings {
  meta_title: string;
  meta_description: string;
  google_analytics_id: string;
  facebook_pixel_id: string;
  google_maps_embed_url: string;
}

export default function SEOSettingsPage() {
  const [settings, setSettings] = useState<SEOSettings>({
    meta_title: '',
    meta_description: '',
    google_analytics_id: '',
    facebook_pixel_id: '',
    google_maps_embed_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
      if (res.ok) toast.success('SEO settings saved!');
      else toast.error('Failed to save settings');
    } catch { toast.error('Error saving settings'); }
    finally { setIsSaving(false); }
  };

  const set = (k: keyof SEOSettings, v: string) => setSettings((p) => ({ ...p, [k]: v }));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">SEO Settings</h1>
          <p className="text-stone mt-1">Optimize your site for search engines</p>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light disabled:opacity-50">
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-6">
        <h2 className="font-serif text-xl font-semibold text-pine-dark flex items-center gap-2">
          <Search className="w-5 h-5 text-gold" /> Meta Tags
        </h2>
        <div>
          <label className="block text-sm font-medium text-pine-dark mb-2">Default Meta Title</label>
          <input type="text" value={settings.meta_title} onChange={(e) => set('meta_title', e.target.value)}
            placeholder="Touryaari Travels - Your Journey, Our Passion"
            className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none" />
          <p className="text-xs text-stone mt-1">Recommended: 50–60 characters. Current: {settings.meta_title.length}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-pine-dark mb-2">Default Meta Description</label>
          <textarea value={settings.meta_description} onChange={(e) => set('meta_description', e.target.value)}
            rows={3} placeholder="Discover amazing places at exclusive deals..."
            className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none" />
          <p className="text-xs text-stone mt-1">Recommended: 150–160 characters. Current: {settings.meta_description.length}</p>
        </div>

        <div className="border-t border-cream-dark pt-6">
          <h2 className="font-serif text-xl font-semibold text-pine-dark mb-5">Analytics & Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-2">Google Analytics ID</label>
              <input type="text" value={settings.google_analytics_id} onChange={(e) => set('google_analytics_id', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none font-mono text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-2">Facebook Pixel ID</label>
              <input type="text" value={settings.facebook_pixel_id} onChange={(e) => set('facebook_pixel_id', e.target.value)}
                placeholder="XXXXXXXXXXXXXXX"
                className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none font-mono text-sm" />
            </div>
          </div>
        </div>

        <div className="border-t border-cream-dark pt-6">
          <h2 className="font-serif text-xl font-semibold text-pine-dark mb-5">Google Maps</h2>
          <div>
            <label className="block text-sm font-medium text-pine-dark mb-2">Maps Embed URL</label>
            <input type="url" value={settings.google_maps_embed_url} onChange={(e) => set('google_maps_embed_url', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none" />
            <p className="text-xs text-stone mt-1">Paste the embed URL from Google Maps → Share → Embed a map</p>
          </div>
          {settings.google_maps_embed_url && (
            <div className="mt-4 rounded-lg overflow-hidden border border-cream-dark aspect-video">
              <iframe src={settings.google_maps_embed_url} className="w-full h-full" loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
