import { galleryData } from '../gallery-data/galleryData'
import AlbumCoverCard from '../components/AlbumCoverCard';
import AnimatedSection from '../../../components/animations/AnimatedSection';
import PageBanner from '../../../components/common/PageBanner';

export default function GalleryHubPage() {
  return (
    <>
    <PageBanner title="Campus Gallery" subtitle="Exploring the vibrant life of our BCA, BHM, and BSW departments." />
    <div className="max-w-7xl mx-auto px-6 py-12">

      <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryData.map((album) => (
          <AlbumCoverCard key={album.id} data={album} />
        ))}
      </AnimatedSection>
    </div>
    </>
  );
}