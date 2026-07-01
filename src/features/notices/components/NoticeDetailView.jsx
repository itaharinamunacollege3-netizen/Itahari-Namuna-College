import { Download, User, Calendar, BookOpen } from 'lucide-react';

export default function NoticeDetailView({ notice }) {
  if (!notice) return <div className="text-center py-20 text-brand-dark/40">Select a notice to view details</div>;

  const pdfUrl = notice.pdfUrl && notice.pdfUrl !== '#' ? notice.pdfUrl : '';

  return (
    <div className="bg-brand-white p-5 sm:p-8 rounded-2xl shadow-sm border border-brand-gray/20">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap gap-2">
            {notice.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase bg-brand-primary/10 text-brand-primary px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-brand-dark break-words">{notice.title}</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-brand-dark/60">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {notice.publishedDate}</span>
            <span className="flex items-center gap-1.5"><User size={14} /> {notice.author}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {notice.audience}</span>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition"
            >
              <Download size={14} /> Download
            </a>
          )}
        </div>
      </div>

      <hr className="border-brand-gray/20 mb-6" />

      {/* Content Area */}
      <div className="prose prose-sm max-w-none text-brand-dark/80 leading-relaxed">
        {notice.image && (
          <img
            src={notice.image}
            alt={notice.title}
            className="w-full max-h-[32rem] object-contain bg-brand-gray/5 rounded-xl mb-6 border border-brand-gray/20"
          />
        )}
        <p>{notice.description}</p>
        
        {/* Document Attachment Box */}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="mt-8 p-4 bg-brand-gray/5 rounded-xl border border-brand-gray/20 flex items-center gap-4 hover:bg-brand-gray/10 transition no-underline"
          >
            <div className="bg-white p-3 rounded-lg shadow-sm border border-brand-gray/20">
              <span className="text-xs font-bold text-red-500">PDF</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-brand-dark">Official Notice Document</p>
              <p className="text-xs text-brand-dark/50">Everest Campus — {notice.publishedDate}</p>
            </div>
            <Download size={18} className="text-brand-primary" />
          </a>
        )}
      </div>
    </div>
  );
}