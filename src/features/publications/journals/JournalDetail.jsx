import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, BookOpen, Download, ExternalLink, FlaskConical, ChevronRight, Share2, Quote } from 'lucide-react';

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const journalEntries = {
  1: {
    title: 'Socioeconomic Barriers to STEM Access in Rural Nepal',
    authors: ['Dr. Kamala Adhikari', 'Prof. Sunil Bhattarai'],
    authorAffiliation: 'Department of Social Sciences, Itahari Namuna College',
    date: 'March 2025',
    volume: 'Vol. 4, Issue 2',
    field: 'Social Sciences',
    doi: '10.XXXXX/inc.journal.2025.04.02.001',
    accentColor: '#045d30',
    coverGradient: 'from-[#045d30]/90 via-[#045d30]/80 to-transparent',
    abstract: 'This study examines the structural and cultural factors limiting STEM participation among rural youth in the Koshi Province, drawing on survey data from 12 secondary schools and 480 respondents aged 14–18. Findings reveal significant infrastructure gaps, teacher qualification deficits, and gendered patterns in STEM aspiration.',
    keywords: ['STEM Education', 'Rural Nepal', 'Socioeconomic Barriers', 'Koshi Province', 'Youth Participation', 'Gender'],
    sections: [
      {
        heading: '1. Introduction',
        body: 'Access to STEM education remains unequal across Nepal\'s geographic and socioeconomic divides. While urban centres have seen steady growth in science enrolment, rural communities — particularly in Province 1 — continue to face compounding challenges including infrastructure gaps, teacher shortages, and cultural attitudes toward non-agricultural careers.',
        bullets: [
          'Nepal\'s STEM enrolment in rural secondary schools lags urban rates by an estimated 34%.',
          'Teacher-to-student ratios in sampled schools averaged 1:52 for science subjects.',
          'Female students represented only 29% of science stream enrolments in surveyed schools.',
        ],
      },
      {
        heading: '2. Methodology',
        body: 'A mixed-methods approach was employed, combining structured surveys administered to 480 students across 12 secondary schools with semi-structured interviews with 32 teachers and 20 school administrators. Data were collected between September and December 2024. Thematic analysis was applied to qualitative data; regression analysis was used for quantitative findings.',
      },
      {
        heading: '3. Findings',
        body: 'Results indicate that cost, connectivity, and qualification gaps are the primary structural barriers. However, cultural attitudes — particularly regarding female participation — compound structural disadvantage significantly.',
        bullets: [
          '67% of respondents cited cost of materials and internet access as primary barriers.',
          'Teacher qualification gaps were reported in 83% of surveyed schools.',
          'Female students were 2.4× more likely to report family discouragement as a key obstacle.',
          'Students with educated parents were 3.1× more likely to aspire to STEM careers.',
        ],
      },
      {
        heading: '4. Discussion',
        body: 'The findings align with prior research on structural determinants of educational access in developing economies, while adding nuance to the gendered dimensions of STEM aspiration in Nepal specifically. The interaction between household income, parental education, and cultural norms creates compounding disadvantage that single-variable interventions are unlikely to address effectively.',
      },
      {
        heading: '5. Conclusion & Recommendations',
        body: 'Targeted policy interventions are required at multiple levels — from national curriculum reform to district-level teacher training and community awareness programs. The following are recommended as immediate priorities.',
        bullets: [
          'Subsidised laboratory equipment program for rural secondary schools.',
          'Rural STEM teacher incentive scheme with housing and salary supplements.',
          'Community awareness campaigns co-designed with local leaders.',
          'Longitudinal tracking of student outcomes following policy implementation.',
        ],
      },
    ],
    callout: {
      label: 'Highlighted Finding',
      body: 'Female students in surveyed rural schools were 2.4 times more likely to cite family discouragement as a barrier to STEM participation than male peers — the single largest gendered gap identified in this study.',
    },
    citeSuggestion: 'Adhikari, K. & Bhattarai, S. (2025). Socioeconomic Barriers to STEM Access in Rural Nepal. INC Journal of Interdisciplinary Research, 4(2), 14–29. DOI: 10.XXXXX/inc.journal.2025.04.02.001',
  },
  2: {
    title: 'Microfinance and Women Entrepreneurship: A Longitudinal Analysis',
    authors: ['Dr. Nirmala Chaudhary'],
    authorAffiliation: 'Department of Economics, Itahari Namuna College',
    date: 'January 2025',
    volume: 'Vol. 4, Issue 1',
    field: 'Economics',
    doi: '10.XXXXX/inc.journal.2025.04.01.003',
    accentColor: '#c22368',
    coverGradient: 'from-[#c22368]/80 via-[#f2b843]/70 to-transparent',
    abstract: 'Tracking 200 female entrepreneurs over three years, this paper evaluates the long-term impact of microfinance access on household income and business growth in eastern Nepal. Results show significant income gains in years two and three, but highlight sustainability concerns.',
    keywords: ['Microfinance', 'Women Entrepreneurship', 'Nepal', 'Longitudinal Study', 'Household Income'],
    sections: [
      {
        heading: '1. Introduction',
        body: 'Microfinance has long been positioned as a tool for poverty alleviation and women\'s economic empowerment in South Asia. Nepal\'s microfinance sector has expanded rapidly over the past decade, yet rigorous longitudinal evidence on outcomes for female entrepreneurs remains limited.',
      },
      {
        heading: '2. Methodology',
        body: 'A panel study tracked 200 female microfinance recipients in Sunsari and Morang districts over 36 months. Baseline data were collected in January 2022. Follow-up surveys were conducted at 12, 24, and 36 months. Matched control group of 200 non-recipients was used for comparison.',
      },
      {
        heading: '3. Findings',
        body: 'Significant income gains were observed in the 24–36 month window, but early-stage outcomes were mixed due to high interest burdens and limited business training.',
        bullets: [
          'Average household income increased by 38% in the treatment group by month 36.',
          'Business survival rate was 71% at 36 months, compared to 58% in the control group.',
          'Women who also accessed business training showed 2.1× higher income gains.',
          'Debt stress was reported by 44% of participants in the first 12 months.',
        ],
      },
    ],
    callout: {
      label: 'Key Finding',
      body: 'Microfinance combined with structured business training produced income gains 2.1× greater than microfinance alone — suggesting that capital access without capability building yields significantly diminished returns.',
    },
    citeSuggestion: 'Chaudhary, N. (2025). Microfinance and Women Entrepreneurship: A Longitudinal Analysis. INC Journal of Interdisciplinary Research, 4(1), 44–61. DOI: 10.XXXXX/inc.journal.2025.04.01.003',
  },
};

