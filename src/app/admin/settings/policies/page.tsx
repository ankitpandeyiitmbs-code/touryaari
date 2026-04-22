'use client';
import { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

interface PolicySettings {
  privacy_policy_content: string;
  terms_content: string;
  refund_policy_content: string;
}

export default function PoliciesSettingsPage() {
  const [settings, setSettings] = useState<PolicySettings>({
    privacy_policy_content: '',
    terms_content: '',
    refund_policy_content: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activePolicy, setActivePolicy] = useState('privacy');

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
      if (res.ok) toast.success('Policies saved!');
      else toast.error('Failed to save');
    } catch { toast.error('Error saving'); }
    finally { setIsSaving(false); }
  };

  const set = (k: keyof PolicySettings, v: string) => setSettings((p) => ({ ...p, [k]: v }));

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  const policies = [
    { id: 'privacy', label: 'Privacy Policy', key: 'privacy_policy_content' as keyof PolicySettings },
    { id: 'terms', label: 'Terms & Conditions', key: 'terms_content' as keyof PolicySettings },
    { id: 'refund', label: 'Refund Policy', key: 'refund_policy_content' as keyof PolicySettings },
  ];

  const active = policies.find((p) => p.id === activePolicy)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Legal Policies</h1>
          <p className="text-stone mt-1">Manage your Privacy Policy, Terms & Conditions, and Refund Policy</p>
        </div>
        <button onClick={handleSave} disabled={isSaving}
          className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light disabled:opacity-50">
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save All Policies'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark">
        <div className="border-b border-cream-dark flex">
          {policies.map((p) => (
            <button key={p.id} onClick={() => setActivePolicy(p.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activePolicy === p.id ? 'border-gold text-gold' : 'border-transparent text-stone hover:text-pine-dark'
              }`}>
              <FileText className="w-4 h-4" />{p.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl font-semibold text-pine-dark">{active.label}</h2>
              <p className="text-stone text-sm mt-1">
                Supports HTML markup. This content will be displayed on the corresponding public page.
              </p>
            </div>
            <a href={`/${activePolicy === 'privacy' ? 'privacy-policy' : activePolicy === 'terms' ? 'terms' : 'refund-policy'}`}
              target="_blank" rel="noopener noreferrer"
              className="text-sm text-gold hover:underline">
              View page →
            </a>
          </div>
          <textarea
            value={settings[active.key]}
            onChange={(e) => set(active.key, e.target.value)}
            rows={20}
            placeholder={`Enter your ${active.label} content here. You can use HTML tags for formatting.\n\nExample:\n<h2>Section Title</h2>\n<p>Your policy content here...</p>`}
            className="w-full px-4 py-3 border border-cream-dark rounded-lg focus:border-gold focus:outline-none font-mono text-sm resize-y"
          />
          <p className="text-xs text-stone mt-2">
            {settings[active.key].length} characters
          </p>
        </div>
      </div>
    </div>
  );
}
