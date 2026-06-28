import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark, Tag, ChevronRight } from 'lucide-react';

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const blogPosts = {
  1: {
    title: 'How Experiential Learning is Reshaping Higher Education',
    author: 'Dr. Ramesh Sharma',
    authorRole: 'Head of Academic Affairs',
    date: 'June 15, 2025',
    readTime: '5 min read',
    category: 'Education',
    accentColor: '#045d30',
    coverGradient: 'from-[#045d30]/90 via-[#045d30]/80 to-transparent',
    intro: 'The traditional lecture hall is evolving. As industries demand more adaptable graduates, educational institutions across Nepal and the world are fundamentally rethinking how knowledge is delivered and absorbed.',
    sections: [
      {
        heading: 'Why the Old Model is No Longer Enough',
        body: 'For decades, higher education operated on a simple model: lecture, note-take, examine, repeat. It worked well in an era when information was scarce and expert transmission was the primary goal. Today, information is abundant — the challenge is no longer access, it is application.',
        bullets: [
          'Employers consistently cite "inability to apply knowledge" as a top graduate shortcoming.',
          'Critical thinking and problem-solving now rank above technical knowledge in most hiring rubrics.',
          'Industries evolve faster than curricula — real-world exposure closes that gap.',
        ],
      },
      {
        heading: 'What Experiential Learning Actually Looks Like',
        body: 'At Itahari Namuna College, experiential learning is not a philosophy statement on a website. It is embedded into how students spend their time. Projects are built for real clients. Fieldwork is graded alongside written reports. Industry professionals sit on assessment panels.',
        bullets: [
          'Live project briefs issued by partner businesses each semester.',
          'Structured internship weeks woven into the academic calendar.',
          'Community outreach assignments in place of conventional research papers.',
          'Peer teaching sessions where students present findings to junior batches.',
        ],
      },
      {
        heading: 'The Results Speak Clearly',
        body: 'Tracking outcomes over three years, our placement data tells a consistent story. Students who completed at least two experiential modules were significantly more likely to receive job offers within 60 days of graduation — and reported higher job satisfaction in their first year.',
      },
      {
        heading: 'What This Means for You as a Student',
        body: 'If you are currently enrolled, seek out every project-based module available to you. Volunteer for interdisciplinary teams. Take the community placement seriously. These experiences are not extra-curriculars — they are the curriculum. The classroom gives you the map. The experience teaches you to navigate.',
      },
      {
        heading: 'Looking Ahead',
        body: 'Itahari Namuna College is deepening its industry partnerships and creating structured pathways for students to transition seamlessly from campus to career. New agreements with regional businesses are being finalised for the upcoming academic year. The goal is simple: every graduate leaves with demonstrated ability, not just documented knowledge.',
      },
    ],
    callout: {
      heading: 'Key Takeaway',
      body: 'A degree is a credential. Experience is the evidence. The most competitive graduates in today\'s market carry both — and our curriculum is designed to ensure you do.',
    },
    tags: ['Education', 'Experiential Learning', 'Career Readiness', 'College Life'],
  },
  2: {
    title: 'Student Innovation Lab: Where Ideas Become Reality',
    author: 'Priya Thapa',
    authorRole: 'Innovation Lab Coordinator',
    date: 'May 28, 2025',
    readTime: '4 min read',
    category: 'Innovation',
    accentColor: '#e17622',
    coverGradient: 'from-[#f2b843]/90 via-[#e17622]/80 to-transparent',
    intro: 'Our Innovation Lab has produced over 30 student-led projects this year alone. Here is a look at some of the most exciting ideas that emerged from our campus — and what drove the teams behind them.',
    sections: [
      {
        heading: 'What the Lab Actually Does',
        body: 'The Innovation Lab is not a makerspace with 3D printers and a foosball table. It is a structured environment where student teams move through defined phases: problem identification, research, prototyping, testing, and presentation to real evaluators.',
        bullets: [
          'Teams of 3–5 students work across departments.',
          'Faculty mentors assigned per project domain.',
          'Monthly demo days open to industry partners.',
          'Top projects receive seed funding consideration.',
        ],
      },
      {
        heading: 'Standout Projects This Year',
        body: 'Three projects from this cohort have already advanced to external competitions. One team built a low-cost water filtration monitoring system for rural schools. Another developed a mobile-first platform for connecting local artisans to urban buyers. A third team created a peer tutoring matching tool now being piloted across two departments.',
      },
      {
        heading: 'How to Get Involved',
        body: 'Applications for the next Innovation Lab cohort open at the start of each semester. No prior technical experience is required — the Lab specifically looks for diverse teams that combine technical, design, communication, and domain knowledge. Submit a one-page problem statement to the Lab Coordinator to be considered.',
      },
    ],
    callout: {
      heading: 'Apply for the Next Cohort',
      body: 'Applications for the upcoming semester open in August. All enrolled students are eligible. The only requirement is a clearly defined problem you care about solving.',
    },
    tags: ['Innovation', 'Student Projects', 'Entrepreneurship', 'Lab'],
  },
};

const fallbackPost = blogPosts[1];

