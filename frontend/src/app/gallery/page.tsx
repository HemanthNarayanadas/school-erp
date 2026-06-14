'use client';

import React, { useState } from 'react';

const galleryItems = [
  { id: 1, title: 'Annual Day Celebrations', category: 'events', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&fit=crop&q=80' },
  { id: 2, title: 'Chemistry Lab Session', category: 'academics', image: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=800&fit=crop&q=80' },
  { id: 3, title: 'Basketball League Finals', category: 'sports', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&fit=crop&q=80' },
  { id: 4, title: 'Computer Programming Class', category: 'academics', image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&fit=crop&q=80' },
  { id: 5, title: 'Science Exhibition InnoQuest', category: 'events', image: 'https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=800&fit=crop&q=80' },
  { id: 6, title: 'Inter-House Athletic Sprinters', category: 'sports', image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&fit=crop&q=80' },
];

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const filteredItems = filter === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  return (
    <div className="w-full py-16 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-4 text-center">
        
        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">School Gallery</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Visual Highlights of Campus Activities & Events
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-2 mb-12">
          {['all', 'academics', 'sports', 'events'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-primary text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat === 'all' ? 'Show All' : cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm transition-transform hover:-translate-y-1">
              <div className="h-56 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <span className="text-[10px] text-amber-500 uppercase font-extrabold tracking-wider">{item.category}</span>
                <h3 className="font-extrabold text-sm text-slate-850 dark:text-white mt-1 leading-tight">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
