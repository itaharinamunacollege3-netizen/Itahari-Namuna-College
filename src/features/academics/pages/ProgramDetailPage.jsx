import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import courseData from '../data/courseMatrix.json';

// Sub-components
import RequirementsChecklist from '../components/RequirementsChecklist';
import SyllabusAccordian from '../components/SyllabusAccordian';
import ProgramOverview from '../components/ProgramOverview';
import AnimatedSection from '../../../components/animations/AnimatedSection';

const ProgramDetailPage = () => {
  const { id } = useParams();
  const program = courseData?.programs?.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('overview');

  const tabsConfig = [
    { id: 'overview', label: 'Overview & Highlights' },
    { id: 'eligibility', label: 'Eligibility & Entry' },
    { id: 'syllabus', label: 'Curriculum Syllabus' },
  ];

  const getActiveIndex = () => tabsConfig.findIndex((tab) => tab.id === activeTab);

  if (!program) {
    return (
      <div className="w-full min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading font-bold text-stone-800 text-xl mb-2">Program Not Found</h2>
        <Link to="/academic" className="text-[#006A38] font-semibold flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Offerings
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
            {tabsConfig.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                className={`relative z-10 font-heading font-bold cursor-pointer text-xs sm:text-sm px-6 h-9 transition-colors duration-300 ${
                  activeTab === tab.id ? "text-emerald-800" : "text-stone-500 hover:text-stone-800"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
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
          <div className="bg-white border border-stone-200 rounded-3xl p-6 space-y-4 shadow-2xs h-fit">
            <h4 className="font-bold text-stone-800">Admissions Open</h4>
            <p className="text-xs text-stone-500">Enrollment pathways are active under TU guidelines.</p>
            <button className="w-full bg-[#006A38] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#00522b] transition-colors">
              Apply For Admission
            </button>
          </div>
        </div>
      </div>
    </div>
    </AnimatedSection>
  );
};

export default ProgramDetailPage;