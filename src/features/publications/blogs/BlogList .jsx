import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, TrendingUp, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'How Experiential Learning is Reshaping Higher Education',
    excerpt: 'Classrooms are no longer the only place where learning happens. Discover how hands-on projects and industry partnerships are transforming what it means to study at Itahari Namuna College.',
    category: 'Education',
    author: 'Dr. Ramesh Sharma',
    date: 'June 15, 2025',
    readTime: '5 min read',
    coverGradient: 'from-[#045d30]/90 via-[#045d30]/80 to-transparent',
    accentColor: '#045d30',
  },
  {
    id: 2,
    title: 'Student Innovation Lab: Where Ideas Become Reality',
    excerpt: "Our Innovation Lab has produced over 30 student-led projects this year alone. Here's a look at some of the most exciting ideas that emerged from our campus.",
    category: 'Innovation',
    author: 'Priya Thapa',
    date: 'May 28, 2025',
    readTime: '4 min read',
    coverGradient: 'from-[#f2b843]/90 via-[#e17622]/80 to-transparent',
    accentColor: '#e17622',
  },
  {
    id: 3,
    title: 'A Guide to Navigating Career Fairs as a First-Year Student',
    excerpt: 'Walking into a career fair can feel overwhelming. Our career counsellors share their top strategies for making meaningful connections and landing internship opportunities.',
    category: 'Career',
    author: 'Sita Karki',
    date: 'May 10, 2025',
    readTime: '6 min read',
    coverGradient: 'from-[#c22368]/90 via-[#c22368]/80 to-transparent',
    accentColor: '#c22368',
  },
  {
    id: 4,
    title: 'Mental Wellness on Campus: Breaking the Stigma',
    excerpt: 'Academic pressure is real. Our counselling centre and peer support networks are here to help every student thrive — not just academically, but personally.',
    category: 'Wellness',
    author: 'Anita Rai',
    date: 'April 22, 2025',
    readTime: '3 min read',
    coverGradient: 'from-[#3db2e1]/90 via-[#3db2e1]/80 to-transparent',
    accentColor: '#3db2e1',
  },
  {
    id: 5,
    title: 'Top 5 Clubs to Join in Your First Semester',
    excerpt: 'From debate to robotics, college clubs are where lifelong friendships and hidden talents are discovered. Here are the ones you shouldn\'t miss.',
    category: 'Campus Life',
    author: 'Bikash Limbu',
    date: 'April 5, 2025',
    readTime: '4 min read',
    coverGradient: 'from-[#e17622]/90 via-[#f2b843]/80 to-transparent',
    accentColor: '#e17622',
  },
  {
    id: 6,
    title: 'Sustainability Initiatives Driving Change on Our Campus',
    excerpt: "From solar panels to zero-waste events, Itahari Namuna College is committed to a greener future. Here's what we've accomplished — and what's next.",
    category: 'Sustainability',
    author: 'Dr. Manoj Pokharel',
    date: 'March 18, 2025',
    readTime: '5 min read',
    coverGradient: 'from-[#045d30]/90 via-[#045d30]/70 to-transparent',
    accentColor: '#045d30',
  },
  {
    id: 7,
    title: 'What Makes a Great Teacher? Reflections from Our Faculty',
    excerpt: 'We asked ten of our longest-serving professors what they believe separates good teaching from truly transformative education. Their answers might surprise you.',
    category: 'Education',
    author: 'Dr. Kamala Adhikari',
    date: 'March 1, 2025',
    readTime: '7 min read',
    coverGradient: 'from-[#045d30]/90 via-[#3db2e1]/70 to-transparent',
    accentColor: '#045d30',
  },
];

const featured = blogPosts[0];
const rest = blogPosts.slice(1);

const popularPosts = [
  blogPosts[0],
  blogPosts[2],
  blogPosts[4],
  blogPosts[1],
];

const categoryColors = {
  Education:     { bg: 'bg-brand-primary/10',  text: 'text-brand-primary' },
  Innovation:    { bg: 'bg-brand-gold/15',      text: 'text-brand-orange' },
  Career:        { bg: 'bg-brand-crimson/10',   text: 'text-brand-crimson' },
  Wellness:      { bg: 'bg-brand-blue/10',      text: 'text-brand-blue' },
  'Campus Life': { bg: 'bg-brand-orange/10',    text: 'text-brand-orange' },
  Sustainability:{ bg: 'bg-brand-primary/10',   text: 'text-brand-primary' },
};

