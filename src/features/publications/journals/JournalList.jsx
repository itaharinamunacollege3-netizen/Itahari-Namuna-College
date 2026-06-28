import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, TrendingUp, FlaskConical } from 'lucide-react';

const journalEntries = [
  {
    id: 1,
    title: 'Socioeconomic Barriers to STEM Access in Rural Nepal',
    abstract: 'This study examines the structural and cultural factors limiting STEM participation among rural youth in the Koshi Province, drawing on survey data from 12 secondary schools.',
    field: 'Social Sciences',
    authors: ['Dr. Kamala Adhikari', 'Prof. Sunil Bhattarai'],
    volume: 'Vol. 4, Issue 2',
    year: '2025',
    coverGradient: 'from-[#045d30]/90 via-[#045d30]/80 to-transparent',
    accentColor: '#045d30',
  },
  {
    id: 2,
    title: 'Microfinance and Women Entrepreneurship: A Longitudinal Analysis',
    abstract: 'Tracking 200 female entrepreneurs over three years, this paper evaluates the long-term impact of microfinance access on household income and business growth in eastern Nepal.',
    field: 'Economics',
    authors: ['Dr. Nirmala Chaudhary'],
    volume: 'Vol. 4, Issue 1',
    year: '2025',
    coverGradient: 'from-[#c22368]/80 via-[#f2b843]/70 to-transparent',
    accentColor: '#c22368',
  },
  {
    id: 3,
    title: 'Machine Learning Applications in Agricultural Yield Prediction',
    abstract: 'A comparative review of supervised learning models applied to crop yield datasets from the Terai region, with implications for precision agriculture policy.',
    field: 'Computer Science',
    authors: ['Roshan Tamang', 'Anisha Gurung', 'Dr. Binod Khatri'],
    volume: 'Vol. 3, Issue 4',
    year: '2024',
    coverGradient: 'from-[#f2b843]/90 via-[#e17622]/80 to-transparent',
    accentColor: '#e17622',
  },
  {
    id: 4,
    title: 'Post-Earthquake Urban Resilience: Lessons from 2015',
    abstract: 'A decade on from the Gorkha earthquake, this paper evaluates reconstruction policy effectiveness and identifies gaps in urban resilience planning for Nepali municipalities.',
    field: 'Urban Studies',
    authors: ['Dr. Pradeep Koirala', 'Manisha Shrestha'],
    volume: 'Vol. 3, Issue 3',
    year: '2024',
    coverGradient: 'from-[#3db2e1]/90 via-[#045d30]/70 to-transparent',
    accentColor: '#3db2e1',
  },
  {
    id: 5,
    title: 'Digital Literacy Among Secondary School Teachers in Province 1',
    abstract: 'An assessment of ICT integration readiness among 350 secondary school educators, identifying training needs and barriers to effective digital classroom adoption.',
    field: 'Education',
    authors: ['Sushma Rai', 'Dr. Krishna Poudel'],
    volume: 'Vol. 3, Issue 2',
    year: '2024',
    coverGradient: 'from-[#045d30]/80 via-[#3db2e1]/70 to-transparent',
    accentColor: '#045d30',
  },
  {
    id: 6,
    title: 'Water Quality Assessment in Periurban Areas of Sunsari District',
    abstract: 'Field testing of groundwater and piped supply sources reveals significant contamination patterns, with policy recommendations for the district water authority.',
    field: 'Environmental Science',
    authors: ['Dr. Anil Shrestha', 'Puja Limbu'],
    volume: 'Vol. 3, Issue 1',
    year: '2024',
    coverGradient: 'from-[#045d30]/70 via-[#f2b843]/60 to-transparent',
    accentColor: '#045d30',
  },
];

const featured = journalEntries[0];
const rest = journalEntries.slice(1);

const popularEntries = [
  journalEntries[0],
  journalEntries[2],
  journalEntries[1],
  journalEntries[3],
];

const fieldColors = {
  'Social Sciences':      { bg: 'bg-brand-blue/10',    text: 'text-brand-blue' },
  'Economics':            { bg: 'bg-brand-gold/15',    text: 'text-brand-orange' },
  'Computer Science':     { bg: 'bg-brand-primary/10', text: 'text-brand-primary' },
  'Urban Studies':        { bg: 'bg-brand-crimson/10', text: 'text-brand-crimson' },
  'Education':            { bg: 'bg-brand-primary/10', text: 'text-brand-primary' },
  'Environmental Science':{ bg: 'bg-brand-blue/10',    text: 'text-brand-blue' },
};

