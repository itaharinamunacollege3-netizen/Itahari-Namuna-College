import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, CheckCircle, LayoutGrid } from 'lucide-react';
import { getProgramBySlug } from '../services/programsService';

// Sub-components
import RequirementsChecklist from '../components/RequirementsChecklist';
import SyllabusAccordian from '../components/SyllabusAccordian';
import ProgramOverview from '../components/ProgramOverview';
import AnimatedSection from '../../../components/animations/AnimatedSection';

const ProgramDetailPage = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    getProgramBySlug(id)
      .then((item) => {
        if (!isMounted) return;
        setProgram(item);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
    { id: 'syllabus', label: 'Curriculum & Syllabus', icon: LayoutGrid },
  ];

  const getActiveIndex = () => tabsConfig.findIndex((tab) => tab.id === activeTab);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-[#006A38]" />
        <p className="text-stone-500 text-sm mt-4">Loading program details...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading font-bold text-stone-800 text-xl mb-2">Program Not Found</h2>
        <p className="text-stone-500 text-sm mb-4">The program you're looking for doesn't exist.</p>
        <Link to="/academic" className="text-[#006A38] font-semibold flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Programs
        </Link>
      </div>
    );
  }

  return (
    <AnimatedSection>
    <div className="w-full min-h-screen bg-stone-50 text-left">
      {/* 1. HEADER BANNER */}
      <div 
        className="w-full relative bg-stone-900 text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${program.image})` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/90 via-[#00522b]/85 to-transparent z-10" />
        <div className="max-w-7xl mx-auto relative z-20 space-y-4">
          <Link to="/academic" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> <span>Academic Programs</span>
          </Link>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-white">{program.title}</h1>
          <p className="font-heading italic text-emerald-100/90 text-lg">"{program.tagline}"</p>

          {/* Quick info pills */}
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white">
              {program.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white">
              {program.university}
            </span>
            {program.seats && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white">
                {program.seats} Seats
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. SLIDING PILL SWITCHER */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="inline-block bg-stone-200/60 p-1.5 rounded-2xl border border-stone-200/60 relative overflow-hidden backdrop-blur-xs">
          <div role="tablist" className="relative flex items-center gap-1 z-10">
            <div
              className="absolute top-0 bottom-0 left-0 bg-white shadow-md shadow-stone-300/60 rounded-xl transition-all duration-300 ease-out pointer-events-none"
              style={{
                width: `${100 / tabsConfig.length}%`,
                transform: `translateX(${getActiveIndex() * 100}%)`,
              }}
            />
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`relative z-10 font-heading font-bold cursor-pointer text-xs sm:text-sm px-5 sm:px-6 h-10 transition-colors duration-300 flex items-center gap-2 ${
                    activeTab === tab.id ? "text-emerald-800" : "text-stone-500 hover:text-stone-800"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && <ProgramOverview program={program} />}
            {activeTab === "eligibility" && <RequirementsChecklist eligibility={program.eligibility} />}
            {activeTab === "syllabus" && <SyllabusAccordian curriculum={program.curriculum} />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA card */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-2xs h-fit sticky top-6">
              <h4 className="font-heading font-bold text-stone-800 text-lg">Admissions Open</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                Enrollment pathways are active under TU guidelines. Apply now to secure your seat.
              </p>
              <Link
                to={`/admissions?program=${id}`}
                className="block text-center w-full bg-[#006A38] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#00522b] transition-colors shadow-sm"
              >
                Apply For Admission
              </Link>
            </div>

            {/* Quick facts */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-4">
              <h4 className="font-heading font-bold text-stone-800 text-sm">Quick Facts</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Duration</span>
                  <span className="font-semibold text-stone-800">{program.duration}</span>
                </div>
                <div className="h-px bg-stone-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">University</span>
                  <span className="font-semibold text-stone-800">{program.university}</span>
                </div>
                {program.seats && (
                  <>
                    <div className="h-px bg-stone-100" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-500">Available Seats</span>
                      <span className="font-semibold text-stone-800">{program.seats}</span>
                    </div>
                  </>
                )}
                <div className="h-px bg-stone-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">Semesters</span>
                  <span className="font-semibold text-stone-800">{Object.keys(program.curriculum ?? {}).length}</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {program.highlights?.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs space-y-3">
                <h4 className="font-heading font-bold text-stone-800 text-sm">Program Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {program.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AnimatedSection>
  );
};

export default ProgramDetailPage;
