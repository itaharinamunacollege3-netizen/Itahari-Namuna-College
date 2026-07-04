import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUnitByIdOrSlug } from '../data/unitsService';

const UnitDetailPage = () => {
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const data = await getUnitByIdOrSlug(unitId);
        if (active) setUnit(data);
      } catch (err) {
        console.error("Failed to load unit:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (unitId) load();
    return () => {
      active = false;
    };
  }, [unitId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-500">Loading unit...</div>;
  if (!unit) return <div className="min-h-screen flex items-center justify-center text-stone-500">Unit not found</div>;

  return (
    <div className="w-full min-h-screen bg-stone-50 text-left">
      {/* 1. HEADER BANNER: Uses dynamic image from the unit data */}
      <div 
        className="w-full relative bg-stone-900 text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${unit.iconUrl || ''})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#075F6C]/40 via-[#054a55]/0 to-[#075F6C]/40 z-10" />
        <div className="max-w-7xl mx-auto relative z-20 space-y-4">
          <Link to="/cells-and-units" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 duration-300">
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Back to Committees</span>
          </Link>
          <h1 className="font-bold text-3xl sm:text-5xl text-white">{unit.title}</h1>
          <p className="text-emerald-100/90 text-lg">{unit.category || unit.code}</p>
        </div>
      </div>

      {/* 2. CONTENT AREA: Structured for your committee data */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Objectives Section */}
            {unit.objectives?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Objectives</h2>
                <ul className="list-disc pl-5 space-y-2 text-stone-600">
                  {unit.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>
              </section>
            )}

            {/* Duties Section */}
            {unit.duties?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Duties & Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2 text-stone-600">
                  {unit.duties.map((duty, i) => <li key={i}>{duty}</li>)}
                </ul>
              </section>
            )}

            {/* Action Plan Section (if we want to show it) */}
            {unit.actionPlan?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Action Plan</h2>
                <div className="space-y-4">
                  {unit.actionPlan.map((item, i) => (
                    <div key={i} className="border border-stone-200 rounded-xl p-4 bg-white">
                      <h4 className="font-bold text-stone-800">{item.sn}. {item.activity}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-stone-600">
                        {item.byWhen && <p><strong>By When:</strong> {item.byWhen}</p>}
                        {item.byWho && <p><strong>By Who:</strong> {item.byWho}</p>}
                        {item.budget && <p><strong>Budget:</strong> {item.budget}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 h-fit space-y-6">
            <h4 className="font-bold text-lg">Committee Overview</h4>
            <div className="text-sm text-stone-500 space-y-2">
              <p><strong>Code:</strong> {unit.code || 'N/A'}</p>
              <p><strong>Category:</strong> {unit.category || 'N/A'}</p>
              {unit.featured && <p><span className="badge badge-warning badge-sm">Featured</span></p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetailPage;