import { useEffect, useState } from 'react';
import AlbumCoverCard from '../components/AlbumCoverCard';
import AnimatedSection from '../../../components/animations/AnimatedSection';
import PageBanner from '../../../components/common/PageBanner';
import { galleryService } from '../services/galleryService'; // Ensure this points to your new service

export default function GalleryHubPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    galleryService.listPublicAlbums()
      .then((data) => {
        if (isMounted) {
          setAlbums(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch gallery albums:", err);
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <PageBanner 
        title="Campus Gallery" 
        subtitle="Exploring the vibrant life of our BCA, BHM, and BSW departments." 
      />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-20 text-stone-500">Loading gallery albums...</div>
        ) : (
          <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <AlbumCoverCard key={album.id} data={album} />
            ))}
          </AnimatedSection>
        )}
      </div>
    </>
  );
}