import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Share2,
  Tag,
  User,
} from 'lucide-react';
import { getBlogById, getBlogLink, getRelatedBlogs } from './blogsService';

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [detail, relatedPosts] = await Promise.all([
          getBlogById(id),
          getRelatedBlogs(id),
        ]);
        if (!active) return;
        if (!detail) {
          setError('Blog post not found.');
          setPost(null);
          setRelated([]);
          return;
        }
        setPost(detail);
        setRelated(relatedPosts);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load blog post.');
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
        <p className="font-body text-brand-dark/60">Loading article…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-brand-gray/30 flex flex-col items-center justify-center gap-4 px-6">
        <p className="font-body text-brand-crimson">{error || 'Blog post not found.'}</p>
        <Link to="/publications/blog" className="font-body text-brand-primary hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const toc = Array.isArray(post.sections) ? post.sections.map((section) => section.heading) : [];
  const bannerStyle = post.coverImage
    ? { backgroundImage: `url(${post.coverImage})` }
    : { backgroundImage: `linear-gradient(135deg, ${post.accentColor} 0%, #3db2e1 100%)` };

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

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          <article className="flex-1 min-w-0">
            <p className="font-body text-brand-dark/80 text-lg leading-relaxed border-l-4 border-brand-primary pl-5 mb-10 italic">
              {post.intro}
            </p>

            {post.attachmentUrl ? (
              <a
                href={post.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-brand-primary/8 text-brand-primary px-6 py-4 rounded-xl border border-brand-primary/20 hover:bg-brand-primary/12 transition-colors duration-200 mb-10"
              >
                <div className="p-3 rounded-lg bg-brand-primary text-white">
                  <Download size={20} />
                </div>
                <div>
                  <p className="font-heading font-bold text-sm text-brand-primary">Download Attachment</p>
                  <p className="font-body text-xs text-brand-dark/50 mt-0.5">PDF document · Click to open</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-brand-primary" />
              </a>
            ) : null}

            <div className="space-y-10">
              {post.sections?.map((section, index) => (
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
                  {section.imageUrl ? (
                    <div className="mt-4 mb-3 rounded-xl overflow-hidden">
                      <img
                        src={section.imageUrl}
                        alt={section.heading}
                        className="w-full h-auto"
                      />
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            {post.callout ? (
              <div className="mt-10 rounded-xl bg-brand-primary/8 border border-brand-primary/20 p-6">
                <p className="font-heading text-sm font-bold text-brand-primary mb-2 uppercase tracking-wide">
                  {post.callout.heading}
                </p>
                <p className="font-body text-sm text-brand-dark/75 leading-relaxed">
                  {post.callout.body}
                </p>
              </div>
            ) : null}

            {post.tags?.length ? (
              <div className="mt-10 pt-6 border-t border-brand-gray flex flex-wrap gap-2 items-center">
                <span className="text-xs font-body font-semibold text-brand-dark/40 uppercase tracking-widest mr-2">
                  Tags
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-body font-medium px-3 py-1.5 rounded-full bg-brand-gray text-brand-dark/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex items-center gap-5 bg-brand-white rounded-xl border border-brand-gray/60 p-5">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-brand-primary to-brand-blue shrink-0 flex items-center justify-center">
                <span className="font-heading font-black text-white text-xl">
                  {post.author
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-heading font-bold text-brand-dark text-sm">{post.author}</p>
                {post.authorRole ? (
                  <p className="font-body text-xs text-brand-dark/50 mt-0.5">{post.authorRole}</p>
                ) : null}
                <p className="font-body text-xs text-brand-dark/40 mt-1">
                  {post.date} · {post.readTime}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-brand-gray transition-colors duration-150"
                  aria-label="Bookmark"
                >
                  <Bookmark size={15} className="text-brand-dark/40 hover:text-brand-primary transition-colors" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-brand-gray transition-colors duration-150"
                  aria-label="Share"
                >
                  <Share2 size={15} className="text-brand-dark/40 hover:text-brand-primary transition-colors" />
                </button>
              </div>
            </div>
          </article>

          <aside className="lg:w-72 shrink-0 space-y-5 lg:sticky lg:top-24">
            {toc.length ? (
              <div className="bg-brand-white rounded-xl border border-brand-gray/60 overflow-hidden">
                <div className="px-5 py-4 border-b border-brand-gray/50 bg-brand-primary/5">
                  <p className="font-heading text-xs font-bold text-brand-primary uppercase tracking-widest">
                    In This Article
                  </p>
                </div>
                <ol className="p-3 space-y-1">
                  {toc.map((heading, index) => (
                    <li key={index}>
                      <a
                        href={`#section-${index}`}
                        className="flex items-start gap-2.5 px-3 py-2 rounded-lg hover:bg-brand-gray/50 group transition-colors duration-150"
                      >
                        <span className="font-heading text-xs font-black text-brand-gray/70 shrink-0 mt-0.5 w-4">
                          {String(index + 1).padStart(2, '0')}
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
                <p className="font-heading text-sm font-bold text-brand-dark">More from the Blog</p>
              </div>
              <ul className="divide-y divide-brand-gray/40">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={getBlogLink(item)}
                      className="flex items-start gap-3 px-5 py-4 group hover:bg-brand-gray/30 transition-colors duration-150"
                    >
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 shrink-0 flex items-center justify-center mt-0.5">
                        <span className="font-heading font-black text-brand-primary text-xs">
                          {item.category?.[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-brand-dark/35 mt-1 font-body">{item.date}</p>
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

            <div className="rounded-xl overflow-hidden bg-linear-to-br from-brand-primary to-brand-blue p-5 text-white">
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
