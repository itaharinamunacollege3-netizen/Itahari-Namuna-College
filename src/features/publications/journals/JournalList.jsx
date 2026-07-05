import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  getFeaturedJournal,
  getJournalFields,
  getJournalLink,
  getJournals,
  getPopularJournals,
} from './journalsService';

import Journal from '../../../assets/banner images/journal.jpg';
function FieldBadge({ field, small = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-body font-semibold rounded-full bg-gradient-to-r from-brand-primary/10 to-brand-blue/10 text-brand-primary border border-brand-primary/20 ${small ? 'text-[10px] px-2.5 py-1' : 'text-xs px-3 py-1.5'}`}
    >
      <FlaskConical size={small ? 9 : 10} />
      {field}
    </span>
  );
}

function CoverPanel({ entry, className = 'min-h-64 md:min-h-72' }) {
  if (entry.coverImage) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={entry.coverImage}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${entry.accentColor} 0%, #20242b 100%)` }}
    >
      <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <BookOpen size={120} className="text-white/5" strokeWidth={1} />
      </span>
    </div>
  );
}

export default function JournalList() {
  const [entries, setEntries] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [popularEntries, setPopularEntries] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [allEntries, featuredEntry, popular, researchFields] = await Promise.all([
          getJournals(),
          getFeaturedJournal(),
          getPopularJournals(4),
          getJournalFields(),
        ]);

        if (!active) return;
        setEntries(allEntries);
        setFeatured(featuredEntry);
        setPopularEntries(popular);
        setFields(researchFields);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load journal papers.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const rest = useMemo(() => {
    if (!featured) return entries;
    return entries.filter((entry) => entry.id !== featured.id);
  }, [entries, featured]);

  return (
    <div className="min-h-screen bg-brand-gray/30">
      <div
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[60vh] flex items-end"
        style={{ backgroundImage: 'url(' + Journal + ')' }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#075F6C]/40 via-[#054a55]/0 to-[#075F6C]/40 z-10" />
        <div
          className="absolute inset-0 opacity-5 z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-20 space-y-4 pb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gold hover:text-brand-gold/80 transition-colors font-body"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Home
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-brand-white">
              Publications
            </span>
            <span className="text-brand-white/40 text-xs">/</span>
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-brand-white">
              Journal
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight">
            Academic Research & Scholarship
          </h1>
          <p className="font-heading italic text-brand-white text-base sm:text-lg max-w-xl">
            "Peer-reviewed work advancing knowledge across disciplines."
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white font-body">
              {entries.length} Papers
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-medium text-white font-body">
              Faculty & Student Research
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-16 space-y-16">
        {loading ? (
          <div className="rounded-2xl border border-brand-gray/60 bg-brand-white p-10 text-center font-body text-brand-dark/60">
            Loading journal papers…
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-brand-crimson/20 bg-brand-crimson/5 p-8 text-center font-body text-brand-crimson">
            {error}
          </div>
        ) : null}

        {!loading && featured ? (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-body font-extrabold tracking-widest uppercase text-brand-primary mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-primary inline-block" />
              Editor's Pick
            </p>
            <Link
              to={getJournalLink(featured)}
              className="group relative flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-brand-gray/60 bg-brand-white transition-all duration-300"
            >
              <div className="relative md:w-1/2">
                <CoverPanel entry={featured} />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-xs font-semibold font-body px-3 py-1.5 rounded-full">
                    {featured.field}
                  </span>
                  <p className="text-white/70 text-[11px] font-body mt-2">
                    {featured.volume} · {featured.year}
                  </p>
                </div>
              </div>

              <div className="flex-1 p-8 md:p-10 flex flex-col justify-center gap-5">
                <FieldBadge field={featured.field} />
                <h2 className="font-heading text-2xl md:text-4xl font-extrabold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-300">
                  {featured.title}
                </h2>
                <p className="font-body text-sm sm:text-base text-brand-dark/60 leading-relaxed line-clamp-3">
                  {featured.abstract}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-dark/40 font-body">
                  <Users size={13} />
                  <span>{featured.authors?.join(', ')}</span>
                </div>
                <span className="mt-3 inline-flex items-center gap-3 text-base font-semibold font-body text-brand-primary group-hover:gap-4 transition-all duration-300">
                  Read Paper <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </motion.section>
        ) : null}

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-body font-extrabold tracking-widest uppercase text-brand-primary mb-8 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-primary inline-block" />
              Recent Issues
            </p>

            {!loading && rest.length === 0 ? (
              <div className="rounded-xl border border-brand-gray/60 bg-brand-white p-10 text-center font-body text-brand-dark/60">
                No journal papers published yet.
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              {rest.map((entry, index) => (
                <motion.article
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-brand-white rounded-2xl overflow-hidden shadow-sm border border-brand-gray/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <CoverPanel entry={entry} className="h-48" />
                    <div className="absolute bottom-4 left-4">
                      <span
                        className="bg-white/90 backdrop-blur-sm text-[10px] font-semibold font-body px-2.5 py-1 rounded-full"
                        style={{ color: entry.accentColor }}
                      >
                        {entry.field}
                      </span>
                    </div>
                    <span className="absolute bottom-4 right-4 text-[11px] font-body text-white/70">
                      {entry.volume}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-3">
                    <div className="text-[11px] text-brand-dark/40 font-body">{entry.year}</div>
                    <h3 className="font-heading text-lg font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-300 line-clamp-2">
                      {entry.title}
                    </h3>
                    <p className="font-body text-sm text-brand-dark/60 leading-relaxed line-clamp-2">
                      {entry.abstract}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] font-body text-brand-dark/40 flex items-center gap-1.5 truncate max-w-[160px]">
                        <Users size={11} className="shrink-0" />
                        <span className="truncate">
                          {entry.authors?.[0]}
                          {entry.authors?.length > 1 ? ` +${entry.authors.length - 1}` : ''}
                        </span>
                      </span>
                      <Link
                        to={getJournalLink(entry)}
                        className="inline-flex items-center gap-2 text-sm font-semibold font-body text-brand-primary hover:gap-3 transition-all duration-300 shrink-0"
                      >
                        Read <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <aside className="lg:w-80 shrink-0 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-brand-white rounded-2xl border border-brand-gray/60 overflow-hidden shadow-sm"
            >
              <div className="px-6 py-5 border-b border-brand-gray/50 flex items-center gap-2 bg-gradient-to-r from-brand-primary/5 to-brand-blue/5">
                <TrendingUp size={16} className="text-brand-primary" />
                <h2 className="font-heading text-base font-bold text-brand-dark">Most Cited</h2>
              </div>
              <ol className="divide-y divide-brand-gray/40">
                {popularEntries.map((entry, index) => (
                  <li key={entry.id}>
                    <Link
                      to={getJournalLink(entry)}
                      className="flex items-start gap-4 px-6 py-5 group hover:bg-brand-gray/30 transition-colors duration-300"
                    >
                      <span className="font-heading text-xl font-black text-brand-gray shrink-0 leading-none mt-0.5 w-8">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-300 leading-snug line-clamp-2">
                          {entry.title}
                        </p>
                        <p className="text-[11px] text-brand-dark/40 mt-1.5 font-body">{entry.volume}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-brand-white rounded-2xl border border-brand-gray/60 overflow-hidden shadow-sm"
            >
              <div className="px-6 py-5 border-b border-brand-gray/50">
                <h2 className="font-heading text-base font-bold text-brand-dark">Research Fields</h2>
              </div>
              <div className="p-5 flex flex-wrap gap-2.5">
                {fields.map((field) => (
                  <FieldBadge key={field} field={field} small />
                ))}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
