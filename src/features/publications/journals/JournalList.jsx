import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, FlaskConical, TrendingUp, Users } from 'lucide-react';
import {
  getFeaturedJournal,
  getJournalFields,
  getJournalLink,
  getJournals,
  getPopularJournals,
} from './journalsService';

function FieldBadge({ field, small = false }) {
  const c = fieldColors[field] ?? { bg: 'bg-brand-gray', text: 'text-brand-dark/60' };
  return (
    <span
      className={`inline-flex items-center gap-1 font-body font-semibold rounded-full ${c.bg} ${c.text} ${small ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
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
        <img src={entry.coverImage} alt="" className="h-full w-full object-cover" />
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
        setFields(researchFields.length ? researchFields : Object.keys(fieldColors));
      } catch (err) {
        if (active) setError(err.message || 'Failed to load journal entries.');
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
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[260px] flex items-end"
        style={{ backgroundImage: 'linear-gradient(135deg, #20242b 0%, #045d30 100%)' }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/90 via-[#00522b]/85 to-transparent z-10" />
        <div
          className="absolute inset-0 opacity-5 z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-20 space-y-3 pb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors font-body"
          >
            ← Home
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-emerald-300/70">
              Publications
            </span>
            <span className="text-emerald-300/40 text-xs">/</span>
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-emerald-200">
              Journal
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-white leading-tight">
            Academic Research &amp; Scholarship
          </h1>
          <p className="font-heading italic text-emerald-100/80 text-base sm:text-lg max-w-xl">
            &ldquo;Peer-reviewed work advancing knowledge across disciplines.&rdquo;
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              {entries.length} Papers
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              Faculty &amp; Student Research
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-14">
        {loading ? (
          <div className="rounded-2xl border border-brand-gray/60 bg-brand-white p-10 text-center font-body text-brand-dark/60">
            Loading journal papers…
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-brand-crimson/20 bg-brand-crimson/5 p-6 text-center font-body text-brand-crimson">
            {error}
          </div>
        ) : null}

        {!loading && featured ? (
          <section>
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-brand-primary mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-primary inline-block" />
              Editor&apos;s Pick
            </p>
            <Link
              to={getJournalLink(featured)}
              className="group relative flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-brand-gray/60 bg-brand-white transition-all duration-300"
            >
              <div className="relative md:w-1/2">
                <CoverPanel entry={featured} />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-xs font-semibold font-body px-3 py-1 rounded-full">
                    {featured.field}
                  </span>
                  <p className="text-white/70 text-[11px] font-body mt-2">
                    {featured.volume} · {featured.year}
                  </p>
                </div>
              </div>

              <div className="flex-1 p-7 md:p-10 flex flex-col justify-center gap-4">
                <FieldBadge field={featured.field} />
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-200">
                  {featured.title}
                </h2>
                <p className="font-body text-sm text-brand-dark/60 leading-relaxed line-clamp-3">
                  {featured.abstract}
                </p>
                <div className="flex items-center gap-2 text-xs text-brand-dark/40 font-body">
                  <Users size={11} />
                  <span>{featured.authors?.join(', ')}</span>
                </div>
                <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold font-body text-brand-primary group-hover:gap-3 transition-all duration-200">
                  Read Paper <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </section>
        ) : null}

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-brand-primary mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-primary inline-block" />
              Recent Issues
            </p>

            {!loading && rest.length === 0 ? (
              <div className="rounded-xl border border-brand-gray/60 bg-brand-white p-8 text-center font-body text-brand-dark/60">
                No journal papers published yet.
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rest.map((entry, index) => (
                <article
                  key={entry.id}
                  className="group bg-brand-white rounded-xl overflow-hidden shadow-sm border border-brand-gray/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{
                    animation: 'fadeInUp 0.45s ease both',
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <div className="relative h-40 overflow-hidden">
                    <CoverPanel entry={entry} className="h-40" />
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="bg-white/90 backdrop-blur-sm text-[10px] font-semibold font-body px-2.5 py-0.5 rounded-full"
                        style={{ color: entry.accentColor }}
                      >
                        {entry.field}
                      </span>
                    </div>
                    <span className="absolute bottom-3 right-3 text-[10px] font-body text-white/60">
                      {entry.volume}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col gap-2.5">
                    <div className="text-[11px] text-brand-dark/40 font-body">{entry.year}</div>
                    <h3 className="font-heading text-[15px] font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
                      {entry.title}
                    </h3>
                    <p className="font-body text-sm text-brand-dark/55 leading-relaxed line-clamp-2">
                      {entry.abstract}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-body text-brand-dark/40 flex items-center gap-1 truncate max-w-[160px]">
                        <Users size={10} className="shrink-0" />
                        <span className="truncate">
                          {entry.authors?.[0]}
                          {entry.authors?.length > 1 ? ` +${entry.authors.length - 1}` : ''}
                        </span>
                      </span>
                      <Link
                        to={getJournalLink(entry)}
                        className="inline-flex items-center gap-1 text-xs font-semibold font-body text-brand-primary hover:gap-2 transition-all duration-200 shrink-0"
                      >
                        Read <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="lg:w-72 shrink-0 space-y-6">
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50 flex items-center gap-2">
                <TrendingUp size={15} className="text-brand-primary" />
                <h2 className="font-heading text-sm font-bold text-brand-dark">Most Cited</h2>
              </div>
              <ol className="divide-y divide-brand-gray/40">
                {popularEntries.map((entry, index) => (
                  <li key={entry.id}>
                    <Link
                      to={getJournalLink(entry)}
                      className="flex items-start gap-3 px-5 py-4 group hover:bg-brand-gray/30 transition-colors duration-150"
                    >
                      <span className="font-heading text-xl font-black text-brand-gray shrink-0 leading-none mt-0.5 w-6">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {entry.title}
                        </p>
                        <p className="text-[10px] text-brand-dark/35 mt-1 font-body">{entry.volume}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50">
                <h2 className="font-heading text-sm font-bold text-brand-dark">Research Fields</h2>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {fields.map((field) => (
                  <FieldBadge key={field} field={field} />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
