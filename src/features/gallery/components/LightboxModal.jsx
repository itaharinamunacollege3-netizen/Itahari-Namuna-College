import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxModal({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const next = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % images.length); };
  const prev = (e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button className="absolute top-6 right-6 text-white" onClick={onClose}><X size={40}/></button>
      
      <button className="absolute left-6 text-white" onClick={prev}><ChevronLeft size={40}/></button>
      <img src={images[currentIndex]} className="max-h-[80vh] max-w-[90vw] object-contain" />
      <button className="absolute right-6 text-white" onClick={next}><ChevronRight size={40}/></button>
    </div>
  );
}