const allPosts = [
  { id: 1, title: 'How Experiential Learning is Reshaping Higher Education', category: 'Education', date: 'June 15, 2025' },
  { id: 2, title: 'Student Innovation Lab: Where Ideas Become Reality', category: 'Innovation', date: 'May 28, 2025' },
  { id: 3, title: 'A Guide to Navigating Career Fairs as a First-Year Student', category: 'Career', date: 'May 10, 2025' },
  { id: 4, title: 'Mental Wellness on Campus: Breaking the Stigma', category: 'Wellness', date: 'April 22, 2025' },
  { id: 5, title: 'Top 5 Clubs to Join in Your First Semester', category: 'Campus Life', date: 'April 5, 2025' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlogDetail() {
  const { id } = useParams();
  const post = blogPosts[id] ?? fallbackPost;
  const related = allPosts.filter((p) => String(p.id) !== String(id)).slice(0, 4);
  const toc = post.sections.map((s) => s.heading);

  return (
    <div className="min-h-screen bg-brand-gray/30">

      {/* ── BANNER (matches ProgramDetailPage) ── */}
      <div
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[300px] flex items-end"
        style={{ backgroundImage: `linear-gradient(135deg, #045d30 0%, #3db2e1 100%)` }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/90 via-[#00522b]/85 to-transparent z-10" />
        <div className="absolute inset-0 opacity-5 z-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto relative z-20 space-y-3 pb-2 w-full">
          <Link
            to="/publications/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors font-body"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Blog
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-body font-semibold bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full text-white">
              <Tag size={10} /> {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/60 font-body">
              <Clock size={10} /> {post.readTime}
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight max-w-3xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              <User size={11} /> {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              <Calendar size={11} /> {post.date}
            </span>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── ARTICLE BODY ── */}
          <article className="flex-1 min-w-0">

            {/* Intro / lead paragraph */}
            <p className="font-body text-brand-dark/80 text-lg leading-relaxed border-l-4 border-brand-primary pl-5 mb-10 italic">
              {post.intro}
            </p>

            {/* Sections */}
            <div className="space-y-10">
              {post.sections.map((section, i) => (
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

            {/* Callout box */}
            {post.callout && (
              <div className="mt-10 rounded-xl bg-brand-primary/8 border border-brand-primary/20 p-6">
                <p className="font-heading text-sm font-bold text-brand-primary mb-2 uppercase tracking-wide">
                  {post.callout.heading}
                </p>
                <p className="font-body text-sm text-brand-dark/75 leading-relaxed">
                  {post.callout.body}
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="mt-10 pt-6 border-t border-brand-gray flex flex-wrap gap-2 items-center">
              <span className="text-xs font-body font-semibold text-brand-dark/40 uppercase tracking-widest mr-2">Tags</span>
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-body font-medium px-3 py-1.5 rounded-full bg-brand-gray text-brand-dark/60 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors duration-150 cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author card */}
            <div className="mt-8 flex items-center gap-5 bg-brand-white rounded-xl border border-brand-gray/60 p-5">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-primary to-brand-blue shrink-0 flex items-center justify-center">
                <span className="font-heading font-black text-white text-xl">
                  {post.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-heading font-bold text-brand-dark text-sm">{post.author}</p>
                <p className="font-body text-xs text-brand-dark/50 mt-0.5">{post.authorRole}</p>
                <p className="font-body text-xs text-brand-dark/40 mt-1">{post.date} · {post.readTime}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-brand-gray transition-colors duration-150" aria-label="Bookmark">
                  <Bookmark size={15} className="text-brand-dark/40 hover:text-brand-primary transition-colors" />
                </button>
                <button className="p-2 rounded-lg hover:bg-brand-gray transition-colors duration-150" aria-label="Share">
                  <Share2 size={15} className="text-brand-dark/40 hover:text-brand-primary transition-colors" />
                </button>
              </div>
            </div>
          </article>

          {/* ── SIDEBAR ── */}
          <aside className="lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24">

            {/* Table of Contents */}
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50 bg-brand-primary/5">
                <p className="font-heading text-xs font-bold text-brand-primary uppercase tracking-widest">In This Article</p>
              </div>
              <ol className="p-3 space-y-1">
                {toc.map((heading, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-brand-gray/50 group transition-colors duration-150"
                    >
                      <span className="font-heading text-xs font-black text-brand-gray/70 shrink-0 mt-0.5 w-4">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="font-body text-xs text-brand-dark/70 group-hover:text-brand-primary transition-colors duration-150 leading-snug">
                        {heading}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Related Posts */}
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50">
                <p className="font-heading text-sm font-bold text-brand-dark">More from the Blog</p>
              </div>
              <ul className="divide-y divide-brand-gray/40">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/publications/blog/${r.id}`}
                      className="flex items-start gap-3 px-5 py-4 group hover:bg-brand-gray/30 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 shrink-0 flex items-center justify-center mt-0.5">
                        <span className="font-heading font-black text-brand-primary text-xs">{r.category[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {r.title}
                        </p>
                        <p className="text-[10px] text-brand-dark/35 mt-1 font-body">{r.date}</p>
                      </div>
                      <ChevronRight size={12} className="text-brand-dark/20 group-hover:text-brand-primary shrink-0 mt-1 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-xl overflow-hidden bg-gradient-to-br from-brand-primary to-brand-blue p-5 text-white">
              <p className="font-heading text-sm font-bold mb-1">Ready to Join Us?</p>
              <p className="font-body text-xs text-white/75 mb-4 leading-relaxed">
                Applications for the upcoming semester are now open.
              </p>
              <Link
                to="/admissions"
                className="block w-full text-center bg-white text-brand-primary text-xs font-bold font-body px-4 py-2.5 rounded-lg hover:bg-brand-gray transition-colors duration-200"
              >
                Apply Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}