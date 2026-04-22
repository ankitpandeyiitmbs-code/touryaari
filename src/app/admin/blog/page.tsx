'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  published_at: string;
  cover_image: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (search) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter === 'published') {
      result = result.filter(p => p.is_published);
    } else if (statusFilter === 'draft') {
      result = result.filter(p => !p.is_published);
    }
    setFiltered(result);
  }, [search, statusFilter, posts]);

  async function fetchPosts() {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      setPosts(data.posts || []);
      setFiltered(data.posts || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Blog Posts</h1>
          <p className="text-stone mt-1">Manage blog content</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 bg-gold text-pine-dark font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light">
          <Plus className="w-5 h-5" /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-card border border-cream-dark">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Post</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Views</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-cream/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={post.cover_image || '/placeholder.jpg'} alt={post.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-pine-dark">{post.title}</p>
                        {post.is_featured && <span className="text-xs text-gold">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone">{post.category || '-'}</td>
                  <td className="px-6 py-4 text-sm text-stone">{post.views_count}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-gold hover:bg-gold/10 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`/admin/blog/${post.id}/edit`} className="p-2 text-gold hover:bg-gold/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-12 text-stone">No posts found</div>}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-serif text-xl font-bold text-pine-dark mb-2">Confirm Delete</h3>
            <p className="text-stone mb-6">Are you sure?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-cream-dark text-stone rounded-lg">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
