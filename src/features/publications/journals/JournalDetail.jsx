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
import { motion } from 'framer-motion';
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          <p className="font-body text-brand-dark/60">Loading paper…</p>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-brand-gray/30 flex flex-col items-center justify-center gap-4 px-6">
        <p className="font-body text-brand-crimson">{error || 'Journal paper not found.'}</p>
        <Link
          to="/publications/journal"
          className="font-body text-brand-primary hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Journal
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
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[400px] flex items-end"
        style={bannerStyle}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/50 via-[#00522b]/15 to-[#006a38]/50 z-10" />
        <div
          className="absolute inset-0 opacity-5 z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {entry.coverImage && (
          <div className="absolute inset-0 bg-black/20 z-10" />
        )}

        <div className="max-w-7xl mx-auto relative z-20 space-y-4 pb-2 w-full">
          <Link
            to="/publications/journal"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors font-body"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Journal
          </Link>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white">
              <FlaskConical size={10} /> {entry.field}
            </span>
            <span className="text-xs text-white/60 font-body">
              {entry.volume} · {entry.year}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight max-w-4xl">
            {entry.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="font-heading font-black text-white">
                  {entry.authors?.[0]
                    ?.split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-heading font-semibold text-white">
                  {entry.authors?.join(', ')}
                </p>
                {entry.authorAffiliation && (
                  <p className="text-xs text-white/70">{entry.authorAffiliation}</p>
                )}
              </div>
            </div>
            <span className="text-white/50">·</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-white/80 font-body">
              <Calendar size={14} /> {entry.date}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <article className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-12 rounded-2xl bg-gradient-to-r from-brand-primary/8 to-brand-blue/8 border-l-4 border-brand-primary p-7">
                <p className="text-xs font-body font-extrabold uppercase tracking-widest text-brand-primary mb-3">
                  Abstract
                </p>
                <p className="font-body text-base sm:text-lg text-brand-dark/80 leading-relaxed italic">
                  {entry.abstract}
                </p>
              </div>
            </motion.div>

            {entry.doi ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-2 text-xs font-body text-brand-dark/40 mb-12"
              >
                <ExternalLink size={13} />
                <span>DOI:</span>
                <span className="text-brand-primary font-medium">{entry.doi}</span>
                <button
                  type="button"
                  className="ml-auto p-2.5 rounded-xl hover:bg-brand-gray transition-all hover:scale-105"
                  aria-label="Share"
                >
                  <Share2
                    size={16} className="text-brand-dark/30 hover:text-brand-primary transition-colors"
                  />
                </button>
              </motion.div>
            ) : null}

            <div className="space-y-16">
              {entry.sections?.map((section, index) => (
              <motion.section
                key={index}
                id={`section-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-dark mb-5 leading-snug">
                  {section.heading}
                </h2>
                <p className="font-body text-base sm:text-[17px] text-brand-dark/80 leading-relaxed mb-6">
                  {section.body}
                </p>
                {section.bullets?.length ? (
                  <ul className="space-y-3 mt-6 mb-6">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex items-start gap-4 font-body text-base text-brand-dark/75 leading-relaxed"
                      >
                        <div className="mt-2 w-2.5 h-2.5 rounded-full bg-linear-to-br from-brand-primary to-brand-blue shrink-0 shadow-sm" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.imageUrl ? (
                  <div className="mt-6 mb-6 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 max-w-3xl mx-auto">
                    <img
                      src={section.imageUrl}
                      alt={section.heading}
                      className="w-full h-auto max-h-[320px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                ) : null}
              </motion.section>
            ))}
            </div>

            {entry.callout ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-16 rounded-2xl bg-linear-to-br from-brand-dark/95 to-brand-dark p-8 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 w-20 bg-brand-primary/10 rounded-full blur-3xl" />
                <Quote
                  size={56}
                  className="absolute top-4 right-4 text-white/5"
                />
                <p className="text-xs font-body font-extrabold uppercase tracking-widest text-brand-gold mb-3">
                  {entry.callout.label}
                </p>
                <p className="font-heading text-base sm:text-lg font-semibold text-white leading-relaxed">
                  {entry.callout.body}
                </p>
              </motion.div>
            ) : null}

            {entry.keywords?.length ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-14 pt-8 border-t border-brand-gray/60"
              >
                <p className="text-xs font-body font-bold text-brand-dark/40 uppercase tracking-widest mb-4">
                  Keywords
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {entry.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="text-sm font-body font-medium px-4 py-2 rounded-full bg-linear-to-r from-brand-gray to-brand-gray/80 text-brand-dark/70 hover:text-brand-primary hover:from-brand-primary/10 hover:to-brand-blue/10 transition-all duration-300 cursor-default"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {entry.citeSuggestion ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-10 rounded-2xl border border-brand-gray/60 bg-linear-to-br from-brand-white to-brand-gray/30 p-7 shadow-sm"
              >
                <p className="text-xs font-body font-bold uppercase tracking-widest text-brand-dark/40 mb-3">
                  Cite This Paper
                </p>
                <p className="font-body text-xs sm:text-sm text-brand-dark/70 leading-relaxed bg-linear-to-br from-brand-gray/50 to-brand-gray/40 rounded-xl px-5 py-4 select-all">
                  {entry.citeSuggestion}
                </p>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-10 flex items-center gap-6 bg-linear-to-br from-brand-white to-brand-gray/30 rounded-2xl border border-brand-gray/60 p-6 sm:p-8 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-blue shrink-0 flex items-center justify-center shadow-lg">
                <span className="font-heading font-black text-white text-xl">
                  {entry.authors?.[0]
                    ?.split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-brand-dark text-lg">
                  {entry.authors?.join(', ')}
                </p>
                {entry.authorAffiliation ? (
                  <p className="font-body text-sm text-brand-dark/60 mt-1">{entry.authorAffiliation}</p>
                ) : null}
                <p className="font-body text-xs text-brand-dark/50 mt-2 flex items-center gap-2">
                  <Calendar size={12} /> {entry.volume} · Published {entry.date}
                </p>
              </div>
            </motion.div>
          </article>

          <aside className="lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-brand-primary to-brand-blue p-7 text-white shadow-lg"
            >
              <BookOpen size={24} className="mb-4 opacity-90" />
              <p className="font-heading text-base font-bold mb-2">Full Paper (PDF)</p>
              <p className="font-body text-sm text-white/80 mb-5 leading-relaxed">
                Download the complete peer-reviewed article with references and appendices.
              </p>
              {entry.pdfUrl ? (
                <a
                  href={entry.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-white text-brand-primary text-sm font-bold font-body px-6 py-3.5 rounded-xl hover:bg-brand-gray/20 hover:text-white transition-all duration-300"
                >
                  <Download size={16} /> Download PDF <ExternalLink size={14} />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-3 bg-white/60 text-brand-primary/60 text-sm font-bold font-body px-6 py-3.5 rounded-xl cursor-not-allowed"
                >
                  <Download size={16} /> PDF not available
                </button>
              )}
            </motion.div>

            {toc.length ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-brand-white rounded-2xl border border-brand-gray/60 overflow-hidden shadow-sm"
              >
                <div className="px-6 py-5 border-b border-brand-gray/50 bg-gradient-to-r from-brand-primary/5 to-brand-blue/5">
                  <p className="font-heading text-xs font-extrabold text-brand-primary uppercase tracking-widest">
                    Contents
                  </p>
                </div>
                <ol className="p-4 space-y-2">
                  {toc.map((heading, index) => (
                    <li key={index}>
                      <a
                        href={`#section-${index}`}
                        className="flex items-start gap-3.5 px-4 py-3 rounded-xl hover:bg-brand-gray/50 group transition-all duration-200"
                      >
                        <span className="font-heading text-sm font-black text-brand-gray/70 shrink-0 mt-0.5">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-body text-sm text-brand-dark/75 group-hover:text-brand-primary transition-colors duration-200 leading-snug">
                          {heading}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-brand-white rounded-2xl border border-brand-gray/60 overflow-hidden shadow-sm"
            >
              <div className="px-6 py-5 border-b border-brand-gray/50">
                <p className="font-heading text-base font-bold text-brand-dark">Related Research</p>
              </div>
              <ul className="divide-y divide-brand-gray/40">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={getJournalLink(item)}
                      className="flex items-start gap-4 px-6 py-5 group hover:bg-brand-gray/30 transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-blue/10 shrink-0 flex items-center justify-center mt-0.5">
                        <FlaskConical size={16} className="text-brand-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-brand-dark/40 mt-1.5 font-body">{item.volume}</p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-brand-dark/20 group-hover:text-brand-primary shrink-0 mt-1 transition-all duration-200"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
