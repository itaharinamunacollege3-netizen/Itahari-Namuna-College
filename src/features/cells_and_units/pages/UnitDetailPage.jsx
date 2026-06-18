import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { unitsData } from '../data/unitaData'; // Your data file

const UnitDetailPage = () => {
  const { unitId } = useParams();
  const unit = unitsData[unitId];

  if (!unit) return <div>Unit not found</div>;

  return (
    <div className="w-full min-h-screen bg-stone-50 text-left">
      {/* 1. HEADER BANNER: Uses dynamic image from the unit data */}
      <div 
        className="w-full relative bg-stone-900 text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${unit.bannerImage || unit.icon})` }}
      >
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="max-w-7xl mx-auto relative z-20 space-y-4">
          <Link to="/cells-and-units" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Back to Committees</span>
          </Link>
          <h1 className="font-bold text-3xl sm:text-5xl text-white">{unit.title}</h1>
          <p className="text-emerald-100/90 text-lg">{unit.subtitle}</p>
        </div>
      </div>

      {/* 2. CONTENT AREA: Structured for your committee data */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Objectives Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Objectives</h2>
              <ul className="list-disc pl-5 space-y-2 text-stone-600">
                {unit.objectives?.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </section>

            {/* Duties Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Duties & Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-2 text-stone-600">
                {unit.duties?.map((duty, i) => <li key={i}>{duty}</li>)}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 h-fit space-y-6">
            <h4 className="font-bold text-lg">Committee Overview</h4>
            {/* Add any extra meta data here */}
            <div className="text-sm text-stone-500">
              <p><strong>Formation:</strong> {unit.formation?.term || 'N/A'}</p>
              <p><strong>Quorum:</strong> {unit.formation?.quorum || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetailPage;