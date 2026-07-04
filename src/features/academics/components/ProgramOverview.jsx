import { BookOpen, Target, Briefcase } from 'lucide-react';
import AnimatedSection from '../../../components/animations/AnimatedSection';

const ProgramOverview = ({ program }) => {
  return (
    <AnimatedSection>
      <div className="space-y-8 animate-fade-in-up">
        {/* Primary Overview */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-2xs">
          <h3 className="font-heading font-bold text-stone-800 text-xl mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-primary" /> Program Introduction
          </h3>
          <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
            {program.overview}
          </p>
        </div>

        {/* Secondary Content: Objectives or Career (Conditional Mapping) */}
        {(program.objectives || program.careerPathways) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {program.objectives && (
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs">
                <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand-primary" /> Program Objectives
                </h4>
                <ul className="space-y-2">
                  {program.objectives.map((obj, i) => (
                    <li key={i} className="text-xs text-stone-600 flex gap-2">
                      <span className="text-[#006A38]">•</span> {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {program.careerPathways && (
              <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xs">
                <h4 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-primary" /> Career Pathways
                </h4>
                <ul className="space-y-2">
                  {program.careerPathways.map((path, i) => (
                    <li key={i} className="text-xs text-stone-600 font-medium bg-stone-50 p-2 rounded-lg">
                      {path}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
};

export default ProgramOverview;