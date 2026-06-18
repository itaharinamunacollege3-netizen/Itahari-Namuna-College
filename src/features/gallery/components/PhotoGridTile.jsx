import React from 'react';

export default function PhotoGridTile({ src, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="group aspect-square overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <img 
        src={src} 
        alt="Gallery item" 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
  );
}