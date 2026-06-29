import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from '../../../components/common/PageBanner';
import ProgramCard from '../components/ProgramCard';
import { getPrograms } from '../services/programsService';
import AnimatedSection from '../../../components/animations/AnimatedSection';

const AcademicHubPage = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getPrograms().then((items) => {
      if (!isMounted) return;
      setPrograms(items);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExploreProgram = (programId) => {
    navigate(`/academic/${programId}`);
  };

  return (
    <div className="w-full min-h-screen bg-stone-50 space-y-12 pb-20">
      
      {/* 1. REUSABLE COMMON BANNER INTEGRATION */}
      <Banner 
        tag="Academic Excellence"
        title="Our Academic Offerings"
        subtitle="Five TU-affiliated undergraduate programs designed for intellectual rigour, professional readiness, and social impact."
        />
      <AnimatedSection>

      {/* 2. PROGRAM GRID HOUSING CONTAINER */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {programs.map((program) => (
            <div key={program.id} className="h-full">
              <ProgramCard 
                program={program} 
                onExplore={handleExploreProgram}
              />
            </div>
          ))}
        </div>
      </div>

    </AnimatedSection>
    </div>
  );
};
export default AcademicHubPage;