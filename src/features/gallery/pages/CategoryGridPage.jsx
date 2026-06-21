import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { galleryService } from '../services/galleryService'; // Ensure this points to your new gallery service
import PhotoGridTile from '../components/PhotoGridTile';
import CategoryBanner from '../components/CategoryBanner';
import LightboxModal from '../components/LightboxModal';
import AnimatedSection from '../../../components/animations/AnimatedSection';

export default function CategoryGridPage() {
  const { category } = useParams(); // Matches route path 'gallery/:category'
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    galleryService.getPublicAlbumBySlug(category)
      .then((data) => {
        if (isMounted) {
          setAlbum(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch album details:", err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [category]);

  if (loading) {
    return <div className="text-center py-20 text-stone-600">Loading album...</div>;
  }

  if (!album) {
    return <div className="text-center py-20 text-stone-600">Album not found.</div>;
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
            <PhotoGridTile 
              key={idx} 
              src={img} 
              onClick={() => setSelectedImage(idx)} 
            />
          ))}
        </AnimatedSection>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <LightboxModal 
          images={album.images} 
          initialIndex={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </main>
  );
}