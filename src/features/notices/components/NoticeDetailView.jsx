import React from 'react';
import { Download, Printer, User, Calendar, BookOpen } from 'lucide-react';

export default function NoticeDetailView({ notice }) {
  if (!notice) return <div className="text-center py-20 text-brand-dark/40">Select a notice to view details</div>;

  return (
    <div className="bg-brand-white p-8 rounded-2xl shadow-sm border border-brand-gray/20">
      {/* Header Actions */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="flex gap-2">
            {notice.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold uppercase bg-brand-primary/10 text-brand-primary px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-dark">{notice.title}</h2>
          <div className="flex gap-6 text-xs text-brand-dark/60">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {notice.publishedDate}</span>
            <span className="flex items-center gap-1.5"><User size={14} /> {notice.author}</span>
            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {notice.audience}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-brand-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-primary/90 transition">
            <Download size={14} /> Download
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-brand-gray/10 text-brand-dark text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-gray/20 transition">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      <hr className="border-brand-gray/20 mb-6" />

      {/* Content Area */}
      <div className="prose prose-sm max-w-none text-brand-dark/80 leading-relaxed">
        <p>{notice.description}</p>
        
        {/* Document Attachment Box */}
        <div className="mt-8 p-4 bg-brand-gray/5 rounded-xl border border-brand-gray/20 flex items-center gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-brand-gray/20">
            <span className="text-xs font-bold text-red-500">PDF</span>
          </div>
          <div>
            <p className="text-sm font-bold text-brand-dark">Official Notice Document</p>
            <p className="text-xs text-brand-dark/50">Everest Campus — {notice.publishedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}