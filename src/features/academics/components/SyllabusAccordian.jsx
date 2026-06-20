import { useState } from 'react';
import { ChevronDown, BookOpen } from 'lucide-react';
import AnimatedSection from '../../../components/animations/AnimatedSection';

const SyllabusAccordian = ({ curriculum }) => {
  const [openYear, setOpenYear] = useState(Object.keys(curriculum)[0]);

  return (
    <AnimatedSection>
      <div className="space-y-4">
        {Object.entries(curriculum).map(([semester, subjects]) => {
          const isOpen = openYear === semester;
          return (
            <div
              key={semester}
              className="bg-white border border-stone-200 rounded-2xl shadow-2xs overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenYear(isOpen ? null : semester)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors duration-300 hover:bg-emerald-50/50 cursor-pointer"
              >
                <span className="font-heading font-bold text-stone-800 text-sm sm:text-base flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-[#006A38]" />
                  Academic Year / Semester {semester}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180 text-[#006A38]' : ''}`}
                />
              </button>

              {/* Smooth transition container */}
              <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 border-t border-stone-100">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {subjects.map((subject, index) => (
                        <li
                          key={index}
                          className="text-xs sm:text-sm text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100 transition-colors hover:border-[#006A38]/20"
                        >
                          {subject}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
};

export default SyllabusAccordian;