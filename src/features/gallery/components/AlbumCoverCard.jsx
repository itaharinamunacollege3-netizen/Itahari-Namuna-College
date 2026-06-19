import { useNavigate } from 'react-router-dom';

export default function AlbumCoverCard({ data }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/gallery/${data.id}`)}
      className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Background Image */}
      <img loading="lazy" decoding="async" 
        src={data.coverImage} 
        alt={data.title} 
        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-brand-dark/90 to-transparent p-6 flex flex-col justify-end">
        <h3 className="text-xl font-heading font-bold text-white mb-1">{data.title}</h3>
        <p className="text-white/70 text-xs font-medium">{data.description}</p>
      </div>
    </div>
  );
}