const fallbackEntry = journalEntries[1];

const allEntries = [
  { id: 1, title: 'Socioeconomic Barriers to STEM Access in Rural Nepal', field: 'Social Sciences', volume: 'Vol. 4, Issue 2' },
  { id: 2, title: 'Microfinance and Women Entrepreneurship: A Longitudinal Analysis', field: 'Economics', volume: 'Vol. 4, Issue 1' },
  { id: 3, title: 'Machine Learning Applications in Agricultural Yield Prediction', field: 'Computer Science', volume: 'Vol. 3, Issue 4' },
  { id: 4, title: 'Post-Earthquake Urban Resilience: Lessons from 2015', field: 'Urban Studies', volume: 'Vol. 3, Issue 3' },
  { id: 5, title: 'Digital Literacy Among Secondary School Teachers in Province 1', field: 'Education', volume: 'Vol. 3, Issue 2' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function JournalDetail() {
  const { id } = useParams();
  const entry = journalEntries[id] ?? fallbackEntry;
  const related = allEntries.filter((e) => String(e.id) !== String(id)).slice(0, 4);
  const toc = entry.sections.map((s) => s.heading);

  return (
    <div className="min-h-screen bg-brand-gray/30">

      {/* ── BANNER ── */}
      <div
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[300px] flex items-end"
        style={{ backgroundImage: `linear-gradient(135deg, #20242b 0%, #045d30 100%)` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/90 via-[#00522b]/85 to-transparent z-10" />
        <div className="absolute inset-0 opacity-5 z-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

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
            <span className="text-xs text-white/50 font-body">{entry.volume} · {entry.date}</span>
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight max-w-3xl">
            {entry.title}
          </h1>

          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              <Users size={11} /> {entry.authors.join(' · ')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              <Calendar size={11} /> {entry.date}
            </span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── ARTICLE ── */}
          <article className="flex-1 min-w-0">

            {/* Abstract */}
            <div className="mb-10 rounded-xl bg-brand-primary/8 border-l-4 border-brand-primary p-6">
              <p className="text-xs font-body font-bold uppercase tracking-widest text-brand-primary mb-2">Abstract</p>
              <p className="font-body text-[15px] text-brand-dark/80 leading-relaxed italic">{entry.abstract}</p>
            </div>

            {/* DOI */}
            <div className="flex items-center gap-2 text-xs font-body text-brand-dark/40 mb-10">
              <ExternalLink size={11} />
              <span>DOI:</span>
              <span className="text-brand-primary font-medium">{entry.doi}</span>
              <button className="ml-auto p-2 rounded-lg hover:bg-brand-gray transition-colors" aria-label="Share">
                <Share2 size={13} className="text-brand-dark/30 hover:text-brand-primary transition-colors" />
              </button>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {entry.sections.map((section, i) => (
                <section key={i} id={`section-${i}`}>
                  <h2 className="font-heading text-xl font-bold text-brand-dark mb-3 leading-snug">
                    {section.heading}
                  </h2>
                  <p className="font-body text-[15px] text-brand-dark/75 leading-relaxed mb-4">
                    {section.body}
                  </p>
                  {section.bullets && (
                    <ul className="space-y-2 mt-3">
                      {section.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-3 font-body text-sm text-brand-dark/70 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Highlighted finding callout */}
            {entry.callout && (
              <div className="mt-10 rounded-xl bg-brand-dark/95 p-6 relative overflow-hidden">
                <Quote size={48} className="absolute top-4 right-4 text-white/5" />
                <p className="text-xs font-body font-bold uppercase tracking-widest text-brand-gold mb-3">
                  {entry.callout.label}
                </p>
                <p className="font-heading text-base font-semibold text-white leading-relaxed">
                  {entry.callout.body}
                </p>
              </div>
            )}

            {/* Keywords */}
            <div className="mt-10 pt-6 border-t border-brand-gray">
              <p className="text-xs font-body font-semibold text-brand-dark/40 uppercase tracking-widest mb-3">Keywords</p>
              <div className="flex flex-wrap gap-2">
                {entry.keywords.map((kw) => (
                  <span key={kw} className="text-xs font-body font-medium px-3 py-1.5 rounded-full bg-brand-gray text-brand-dark/60 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors duration-150 cursor-pointer">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Cite this paper */}
            <div className="mt-8 rounded-xl border border-brand-gray/60 bg-brand-white p-5">
              <p className="text-xs font-body font-bold uppercase tracking-widest text-brand-dark/40 mb-2">Cite This Paper</p>
              <p className="font-body text-xs text-brand-dark/70 leading-relaxed bg-brand-gray/50 rounded-lg px-4 py-3 select-all">
                {entry.citeSuggestion}
              </p>
            </div>

            {/* Author card */}
            <div className="mt-6 flex items-center gap-5 bg-brand-white rounded-xl border border-brand-gray/60 p-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-blue shrink-0 flex items-center justify-center">
                <span className="font-heading font-black text-white text-lg">
                  {entry.authors[0].split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-heading font-bold text-brand-dark text-sm">{entry.authors.join(', ')}</p>
                <p className="font-body text-xs text-brand-dark/50 mt-0.5">{entry.authorAffiliation}</p>
                <p className="font-body text-xs text-brand-dark/35 mt-1">{entry.volume} · Published {entry.date}</p>
              </div>
            </div>
          </article>

          {/* ── SIDEBAR ── */}
          <aside className="lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24">

            {/* Download */}
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-brand-primary to-brand-blue p-5 text-white">
              <BookOpen size={20} className="mb-3 opacity-80" />
              <p className="font-heading text-sm font-bold mb-1">Full Paper (PDF)</p>
              <p className="font-body text-xs text-white/70 mb-4 leading-relaxed">
                Download the complete peer-reviewed article with references and appendices.
              </p>
              <button className="w-full flex items-center justify-center gap-2 bg-white text-brand-primary text-xs font-bold font-body px-4 py-2.5 rounded-lg hover:bg-brand-gray transition-colors duration-200">
                <Download size={13} /> Download PDF
              </button>
            </div>

            {/* Table of Contents */}
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50 bg-brand-primary/5">
                <p className="font-heading text-xs font-bold text-brand-primary uppercase tracking-widest">Contents</p>
              </div>
              <ol className="p-3 space-y-1">
                {toc.map((heading, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-brand-gray/50 group transition-colors duration-150"
                    >
                      <span className="font-heading text-xs font-black text-brand-gray/60 shrink-0 mt-0.5">{i + 1}.</span>
                      <span className="font-body text-xs text-brand-dark/70 group-hover:text-brand-primary transition-colors duration-150 leading-snug">
                        {heading}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Related */}
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50">
                <p className="font-heading text-sm font-bold text-brand-dark">Related Research</p>
              </div>
              <ul className="divide-y divide-brand-gray/40">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/publications/journal/${r.id}`}
                      className="flex items-start gap-3 px-5 py-4 group hover:bg-brand-gray/30 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 shrink-0 flex items-center justify-center mt-0.5">
                        <FlaskConical size={13} className="text-brand-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-[10px] text-brand-dark/35 mt-1 font-body">{r.volume}</p>
                      </div>
                      <ChevronRight size={12} className="text-brand-dark/20 group-hover:text-brand-primary shrink-0 mt-1 transition-colors" />
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