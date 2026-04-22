'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewStatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    hero_image: '',
    sort_order: 10,
    is_active: true,
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNameChange = (name: string) => {
    set('name', name);
    if (!form.slug || form.slug === autoSlug(form.name)) {
      set('slug', autoSlug(name));
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('State name is required'); return; }
    if (!form.slug.trim()) { toast.error('Slug is required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to create');
      }
      toast.success('State created!');
      router.push('/admin/states');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/states" className="p-2 rounded-lg hover:bg-stone-light/30 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-mid" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-pine-dark">Add New State</h1>
          <p className="text-text-mid text-sm">Add a new region card to the homepage</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-light/60 p-7 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">State Name *</label>
          <input
            value={form.name} onChange={e => handleNameChange(e.target.value)}
            placeholder="e.g. Himachal Pradesh"
            className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">URL Slug *</label>
          <div className="flex items-center border border-stone-light rounded-xl overflow-hidden">
            <span className="px-3 py-3 bg-stone-light/30 text-text-mid text-sm border-r border-stone-light">/states/</span>
            <input
              value={form.slug} onChange={e => set('slug', e.target.value)}
              className="flex-1 px-4 py-3 text-sm focus:outline-none"
              placeholder="himachal-pradesh"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">Short Description</label>
          <textarea
            value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} placeholder="One line shown on the homepage card..."
            className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">Card Image URL</label>
          <input
            value={form.image_url} onChange={e => set('image_url', e.target.value)}
            placeholder="https://... (used as the card background)"
            className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          {form.image_url && (
            <div className="mt-2 rounded-xl overflow-hidden aspect-[4/3] bg-stone-light/20">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${form.image_url})` }} />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">Hero Image URL <span className="font-normal text-text-mid">(wider, used at top of state page)</span></label>
          <input
            value={form.hero_image} onChange={e => set('hero_image', e.target.value)}
            placeholder="https://... (optional, defaults to card image)"
            className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-pine-dark mb-1.5">Sort Order</label>
            <input
              type="number" value={form.sort_order}
              onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
              className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
            <p className="text-xs text-text-mid mt-1">Lower = shown first</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-pine-dark mb-1.5">Visibility</label>
            <select
              value={form.is_active ? 'true' : 'false'}
              onChange={e => set('is_active', e.target.value === 'true')}
              className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none"
            >
              <option value="true">Visible on homepage</option>
              <option value="false">Hidden</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Link href="/admin/states" className="flex-1 text-center border border-stone-light rounded-xl py-3 text-sm font-medium hover:bg-stone-light/30 transition-colors">
          Cancel
        </Link>
        <button
          onClick={handleSubmit} disabled={saving}
          className="flex-1 bg-pine text-white rounded-xl py-3 text-sm font-semibold hover:bg-pine-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Create State'}
        </button>
      </div>
    </div>
  );
}
