'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map, MapPin, Calendar, MessageSquare,
  FileText, Star, Image as ImageIcon, Users, Settings,
  Image, ChevronDown, Palette, Globe, Shield, Layers,
} from 'lucide-react';
import { useState } from 'react';

const mainNavItems = [
  { href: '/admin',              label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/states',       label: 'States',      icon: Layers },
  { href: '/admin/tours',        label: 'Tours',       icon: Map },
  { href: '/admin/destinations', label: 'Destinations',icon: MapPin },
  { href: '/admin/bookings',     label: 'Bookings',    icon: Calendar },
  { href: '/admin/inquiries',    label: 'Inquiries',   icon: MessageSquare },
  { href: '/admin/blog',         label: 'Blog Posts',  icon: FileText },
  { href: '/admin/testimonials', label: 'Testimonials',icon: Star },
  { href: '/admin/gallery',      label: 'Gallery',     icon: ImageIcon },
  { href: '/admin/hero-slides',  label: 'Hero Slides', icon: Image },
  { href: '/admin/filter-options', label: 'Filter Options', icon: Settings },
  { href: '/admin/users',        label: 'Users',       icon: Users },
];

const settingsNavItems = [
  { href: '/admin/settings',           label: 'General Settings', icon: Settings },
  { href: '/admin/settings/theme',     label: 'Theme & Colors',   icon: Palette },
  { href: '/admin/settings/pages',     label: 'Page Content',     icon: Globe },
  { href: '/admin/settings/seo',       label: 'SEO Settings',     icon: FileText },
  { href: '/admin/settings/policies',  label: 'Legal Policies',   icon: Shield },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(
    !!pathname?.startsWith('/admin/settings')
  );

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : !!pathname?.startsWith(href);

  return (
    <aside className="w-64 bg-[#4A7C59] text-white min-h-[calc(100vh-64px)] border-r border-gold/10 overflow-y-auto flex-shrink-0">
      <nav className="p-4 space-y-1">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm ${
              isActive(item.href)
                ? 'bg-gold/20 text-gold-light border-l-2 border-gold'
                : 'hover:bg-gold/10 hover:text-gold-light text-white/80'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
          </Link>
        ))}

        {/* Settings Group */}
        <div className="pt-4 mt-4 border-t border-gold/10">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gold/10 hover:text-gold-light transition-colors text-sm text-white/80"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span>Settings</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} />
          </button>

          {settingsOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {settingsNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                    pathname === item.href
                      ? 'bg-gold/20 text-gold-light border-l-2 border-gold'
                      : 'hover:bg-gold/10 hover:text-gold-light text-white/70'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
