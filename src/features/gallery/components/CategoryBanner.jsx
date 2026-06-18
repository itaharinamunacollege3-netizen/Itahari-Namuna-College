// src/features/gallery/components/CategoryBanner.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function CategoryBanner({ title, subtitle, bgImage }) {
  return (
    <div 
      className="w-full relative bg-stone-900 text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* The same gradient overlay from your academic page */}
      <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/90 via-[#00522b]/85 to-transparent z-10" />
      
      <div className="max-w-7xl mx-auto relative z-20 space-y-4">
        <Link to="/gallery" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> <span>Back to Gallery</span>
        </Link>
        <h1 className="font-heading font-bold text-3xl sm:text-5xl text-white">{title}</h1>
        <p className="font-heading italic text-emerald-100/90 text-lg">"{subtitle}"</p>
      </div>
    </div>
  );
}