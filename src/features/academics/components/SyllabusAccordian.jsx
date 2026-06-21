import { useState } from 'react';
import { ChevronDown, BookOpen, GraduationCap, Layers, Clock } from 'lucide-react';
import AnimatedSection from '../../../components/animations/AnimatedSection';

/* ------------------------------------------------------------------ */
/*  Year grouping helper                                               */
/* ------------------------------------------------------------------ */
const YEAR_LABELS = {
  1: { label: 'First Year', color: 'emerald' },
  2: { label: 'Second Year', color: 'sky' },
  3: { label: 'Third Year', color: 'amber' },
  4: { label: 'Fourth Year', color: 'rose' },
};

const SEMESTER_ACCENT = {
  1: { bg: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200' },
  2: { bg: 'bg-sky-500', ring: 'ring-sky-200', text: 'text-sky-700', light: 'bg-sky-50', border: 'border-sky-200' },
  3: { bg: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' },
  4: { bg: 'bg-rose-500', ring: 'ring-rose-200', text: 'text-rose-700', light: 'bg-rose-50', border: 'border-rose-200' },
  5: { bg: 'bg-emerald-500', ring: 'ring-emerald-200', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200' },
  6: { bg: 'bg-sky-500', ring: 'ring-sky-200', text: 'text-sky-700', light: 'bg-sky-50', border: 'border-sky-200' },
  7: { bg: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' },
  8: { bg: 'bg-rose-500', ring: 'ring-rose-200', text: 'text-rose-700', light: 'bg-rose-50', border: 'border-rose-200' },
};

function getAccent(sem) {
  return SEMESTER_ACCENT[sem] ?? SEMESTER_ACCENT[1];
}

function getYear(sem) {
  return Math.ceil(Number(sem) / 2);
}

/* ------------------------------------------------------------------ */
/*  Subject card                                                       */
/* ------------------------------------------------------------------ */
function SubjectCard({ subject, index, accent }) {
  return (
    <div className={`group flex items-start gap-3 rounded-xl border ${accent.border} ${accent.light} p-4 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5`}>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${accent.bg} text-[11px] font-bold text-white shadow-xs`}>
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-stone-800 leading-snug">{subject}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Single semester accordion item                                     */
/* ------------------------------------------------------------------ */
function SemesterItem({ semester, subjects, isOpen, onToggle }) {
  const sem = Number(semester);
  const accent = getAccent(sem);
  const subjectCount = subjects.length;

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-stone-200 shadow-md' : 'border-stone-100 shadow-xs hover:border-stone-200 hover:shadow-sm'}`}>
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors duration-200 hover:bg-stone-50/80 cursor-pointer"
      >
        {/* Semester number badge */}
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent.bg} text-white shadow-sm ring-4 ${accent.ring} transition-transform duration-300 ${isOpen ? 'scale-110' : ''}`}>
          <span className="text-lg font-bold">{sem}</span>
        </div>

        {/* Title & meta */}
        <div className="min-w-0 flex-1">
          <h4 className="font-heading font-bold text-stone-800 text-sm sm:text-base">
            Semester {sem}
          </h4>
          <div className="mt-1 flex items-center gap-3 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {subjectCount} {subjectCount === 1 ? 'Subject' : 'Subjects'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              ~{subjectCount * 3} Credit Hrs
            </span>
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-stone-400 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180 text-[#006A38]' : ''}`}
        />
      </button>

      {/* Expandable content */}
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-5 pb-6 pt-2">
            {/* Divider */}
            <div className="mb-4 h-px bg-linear-to-r from-transparent via-stone-200 to-transparent" />

            {/* Subjects grid */}
            {subjectCount > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {subjects.map((subject, i) => (
                  <SubjectCard key={i} subject={subject} index={i} accent={accent} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Layers className="h-8 w-8 text-stone-300" />
                <p className="text-sm text-stone-400">
                  Subjects to be announced
                </p>
              </div>
            )}

            {/* Footer meta */}
            {subjectCount > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-stone-50 p-3 text-xs text-stone-500">
                <span>Total Subjects: <strong className="text-stone-700">{subjectCount}</strong></span>
                <span className={`font-semibold ${accent.text}`}>Semester {sem}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main accordion component                                           */
/* ------------------------------------------------------------------ */
const SyllabusAccordian = ({ curriculum }) => {
  const semesterEntries = Object.entries(curriculum ?? {})
    .map(([semester, value]) => {
      if (Array.isArray(value)) {
        return { semester, subjects: value };
      }
      return {
        semester,
        subjects: Array.isArray(value?.subjects) ? value.subjects : [],
      };
    })
    .sort((a, b) => Number(a.semester) - Number(b.semester));

  const [openSemester, setOpenSemester] = useState(semesterEntries[0]?.semester ?? null);

  // Group by year
  const years = {};
  for (const entry of semesterEntries) {
    const year = getYear(entry.semester);
    if (!years[year]) years[year] = [];
    years[year].push(entry);
  }

  const totalSubjects = semesterEntries.reduce((sum, e) => sum + e.subjects.length, 0);

  return (
    <AnimatedSection>
      <div className="space-y-6">
        {/* Program summary header */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#006A38] text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-stone-800">Curriculum Structure</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {semesterEntries.length} Semesters &middot; {totalSubjects} Total Subjects
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            {Object.entries(YEAR_LABELS).map(([yr, { label, color }]) => {
              const yearNum = Number(yr);
              const hasSemesters = years[yearNum]?.length > 0;
              return (
                <span
                  key={yr}
                  className={`rounded-full px-3 py-1 font-medium border ${
                    hasSemesters
                      ? `${SEMESTER_ACCENT[yearNum * 2 - 1]?.light ?? 'bg-stone-50'} ${SEMESTER_ACCENT[yearNum * 2 - 1]?.border ?? 'border-stone-200'} ${SEMESTER_ACCENT[yearNum * 2 - 1]?.text ?? 'text-stone-600'}`
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        {/* Year-grouped accordion */}
        {Object.entries(years).map(([yearNum, semesters]) => {
          const yearInfo = YEAR_LABELS[yearNum] ?? { label: `Year ${yearNum}`, color: 'stone' };
          return (
            <div key={yearNum} className="space-y-3">
              {/* Year heading */}
              <div className="flex items-center gap-3 px-1">
                <div className={`h-1.5 w-8 rounded-full ${SEMESTER_ACCENT[Number(yearNum) * 2 - 1]?.bg ?? 'bg-stone-400'}`} />
                <h3 className="font-heading font-bold text-sm text-stone-700">
                  {yearInfo.label}
                </h3>
                <div className="h-px flex-1 bg-stone-200" />
                <span className="text-[11px] font-medium text-stone-400">
                  Semesters {semesters.map(s => s.semester).join(' & ')}
                </span>
              </div>

              {/* Semester items */}
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
          );
        })}
      </div>
    </AnimatedSection>
  );
};

export default SyllabusAccordian;
