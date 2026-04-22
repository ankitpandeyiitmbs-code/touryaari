'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string;
  alt_text: string;
  category: string;
  is_active: boolean;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAdd() {
    if (!newImageUrl.trim()) return;
    
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: newImageUrl,
          caption: newCaption,
          category: newCategory,
          is_active: true,
        }),
      });

      if (res.ok) {
        setNewImageUrl('');
        setNewCaption('');
        setNewCategory('');
        fetchImages();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image?')) return;
    
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) fetchImages();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="text-stone">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pine-dark">Gallery</h1>
          <p className="text-stone mt-1">Manage gallery images</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card border border-cream-dark p-6">
        <h2 className="font-serif text-lg font-bold text-pine-dark mb-4">Add New Image</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="url"
            placeholder="Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
          <input
            type="text"
            placeholder="Caption"
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            className="px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
          <input
            type="text"
            placeholder="Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-4 py-2.5 border border-cream-dark rounded-lg focus:border-gold focus:outline-none"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!newImageUrl}
          className="mt-4 px-6 py-2.5 bg-gold text-pine-dark font-semibold rounded-lg hover:bg-gold-light disabled:opacity-50 inline-flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-xl shadow-card border border-cream-dark overflow-hidden group">
            <div className="relative aspect-square">
              <img src={image.image_url} alt={image.alt_text || ''} className="w-full h-full object-cover" />
              <button
                onClick={() => handleDelete(image.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-pine-dark truncate">{image.caption || 'Untitled'}</p>
              {image.category && <p className="text-xs text-stone">{image.category}</p>}
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-stone">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-cream-dark" />
          <p>No images in gallery yet</p>
        </div>
      )}
    </div>
  );
}
