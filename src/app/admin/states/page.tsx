'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, GripVertical, Eye, EyeOff, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

interface State {
  id: string; name: string; slug: string; description: string;
  image_url: string; is_active: boolean; sort_order: number;
}

export default function AdminStatesPage() {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchStates(); }, []);

  async function fetchStates() {
    try {
      const res = await fetch('/api/admin/states');
      if (res.status === 401) { window.location.href = '/admin/login'; return; }
      const data = await res.json();
      setStates(data.states || []);
    } catch { toast.error('Failed to load states'); }
    finally { setLoading(false); }
  }

  async function toggleActive(state: State) {
    const res = await fetch(`/api/admin/states/${state.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !state.is_active }),
    });
    if (res.ok) {
      setStates(prev => prev.map(s => s.id === state.id ? { ...s, is_active: !s.is_active } : s));
      toast.success(`${state.name} ${!state.is_active ? 'activated' : 'hidden'}`);
    }
  }

  async function deleteState(id: string) {
    const res = await fetch(`/api/admin/states/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setStates(prev => prev.filter(s => s.id !== id));
      toast.success('State deleted');
    } else {
      toast.error('Delete failed');
    }
    setDeleteId(null);
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pine-dark">States / Regions</h1>
          <p className="text-text-mid text-sm mt-1">
            These appear as the two big cards on the homepage. Add more states anytime.
          </p>
        </div>
        <Link
          href="/admin/states/new"
          className="inline-flex items-center gap-2 bg-pine text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-pine-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Add State
        </Link>
      </div>

      {/* Preview hint */}
      <div className="bg-gold/10 border border-gold/30 rounded-xl px-5 py-3 mb-6 text-sm text-pine-dark flex items-center gap-3">
        <Globe className="w-4 h-4 text-gold shrink-0" />
        Visitors click a state card → see all tours tagged with that state.
        Tag tours to a state inside <Link href="/admin/tours" className="underline">Tours → Edit Tour → State field</Link>.
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2].map(i => <div key={i} className="h-24 bg-stone-light/40 rounded-xl animate-pulse" />)}
        </div>
      ) : states.length === 0 ? (
        <div className="text-center py-20 text-text-mid">
          <Globe className="w-12 h-12 mx-auto mb-3 text-stone-light" />
          <p>No states yet.</p>
          <Link href="/admin/states/new" className="mt-4 inline-block text-pine underline text-sm">Add your first state</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {states.map((state) => (
            <div key={state.id} className="bg-white border border-stone-light/60 rounded-xl p-5 flex items-center gap-5 shadow-sm hover:shadow transition-shadow">
              {/* Drag handle placeholder */}
              <GripVertical className="w-5 h-5 text-stone-light shrink-0" />

              {/* Thumbnail */}
              <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-light/30">
                {state.image_url ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${state.image_url})` }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-stone-light" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-pine-dark">{state.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${state.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-light/50 text-text-mid'}`}>
                    {state.is_active ? 'VISIBLE' : 'HIDDEN'}
                  </span>
                </div>
                <p className="text-sm text-text-mid truncate mt-0.5">{state.description || '—'}</p>
                <p className="text-xs text-stone-light mt-0.5">slug: /{state.slug}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(state)}
                  title={state.is_active ? 'Hide from homepage' : 'Show on homepage'}
                  className="p-2 rounded-lg hover:bg-stone-light/40 text-text-mid hover:text-pine transition-colors"
                >
                  {state.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <Link
                  href={`/admin/states/${state.id}/edit`}
                  className="p-2 rounded-lg hover:bg-gold/10 text-text-mid hover:text-gold transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setDeleteId(state.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-text-mid hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-pine-dark text-lg mb-2">Delete this state?</h3>
            <p className="text-text-mid text-sm mb-6">
              Tours tagged to this state won't be deleted, but they won't appear on any state page.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-stone-light rounded-xl py-2.5 text-sm font-medium hover:bg-stone-light/30 transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteState(deleteId)} className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
