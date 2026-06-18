import React from 'react';
import { useParams } from 'react-router-dom';
import { galleryData } from '../gallery-data/galleryData';
import PhotoGridTile from '../components/PhotoGridTile';
import CategoryBanner from '../components/CategoryBanner'; // Import custom banner
import AnimatedSection from '../../../components/animations/AnimatedSection';

export default function CategoryGridPage() {
  const { id } = useParams();
  const album = galleryData.find((a) => a.id && a.id.toLowerCase() === id?.toLowerCase());

  if (!album) {
    return <div className="text-center py-20">Album not found.</div>;
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <CategoryBanner 
        title={album.title} 
        subtitle={album.description} 
        bgImage={album.coverImage} 
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatedSection className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {album.images?.map((img, idx) => (
            <PhotoGridTile key={idx} src={img} />
          ))}
        </AnimatedSection>
      </div>
    </main>
  );
}