function FieldBadge({ field, small = false }) {
  const c = fieldColors[field] ?? { bg: 'bg-brand-gray', text: 'text-brand-dark/60' };
  return (
    <span className={`inline-flex items-center gap-1 font-body font-semibold rounded-full ${c.bg} ${c.text} ${small ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
      <FlaskConical size={small ? 9 : 10} />
      {field}
    </span>
  );
}

export default function JournalList() {
  return (
    <div className="min-h-screen bg-brand-gray/30">

      {/* ── PAGE BANNER ── */}
      <div
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[260px] flex items-end"
        style={{ backgroundImage: `linear-gradient(135deg, #20242b 0%, #045d30 100%)` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/90 via-[#00522b]/85 to-transparent z-10" />
        <div className="absolute inset-0 opacity-5 z-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto relative z-20 space-y-3 pb-2">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors font-body">
            ← Home
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-emerald-300/70">Publications</span>
            <span className="text-emerald-300/40 text-xs">/</span>
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-emerald-200">Journal</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-white leading-tight">
            Academic Research &amp; Scholarship
          </h1>
          <p className="font-heading italic text-emerald-100/80 text-base sm:text-lg max-w-xl">
            "Peer-reviewed work advancing knowledge across disciplines."
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              {journalEntries.length} Papers
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              Faculty &amp; Student Research
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-14">

        {/* ── FEATURED PAPER ── */}
        <section>
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-brand-primary mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-brand-primary inline-block" />
            Editor's Pick
          </p>
          <Link
            to={`/publications/journal/${featured.id}`}
            className="group relative flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-brand-gray/60 bg-brand-white transition-all duration-300"
          >
            {/* Image / gradient panel */}
            <div className={`relative md:w-1/2 min-h-64 md:min-h-72 bg-gradient-to-br ${featured.coverGradient} bg-brand-primary/80 overflow-hidden`}>
              <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <BookOpen size={120} className="text-white/5" strokeWidth={1} />
              </span>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-xs font-semibold font-body px-3 py-1 rounded-full">
                  {featured.field}
                </span>
                <p className="text-white/70 text-[11px] font-body mt-2">{featured.volume} · {featured.year}</p>
              </div>
            </div>

            {/* Text panel */}
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
                <span>{featured.authors.join(', ')}</span>
              </div>
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold font-body text-brand-primary group-hover:gap-3 transition-all duration-200">
                Read Paper <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </section>

        {/* ── GRID + SIDEBAR ── */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left: grid */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-brand-primary mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-primary inline-block" />
              Recent Issues
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rest.map((entry, index) => (
                <article
                  key={entry.id}
                  className="group bg-brand-white rounded-xl overflow-hidden shadow-sm border border-brand-gray/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{ animation: `fadeInUp 0.45s ease both`, animationDelay: `${index * 70}ms` }}
                >
                  <div className={`relative h-40 bg-gradient-to-br ${entry.coverGradient} bg-brand-primary/70 overflow-hidden`}>
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                      <BookOpen size={72} className="text-white/5" strokeWidth={1} />
                    </span>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-[10px] font-semibold font-body px-2.5 py-0.5 rounded-full" style={{ color: entry.accentColor }}>
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
                        <span className="truncate">{entry.authors[0]}{entry.authors.length > 1 ? ` +${entry.authors.length - 1}` : ''}</span>
                      </span>
                      <Link
                        to={`/publications/journal/${entry.id}`}
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

          {/* Right: sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-6">

            {/* Most Cited */}
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50 flex items-center gap-2">
                <TrendingUp size={15} className="text-brand-primary" />
                <h2 className="font-heading text-sm font-bold text-brand-dark">Most Cited</h2>
              </div>
              <ol className="divide-y divide-brand-gray/40">
                {popularEntries.map((entry, index) => (
                  <li key={entry.id}>
                    <Link
                      to={`/publications/journal/${entry.id}`}
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

            {/* Fields */}
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50">
                <h2 className="font-heading text-sm font-bold text-brand-dark">Research Fields</h2>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {Object.keys(fieldColors).map((f) => (
                  <FieldBadge key={f} field={f} />
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