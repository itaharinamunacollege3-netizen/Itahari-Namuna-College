import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User, TrendingUp, Tag } from 'lucide-react';
import {
  getBlogLink,
  getBlogCategories,
  getBlogs,
  getFeaturedBlog,
  getPopularBlogs,
} from './blogsService';
import { categoryColors } from './mockBlogs';

function CategoryBadge({ category, small = false }) {
  const c = categoryColors[category] ?? { bg: 'bg-brand-gray', text: 'text-brand-dark/60' };
  return (
    <span
      className={`inline-flex items-center gap-1 font-body font-semibold rounded-full ${c.bg} ${c.text} ${small ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
    >
      <Tag size={small ? 9 : 10} />
      {category}
    </span>
  );
}

function CoverPanel({ post, className = 'min-h-64 md:min-h-72' }) {
  if (post.coverImage) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${post.accentColor} 0%, #3db2e1 100%)` }}
    >
      <span className="absolute inset-0 flex items-center justify-center font-heading font-black text-[10rem] text-white/5 select-none pointer-events-none leading-none">
        {post.category?.[0]}
      </span>
    </div>
  );
}

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [popularPosts, setPopularPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [allPosts, featuredPost, popular, cats] = await Promise.all([
          getBlogs(),
          getFeaturedBlog(),
          getPopularBlogs(4),
          getBlogCategories(),
        ]);

        if (!active) return;
        setPosts(allPosts);
        setFeatured(featuredPost);
        setPopularPosts(popular);
        setCategories(cats.length ? cats : Object.keys(categoryColors));
      } catch (err) {
        if (active) setError(err.message || 'Failed to load blog posts.');
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
    if (!featured) return posts;
    return posts.filter((post) => post.id !== featured.id);
  }, [posts, featured]);

  return (
    <div className="min-h-screen bg-brand-gray/30">
      <div
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[260px] flex items-end"
        style={{ backgroundImage: 'linear-gradient(135deg, #045d30 0%, #3db2e1 100%)' }}
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
              Blog
            </span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-white leading-tight">
            Stories, Insights &amp; Campus Life
          </h1>
          <p className="font-heading italic text-emerald-100/80 text-base sm:text-lg max-w-xl">
            &ldquo;Perspectives from our faculty, students, and community.&rdquo;
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              {posts.length} Articles
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-xs px-4 py-1.5 text-xs font-medium text-white font-body">
              Student &amp; Faculty Voices
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 space-y-14">
        {loading ? (
          <div className="rounded-2xl border border-brand-gray/60 bg-brand-white p-10 text-center font-body text-brand-dark/60">
            Loading blog posts…
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
              Featured
            </p>
            <Link
              to={getBlogLink(featured)}
              className="group relative flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-brand-gray/60 bg-brand-white transition-all duration-300"
            >
              <div className="relative md:w-1/2">
                <CoverPanel post={featured} />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-xs font-semibold font-body px-3 py-1 rounded-full">
                    {featured.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-7 md:p-10 flex flex-col justify-center gap-4">
                <CategoryBadge category={featured.category} />
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-200">
                  {featured.title}
                </h2>
                <p className="font-body text-sm text-brand-dark/60 leading-relaxed line-clamp-3">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-brand-dark/40 font-body">
                  <span className="flex items-center gap-1.5">
                    <User size={11} />
                    {featured.author}
                  </span>
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} />
                    {featured.readTime}
                  </span>
                </div>
                <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold font-body text-brand-primary group-hover:gap-3 transition-all duration-200">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </section>
        ) : null}

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-body font-semibold tracking-widest uppercase text-brand-primary mb-6 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-primary inline-block" />
              Latest Posts
            </p>

            {!loading && rest.length === 0 ? (
              <div className="rounded-xl border border-brand-gray/60 bg-brand-white p-8 text-center font-body text-brand-dark/60">
                No blog posts published yet.
              </div>
            ) : null}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {rest.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-brand-white rounded-xl overflow-hidden shadow-sm border border-brand-gray/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  style={{
                    animation: 'fadeInUp 0.45s ease both',
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <CoverPanel post={post} className="h-44" />
                    <div className="absolute bottom-3 left-3">
                      <span
                        className="bg-white/90 backdrop-blur-sm text-[10px] font-semibold font-body px-2.5 py-0.5 rounded-full"
                        style={{ color: post.accentColor }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-2.5">
                    <div className="flex items-center gap-3 text-[11px] text-brand-dark/40 font-body">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-heading text-[15px] font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-body text-sm text-brand-dark/55 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-body text-brand-dark/40 flex items-center gap-1">
                        <User size={10} />
                        {post.author}
                      </span>
                      <Link
                        to={getBlogLink(post)}
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

          <aside className="lg:w-72 shrink-0 space-y-6">
            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50 flex items-center gap-2">
                <TrendingUp size={15} className="text-brand-primary" />
                <h2 className="font-heading text-sm font-bold text-brand-dark">Most Popular</h2>
              </div>
              <ol className="divide-y divide-brand-gray/40">
                {popularPosts.map((post, index) => (
                  <li key={post.id}>
                    <Link
                      to={getBlogLink(post)}
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

            <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-brand-gray/50">
                <h2 className="font-heading text-sm font-bold text-brand-dark">Browse by Category</h2>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {categories.map((cat) => (
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
