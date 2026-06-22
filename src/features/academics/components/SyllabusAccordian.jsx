import { useState } from 'react';
import { ChevronDown, BookOpen, GraduationCap, Layers, Clock } from 'lucide-react';
import AnimatedSection from '../../../components/animations/AnimatedSection';

function getYear(sem) {
  return Math.ceil(Number(sem) / 2);
}

/* ------------------------------------------------------------------ */
/* Subject card                                                      */
/* ------------------------------------------------------------------ */
function SubjectCard({ subject, index }) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-stone-100 bg-stone-50/50 p-4 transition-all duration-200 hover:border-stone-200 hover:shadow-sm">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-200 text-[11px] font-bold text-stone-600">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-stone-800 leading-snug">{subject}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Single semester accordion item                                    */
/* ------------------------------------------------------------------ */
function SemesterItem({ semester, subjects, isOpen, onToggle }) {
  const sem = Number(semester);
  const subjectCount = subjects.length;

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-stone-200 shadow-sm' : 'border-stone-100'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-5 text-left hover:bg-stone-50/80 transition-colors duration-200 cursor-pointer"
      >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${isOpen ? 'bg-brand-primary text-white shadow-md scale-110' : 'bg-stone-100 text-stone-500'}`}>
          <span className="text-lg font-bold">{sem}</span>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-heading font-bold text-stone-800 text-sm sm:text-base">Semester {sem}</h4>
          <div className="mt-1 flex items-center gap-3 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" /> {subjectCount} Subjects
            </span>
            {/* <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> ~{subjectCount * 3} Credit Hrs
            </span> */}
          </div>
        </div>

        <ChevronDown className={`h-5 w-5 shrink-0 text-stone-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`} />
      </button>

      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-6 pt-2">
            <div className="mb-4 h-px bg-stone-100" />
            {subjectCount > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {subjects.map((subject, i) => (
                  <SubjectCard key={i} subject={subject} index={i} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-stone-400"><Layers className="h-8 w-8 mx-auto mb-2 opacity-50" /> No subjects listed</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Accordion                                                    */
/* ------------------------------------------------------------------ */
/* ... (keep imports and helper functions as they are) ... */

const SyllabusAccordian = ({ curriculum }) => {
  const semesterEntries = Object.entries(curriculum ?? {})
    .map(([semester, value]) => ({
      semester,
      subjects: Array.isArray(value) ? value : (value?.subjects ?? []),
    }))
    .sort((a, b) => Number(a.semester) - Number(b.semester));

  // --- ADDED THIS LINE ---
  const totalSubjects = semesterEntries.reduce((sum, e) => sum + e.subjects.length, 0);

  const [openSemester, setOpenSemester] = useState(semesterEntries[0]?.semester ?? null);

  const years = {};
  for (const entry of semesterEntries) {
    const year = getYear(entry.semester);
    if (!years[year]) years[year] = [];
    years[year].push(entry);
  }

  return (
    <AnimatedSection>
      <div className="space-y-8">
        {/* Program summary header */}
        <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-stone-800">Curriculum Structure</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {semesterEntries.length} Semesters &middot; {totalSubjects} Total Subjects
            </p>
          </div>
        </div>

        {Object.entries(years).map(([yearNum, semesters]) => (
          <div key={yearNum} className="space-y-4">
            {/* Year Heading */}
            <div className="flex items-center gap-3 px-1">
              <h3 className="font-heading font-bold text-stone-800 text-lg">
                {['First', 'Second', 'Third', 'Fourth'][Number(yearNum) - 1]} Year
              </h3>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            {/* Semesters */}
            <div className="space-y-2">
              {semesters.map(({ semester, subjects }) => (
                <SemesterItem
                  key={semester}
                  semester={semester}
                  subjects={subjects}
                  isOpen={openSemester === semester}
                  onToggle={() => setOpenSemester(openSemester === semester ? null : semester)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default SyllabusAccordian;