function CategoryBadge({ category, small = false }) {
  const c = categoryColors[category] ?? { bg: 'bg-brand-gray', text: 'text-brand-dark/60' };
  return (
    <span className={`inline-flex items-center gap-1 font-body font-semibold rounded-full ${c.bg} ${c.text} ${small ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
      <Tag size={small ? 9 : 10} />
      {category}
    </span>
  );
}

export default function BlogList() {
  return (
    <div className="min-h-screen bg-brand-gray/30">

      {/* ── PAGE BANNER (matches your ProgramDetailPage pattern) ── */}
      <div
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[260px] flex items-end"
        style={{ backgroundImage: `linear-gradient(135deg, #045d30 0%, #3db2e1 100%)` }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-[#006A38]/90 via-[#00522b]/85 to-transparent z-10" />
        {/* subtle texture dots */}
        <div className="absolute inset-0 opacity-5 z-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto relative z-20 space-y-3 pb-2">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors font-body">
            ← Home
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-emerald-300/70">Publications</span>
            <span className="text-emerald-300/40 text-xs">/</span>
            <span className="text-xs font-body font-semibold tracking-widest uppercase text-emerald-200">Blog</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-white leading-tight">
            Stories, Insights &amp; Campus Life
          </h1>
          <p className="font-heading italic text-emerald-100/80 text-base sm:text-lg max-w-xl">
            "Perspectives from our faculty, students, and community."
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              {blogPosts.length} Articles
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              Student &amp; Faculty Voices
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-14">

        {/* ── FEATURED POST (KMC-style hero card) ── */}
        <section>
          <p className="text-xs font-body font-semibold tracking-widest uppercase text-brand-primary mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-brand-primary inline-block" />
            Featured
          </p>
          <Link
            to={`/publications/blog/${featured.id}`}
            className="group relative flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-brand-gray/60 bg-brand-white transition-all duration-300"
          >
            {/* Image / gradient panel */}
            <div
              className={`relative md:w-1/2 min-h-64 md:min-h-72 bg-gradient-to-br ${featured.coverGradient} bg-brand-primary/80 overflow-hidden`}
            >
              {/* big letter watermark */}
              <span className="absolute inset-0 flex items-center justify-center font-heading font-black text-[10rem] text-white/5 select-none pointer-events-none leading-none">
                {featured.category[0]}
              </span>
              {/* category pill over image */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-xs font-semibold font-body px-3 py-1 rounded-full">
                  {featured.category}
                </span>
              </div>
            </div>

            {/* Text panel */}
            <div className="flex-1 p-7 md:p-10 flex flex-col justify-center gap-4">
              <CategoryBadge category={featured.category} />
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-200">
                {featured.title}
              </h2>
              <p className="font-body text-sm text-brand-dark/60 leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-4 text-xs text-brand-dark/40 font-body">
                <span className="flex items-center gap-1.5"><User size={11} />{featured.author}</span>
                <span>{featured.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={11} />{featured.readTime}</span>
              </div>
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold font-body text-brand-primary group-hover:gap-3 transition-all duration-200">
                Read Article <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </section>

        {/* ── MAIN GRID + SIDEBAR ── */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left: article grid */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-brand-primary mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-primary inline-block" />
              Latest Posts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rest.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-brand-white rounded-xl overflow-hidden shadow-sm border border-brand-gray/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{ animation: `fadeInUp 0.45s ease both`, animationDelay: `${index * 70}ms` }}
                >
                  {/* Card image panel */}
                  <div className={`relative h-44 bg-gradient-to-br ${post.coverGradient} bg-brand-primary/70 overflow-hidden`}>
                    <span className="absolute inset-0 flex items-center justify-center font-heading font-black text-[6rem] text-white/5 select-none pointer-events-none leading-none">
                      {post.category[0]}
                    </span>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-[10px] font-semibold font-body px-2.5 py-0.5 rounded-full" style={{ color: post.accentColor }}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col gap-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-brand-dark/40 font-body">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock size={10} />{post.readTime}</span>
                    </div>
                    <h3 className="font-heading text-[15px] font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-body text-sm text-brand-dark/55 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-body text-brand-dark/40 flex items-center gap-1">
                        <User size={10} />{post.author}
                      </span>
                      <Link
                        to={`/publications/blog/${post.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold font-body text-brand-primary hover:gap-2 transition-all duration-200"
                      >
                        Read <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-6">

            {/* Most Popular */}
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50 flex items-center gap-2">
                <TrendingUp size={15} className="text-brand-primary" />
                <h2 className="font-heading text-sm font-bold text-brand-dark">Most Popular</h2>
              </div>
              <ol className="divide-y divide-brand-gray/40">
                {popularPosts.map((post, index) => (
                  <li key={post.id}>
                    <Link
                      to={`/publications/blog/${post.id}`}
                      className="flex items-start gap-3 px-5 py-4 group hover:bg-brand-gray/30 transition-colors duration-150"
                    >
                      <span className="font-heading text-xl font-black text-brand-gray shrink-0 leading-none mt-0.5 w-6">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {post.title}
                        </p>
                        <p className="text-[10px] text-brand-dark/35 mt-1 font-body">{post.date}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* Categories */}
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50">
                <h2 className="font-heading text-sm font-bold text-brand-dark">Browse by Category</h2>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {Object.keys(categoryColors).map((cat) => (
                  <CategoryBadge key={cat} category={cat} />
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