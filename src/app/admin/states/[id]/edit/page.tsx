'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditStatePage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', description: '', image_url: '',
    hero_image: '', sort_order: 10, is_active: true,
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/admin/states/${id}`);
      if (res.status === 401) { router.push('/admin/login'); return; }
      const data = await res.json();
      if (data.state) setForm(data.state);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('State name is required'); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/states/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      toast.success('State updated!');
      router.push('/admin/states');
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this state? Tours tagged to it won\'t be deleted.')) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/states/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); router.push('/admin/states'); }
    else { toast.error('Delete failed'); setDeleting(false); }
  };

  if (loading) return <div className="p-8 text-text-mid">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/states" className="p-2 rounded-lg hover:bg-stone-light/30 transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-mid" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-pine-dark">Edit State</h1>
            <p className="text-text-mid text-sm">{form.name}</p>
          </div>
        </div>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-2 text-red-500 border border-red-200 rounded-xl px-4 py-2 text-sm hover:bg-red-50 transition-colors disabled:opacity-50">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-light/60 p-7 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">State Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)}
            className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">URL Slug</label>
          <div className="flex items-center border border-stone-light rounded-xl overflow-hidden">
            <span className="px-3 py-3 bg-stone-light/30 text-text-mid text-sm border-r border-stone-light">/states/</span>
            <input value={form.slug} onChange={e => set('slug', e.target.value)}
              className="flex-1 px-4 py-3 text-sm focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">Short Description</label>
          <textarea value={form.description} onChange={e => set('description', e.target.value)}
            rows={3} className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gold/40" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">Card Image URL</label>
          <input value={form.image_url} onChange={e => set('image_url', e.target.value)}
            className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
          {form.image_url && (
            <div className="mt-2 rounded-xl overflow-hidden aspect-[4/3]">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${form.image_url})` }} />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-pine-dark mb-1.5">Hero Image URL</label>
          <input value={form.hero_image} onChange={e => set('hero_image', e.target.value)}
            placeholder="Optional — wider banner for the state page"
            className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-pine-dark mb-1.5">Sort Order</label>
            <input type="number" value={form.sort_order}
              onChange={e => set('sort_order', parseInt(e.target.value) || 0)}
              className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-pine-dark mb-1.5">Visibility</label>
            <select value={form.is_active ? 'true' : 'false'}
              onChange={e => set('is_active', e.target.value === 'true')}
              className="w-full border border-stone-light rounded-xl px-4 py-3 text-sm focus:outline-none">
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
        <button onClick={handleSubmit} disabled={saving}
          className="flex-1 bg-pine text-white rounded-xl py-3 text-sm font-semibold hover:bg-pine-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
