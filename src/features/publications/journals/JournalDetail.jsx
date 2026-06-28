import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Download,
  ExternalLink,
  FlaskConical,
  Quote,
  Share2,
  Users,
} from 'lucide-react';
import { getJournalById, getJournalLink, getRelatedJournals } from './journalsService';

export default function JournalDetail() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [detail, relatedEntries] = await Promise.all([
          getJournalById(id),
          getRelatedJournals(id),
        ]);
        if (!active) return;
        if (!detail) {
          setError('Journal paper not found.');
          setEntry(null);
          setRelated([]);
          return;
        }
        setEntry(detail);
        setRelated(relatedEntries);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load journal paper.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gray/30 flex items-center justify-center">
        <p className="font-body text-brand-dark/60">Loading paper…</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-brand-gray/30 flex flex-col items-center justify-center gap-4 px-6">
        <p className="font-body text-brand-crimson">{error || 'Journal paper not found.'}</p>
        <Link to="/publications/journal" className="font-body text-brand-primary hover:underline">
          ← Back to Journal
        </Link>
      </div>
    );
  }

  const toc = Array.isArray(entry.sections) ? entry.sections.map((section) => section.heading) : [];
  const bannerStyle = entry.coverImage
    ? { backgroundImage: `url(${entry.coverImage})` }
    : { backgroundImage: `linear-gradient(135deg, #20242b 0%, ${entry.accentColor} 100%)` };

  return (
    <div className="min-h-screen bg-brand-gray/30">
      <div
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[300px] flex items-end"
        style={bannerStyle}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/90 via-[#00522b]/85 to-transparent z-10" />
        <div
          className="absolute inset-0 opacity-5 z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-20 space-y-3 pb-2 w-full">
          <Link
            to="/publications/journal"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors font-body"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Journal
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-body font-semibold bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full text-white">
              <FlaskConical size={10} /> {entry.field}
            </span>
            <span className="text-xs text-white/50 font-body">
              {entry.volume} · {entry.date}
            </span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight max-w-3xl">
            {entry.title}
          </h1>

          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              <Users size={11} /> {entry.authors?.join(' · ')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              <Calendar size={11} /> {entry.date}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <article className="flex-1 min-w-0">
            <div className="mb-10 rounded-xl bg-brand-primary/8 border-l-4 border-brand-primary p-6">
              <p className="text-xs font-body font-bold uppercase tracking-widest text-brand-primary mb-2">
                Abstract
              </p>
              <p className="font-body text-[15px] text-brand-dark/80 leading-relaxed italic">
                {entry.abstract}
              </p>
            </div>

            {entry.doi ? (
              <div className="flex items-center gap-2 text-xs font-body text-brand-dark/40 mb-10">
                <ExternalLink size={11} />
                <span>DOI:</span>
                <span className="text-brand-primary font-medium">{entry.doi}</span>
                <button
                  type="button"
                  className="ml-auto p-2 rounded-lg hover:bg-brand-gray transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={13} className="text-brand-dark/30 hover:text-brand-primary transition-colors" />
                </button>
              </div>
            ) : null}

            <div className="space-y-10">
              {entry.sections?.map((section, index) => (
                <section key={index} id={`section-${index}`}>
                  <h2 className="font-heading text-xl font-bold text-brand-dark mb-3 leading-snug">
                    {section.heading}
                  </h2>
                  <p className="font-body text-[15px] text-brand-dark/75 leading-relaxed mb-4">
                    {section.body}
                  </p>
                  {section.bullets?.length ? (
                    <ul className="space-y-2 mt-3">
                      {section.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="flex items-start gap-3 font-body text-sm text-brand-dark/70 leading-relaxed"
                        >
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>

            {entry.callout ? (
              <div className="mt-10 rounded-xl bg-brand-dark/95 p-6 relative overflow-hidden">
                <Quote size={48} className="absolute top-4 right-4 text-white/5" />
                <p className="text-xs font-body font-bold uppercase tracking-widest text-brand-gold mb-3">
                  {entry.callout.label}
                </p>
                <p className="font-heading text-base font-semibold text-white leading-relaxed">
                  {entry.callout.body}
                </p>
              </div>
            ) : null}

            {entry.keywords?.length ? (
              <div className="mt-10 pt-6 border-t border-brand-gray">
                <p className="text-xs font-body font-semibold text-brand-dark/40 uppercase tracking-widest mb-3">
                  Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {entry.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="text-xs font-body font-medium px-3 py-1.5 rounded-full bg-brand-gray text-brand-dark/60"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {entry.citeSuggestion ? (
              <div className="mt-8 rounded-xl border border-brand-gray/60 bg-brand-white p-5">
                <p className="text-xs font-body font-bold uppercase tracking-widest text-brand-dark/40 mb-2">
                  Cite This Paper
                </p>
                <p className="font-body text-xs text-brand-dark/70 leading-relaxed bg-brand-gray/50 rounded-lg px-4 py-3 select-all">
                  {entry.citeSuggestion}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex items-center gap-5 bg-brand-white rounded-xl border border-brand-gray/60 p-5">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-brand-primary to-brand-blue shrink-0 flex items-center justify-center">
                <span className="font-heading font-black text-white text-lg">
                  {entry.authors?.[0]
                    ?.split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-heading font-bold text-brand-dark text-sm">
                  {entry.authors?.join(', ')}
                </p>
                {entry.authorAffiliation ? (
                  <p className="font-body text-xs text-brand-dark/50 mt-0.5">{entry.authorAffiliation}</p>
                ) : null}
                <p className="font-body text-xs text-brand-dark/35 mt-1">
                  {entry.volume} · Published {entry.date}
                </p>
              </div>
            </div>
          </article>

          <aside className="lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24">
            <div className="rounded-xl overflow-hidden bg-linear-to-br from-brand-primary to-brand-blue p-5 text-white">
              <BookOpen size={20} className="mb-3 opacity-80" />
              <p className="font-heading text-sm font-bold mb-1">Full Paper (PDF)</p>
              <p className="font-body text-xs text-white/70 mb-4 leading-relaxed">
                Download the complete peer-reviewed article with references and appendices.
              </p>
              {entry.pdfUrl ? (
                <a
                  href={entry.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-white text-brand-primary text-xs font-bold font-body px-4 py-2.5 rounded-lg hover:bg-brand-gray transition-colors duration-200"
                >
                  <Download size={13} /> Download PDF
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-2 bg-white/60 text-brand-primary/60 text-xs font-bold font-body px-4 py-2.5 rounded-lg cursor-not-allowed"
                >
                  <Download size={13} /> PDF not available
                </button>
              )}
            </div>

            {toc.length ? (
              <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-brand-gray/50 bg-brand-primary/5">
                  <p className="font-heading text-xs font-bold text-brand-primary uppercase tracking-widest">
                    Contents
                  </p>
                </div>
                <ol className="p-3 space-y-1">
                  {toc.map((heading, index) => (
                    <li key={index}>
                      <a
                        href={`#section-${index}`}
                        className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-brand-gray/50 group transition-colors duration-150"
                      >
                        <span className="font-heading text-xs font-black text-brand-gray/60 shrink-0 mt-0.5">
                          {index + 1}.
                        </span>
                        <span className="font-body text-xs text-brand-dark/70 group-hover:text-brand-primary transition-colors duration-150 leading-snug">
                          {heading}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50">
                <p className="font-heading text-sm font-bold text-brand-dark">Related Research</p>
              </div>
              <ul className="divide-y divide-brand-gray/40">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={getJournalLink(item)}
                      className="flex items-start gap-3 px-5 py-4 group hover:bg-brand-gray/30 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 shrink-0 flex items-center justify-center mt-0.5">
                        <FlaskConical size={13} className="text-brand-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-brand-dark/35 mt-1 font-body">{item.volume}</p>
                      </div>
                      <ChevronRight
                        size={12}
                        className="text-brand-dark/20 group-hover:text-brand-primary shrink-0 mt-1 transition-colors"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
