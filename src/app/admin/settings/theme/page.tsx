'use client';
import { useState, useEffect } from 'react';
import { Save, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  site_name: string;
  logo_url: string;
  favicon_url: string;
}

export default function ThemeSettingsPage() {
  const [settings, setSettings] = useState<ThemeSettings>({
    primary_color: '#1B3A2D',
    secondary_color: '#2D4A3D',
    accent_color: '#C89033',
    site_name: 'Touryaari Travels',
    logo_url: '',
    favicon_url: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings((p) => ({ ...p, ...d.settings }));
      })
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
      if (res.ok) toast.success('Theme settings saved!');
      else toast.error('Failed to save settings');
    } catch { toast.error('Error saving settings'); }
    finally { setIsSaving(false); }
  };

  const set = (k: keyof ThemeSettings, v: string) =>
    setSettings((p) => ({ ...p, [k]: v }));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  const colorFields: { key: keyof ThemeSettings; label: string }[] = [
    { key: 'primary_color', label: 'Primary Color (Pine)' },
    { key: 'secondary_color', label: 'Secondary Color' },
    { key: 'accent_color', label: 'Accent Color (Gold)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Theme & Colors</h1>
          <p className="text-stone mt-1">Customize your website's brand colors and identity</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6 space-y-8">
        {/* Brand Colors */}
        <div>
          <h2 className="font-serif text-xl font-semibold text-pine-dark mb-1 flex items-center gap-2">
            <Palette className="w-5 h-5 text-gold" /> Brand Colors
          </h2>
          <p className="text-stone text-sm mb-5">Note: Color changes require a rebuild to take full effect in Tailwind classes.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {colorFields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-pine-dark mb-2">{label}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings[key] as string}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-cream-dark"
                  />
                  <input
                    type="text"
                    value={settings[key] as string}
                    onChange={(e) => set(key, e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none font-mono text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logo & Branding */}
        <div className="border-t border-cream-dark pt-6">
          <h2 className="font-serif text-xl font-semibold text-pine-dark mb-5">Logo & Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-2">Site Name</label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => set('site_name', e.target.value)}
                className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-2">Logo URL</label>
              <input
                type="url"
                value={settings.logo_url}
                onChange={(e) => set('logo_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pine-dark mb-2">Favicon URL</label>
              <input
                type="url"
                value={settings.favicon_url}
                onChange={(e) => set('favicon_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          {settings.logo_url && (
            <div className="mt-4 p-4 bg-cream rounded-lg inline-block">
              <p className="text-xs text-stone mb-2">Logo Preview</p>
              <img src={settings.logo_url} alt="Logo preview" className="h-12 object-contain" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
