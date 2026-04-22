'use client';

import { useState, useEffect } from 'react';
import { Save, Globe, Phone, Mail, Palette, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface SiteSettings {
  site_name: string;
  tagline: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  whatsapp: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  twitter_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  meta_title: string;
  meta_description: string;
  maintenance_mode: boolean;
  maintenance_message: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Touryaari Travels',
    tagline: 'Your Journey, Our Passion',
    phone_primary: '',
    phone_secondary: '',
    email: '',
    whatsapp: '',
    address: '',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
    twitter_url: '',
    primary_color: '#1B3A2D',
    secondary_color: '#2D4A3D',
    accent_color: '#C89033',
    meta_title: '',
    meta_description: '',
    maintenance_mode: false,
    maintenance_message: 'Site under maintenance. Back soon!',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'social', label: 'Social', icon: Mail },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'seo', label: 'SEO', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Site Settings</h1>
          <p className="text-stone mt-1">Configure your website settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark">
        <div className="border-b border-cream-dark">
          <nav className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                  activeTab === tab.id ? 'text-gold border-b-2 border-gold' : 'text-stone hover:text-pine-dark'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Site Name</label>
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) => handleChange('site_name', e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => handleChange('tagline', e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-cream-dark">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={(e) => handleChange('maintenance_mode', e.target.checked)}
                    className="w-4 h-4 text-gold"
                  />
                  <span className="text-sm font-medium text-pine-dark">Maintenance Mode</span>
                </label>
              </div>
              {settings.maintenance_mode && (
                <div>
                  <label className="block text-sm font-medium text-pine-dark mb-2">Maintenance Message</label>
                  <textarea
                    value={settings.maintenance_message}
                    onChange={(e) => handleChange('maintenance_message', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Primary Phone</label>
                <input
                  type="tel"
                  value={settings.phone_primary}
                  onChange={(e) => handleChange('phone_primary', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Secondary Phone</label>
                <input
                  type="tel"
                  value={settings.phone_secondary}
                  onChange={(e) => handleChange('phone_secondary', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">
                  WhatsApp Number
                  <span className="ml-2 text-xs font-normal text-text-mid">(with country code, no + or spaces — e.g. 919876543210)</span>
                </label>
                <input
                  type="tel"
                  value={settings.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="919876543210"
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
                <p className="text-xs text-text-mid mt-1">
                  This powers the floating WhatsApp button on every page.
                  Leave empty to hide the button.
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-pine-dark mb-2">Address</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Facebook URL</label>
                <input
                  type="url"
                  value={settings.facebook_url}
                  onChange={(e) => handleChange('facebook_url', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Instagram URL</label>
                <input
                  type="url"
                  value={settings.instagram_url}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">YouTube URL</label>
                <input
                  type="url"
                  value={settings.youtube_url}
                  onChange={(e) => handleChange('youtube_url', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Twitter URL</label>
                <input
                  type="url"
                  value={settings.twitter_url}
                  onChange={(e) => handleChange('twitter_url', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => handleChange('primary_color', e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondary_color}
                    onChange={(e) => handleChange('secondary_color', e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.accent_color}
                    onChange={(e) => handleChange('accent_color', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.accent_color}
                    onChange={(e) => handleChange('accent_color', e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Meta Title</label>
                <input
                  type="text"
                  value={settings.meta_title}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pine-dark mb-2">Meta Description</label>
                <textarea
                  value={settings.meta_description}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
