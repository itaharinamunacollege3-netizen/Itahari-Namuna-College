import { useState } from 'react';
import { ChevronDown, BookOpen, FileText, ExternalLink, Download } from 'lucide-react';
import AnimatedSection from '../../../components/animations/AnimatedSection';

const SyllabusAccordian = ({ curriculum }) => {
  const semesterEntries = Object.entries(curriculum ?? {})
    .map(([semester, value]) => {
      if (Array.isArray(value)) {
        return {
          semester,
          subjects: value,
          syllabusPdf: '',
        };
      }

      return {
        semester,
        subjects: Array.isArray(value?.subjects) ? value.subjects : [],
        syllabusPdf: typeof value?.syllabusPdf === 'string' ? value.syllabusPdf : '',
      };
    })
    .sort((a, b) => Number(a.semester) - Number(b.semester));

  const [openYear, setOpenYear] = useState(semesterEntries[0]?.semester ?? null);
  const [downloadingSemester, setDownloadingSemester] = useState(null);

  const openSyllabusPdf = (pdfUrl) => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const getDownloadFilename = (pdfUrl, semester) => {
    try {
      const url = new URL(pdfUrl, window.location.origin);
      const lastSegment = url.pathname.split('/').filter(Boolean).pop();
      if (lastSegment?.toLowerCase().endsWith('.pdf')) return lastSegment;
    } catch {
      // ignore malformed URL and use fallback
    }
    return `semester-${semester}-syllabus.pdf`;
  };

  const downloadSyllabusPdf = async (pdfUrl, semester) => {
    if (!pdfUrl) return;

    try {
      setDownloadingSemester(semester);
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('Failed to fetch PDF');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = getDownloadFilename(pdfUrl, semester);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback for cross-origin restrictions.
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloadingSemester(null);
    }
  };

  return (
    <AnimatedSection>
      <div className="space-y-4">
        {semesterEntries.map(({ semester, subjects, syllabusPdf }) => {
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

              <div
                className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 border-t border-stone-100">
                    <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-xs sm:text-sm text-stone-500 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#006A38]" />
                        Semester {semester} Syllabus
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openSyllabusPdf(syllabusPdf)}
                          disabled={!syllabusPdf}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#006A38] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#00522b] disabled:cursor-not-allowed disabled:bg-stone-300"
                        >
                          View PDF
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        {syllabusPdf ? (
                          <button
                            type="button"
                            onClick={() => downloadSyllabusPdf(syllabusPdf, semester)}
                            disabled={downloadingSemester === semester}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#006A38] px-4 py-2 text-xs sm:text-sm font-semibold text-[#006A38] transition-colors hover:bg-emerald-50"
                          >
                            {downloadingSemester === semester ? 'Downloading...' : 'Download'}
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 px-4 py-2 text-xs sm:text-sm font-semibold text-stone-400 cursor-not-allowed"
                          >
                            Download
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {subjects.length > 0 && (
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
                    )}
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