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
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          <p className="font-body text-brand-dark/60">Loading article…</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-brand-gray/30 flex flex-col items-center justify-center gap-4 px-6">
        <p className="font-body text-brand-crimson">{error || 'Blog post not found.'}</p>
        <Link to="/publications/blog" className="font-body text-brand-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Blog
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
      {/* Hero Banner */}
      <div
        className="w-full relative text-white py-20 px-6 sm:px-12 md:px-16 overflow-hidden bg-cover bg-center min-h-[400px] flex items-end"
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
        {post.coverImage && (
          <div className="absolute inset-0 bg-black/20 z-10" />
        )}

        <div className="max-w-7xl mx-auto relative z-20 space-y-4 pb-2 w-full">
          <Link
            to="/publications/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-200/80 hover:text-white transition-colors font-body"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Blog
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white">
              <Tag size={10} /> {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/70 font-body">
              <Clock size={10} /> {post.readTime}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight max-w-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-white/20 to-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="font-heading font-black text-white">
                  {post.author
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-heading font-semibold text-white">{post.author}</p>
                {post.authorRole && (
                  <p className="text-xs text-white/70">{post.authorRole}</p>
                )}
              </div>
            </div>
            <span className="text-white/50">•</span>
            <span className="inline-flex items-center gap-1.5 text-sm text-white/80 font-body">
              <Calendar size={14} /> {post.date}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <article className="flex-1 min-w-0">
            {/* Intro */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-body text-brand-dark/85 text-lg sm:text-xl leading-relaxed border-l-4 border-brand-primary pl-6 mb-12 italic">
                {post.intro}
              </p>
            </motion.div>

            {/* Attachment Download */}
            {post.attachmentUrl && (
              <motion.a
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                href={post.attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-4 bg-gradient-to-r from-brand-primary/10 to-brand-blue/10 text-brand-dark px-8 py-5 rounded-2xl border border-brand-primary/20 hover:from-brand-primary/15 hover:to-brand-blue/15 transition-all duration-300 mb-12 shadow-sm hover:shadow-md"
              >
                <div className="p-4 rounded-xl bg-gradient-to-br from-brand-primary to-brand-blue text-white shadow-lg">
                  <Download size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-lg text-brand-dark">Download Attachment</p>
                  <p className="font-body text-sm text-brand-dark/60 mt-1">PDF document · Click to open</p>
                </div>
                <ChevronRight size={20} className="text-brand-primary" />
              </motion.a>
            )}

            {/* Sections */}
            <div className="space-y-16">
              {post.sections?.map((section, index) => (
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
                  
                  {/* Bullets */}
                  {section.bullets?.length ? (
                    <ul className="space-y-3 mt-6 mb-6">
                      {section.bullets.map((bullet, bulletIndex) => (
                        <li
                          key={bulletIndex}
                          className="flex items-start gap-4 font-body text-base text-brand-dark/75 leading-relaxed"
                        >
                          <div className="mt-2 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-brand-primary to-brand-blue shrink-0 shadow-sm" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {/* Section Image */}
                  {section.imageUrl && (
                    <div className="mt-6 mb-6 rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 max-w-3xl mx-auto">
                      <img
                        src={section.imageUrl}
                        alt={section.heading}
                        className="w-full h-auto max-h-[320px] object-cover transition-transform duration-700 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                  )}
                </motion.section>
              ))}
            </div>

            {/* Callout Box */}
            {post.callout && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-16 rounded-2xl bg-gradient-to-r from-brand-primary/10 via-brand-primary/5 to-brand-blue/10 border border-brand-primary/20 p-8 sm:p-10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-blue/10 rounded-full blur-2xl" />
                <p className="font-heading text-sm font-extrabold text-brand-primary mb-3 uppercase tracking-widest">
                  {post.callout.heading}
                </p>
                <p className="font-body text-base text-brand-dark/80 leading-relaxed">
                  {post.callout.body}
                </p>
              </motion.div>
            )}

            {/* Tags */}
            {post.tags?.length ? (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-12 pt-8 border-t border-brand-gray/60 flex flex-wrap gap-3 items-center"
              >
                <span className="text-xs font-body font-bold text-brand-dark/50 uppercase tracking-widest">
                  Tags
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm font-body font-medium px-4 py-2 rounded-full bg-gradient-to-r from-brand-gray to-brand-gray/80 text-brand-dark/70 hover:text-brand-primary hover:from-brand-primary/10 hover:to-brand-blue/10 transition-all duration-300 cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </motion.div>
            ) : null}

            {/* Author Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-10 flex items-center gap-6 bg-gradient-to-br from-brand-white to-brand-gray/30 rounded-2xl border border-brand-gray/60 p-6 sm:p-8 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-blue shrink-0 flex items-center justify-center shadow-lg">
                <span className="font-heading font-black text-white text-xl">
                  {post.author
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-heading font-bold text-brand-dark text-lg">{post.author}</p>
                {post.authorRole ? (
                  <p className="font-body text-sm text-brand-dark/60 mt-1">{post.authorRole}</p>
                ) : null}
                <p className="font-body text-xs text-brand-dark/50 mt-2 flex items-center gap-2">
                  <Calendar size={12} /> {post.date}
                  <span className="mx-2">•</span>
                  <Clock size={12} /> {post.readTime}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-3 rounded-xl bg-brand-gray/50 hover:bg-brand-gray transition-all duration-200 hover:scale-105"
                  aria-label="Bookmark"
                >
                  <Bookmark size={18} className="text-brand-dark/50 hover:text-brand-primary transition-colors" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-brand-gray/50 hover:bg-brand-gray transition-all duration-200 hover:scale-105"
                  aria-label="Share"
                >
                  <Share2 size={18} className="text-brand-dark/50 hover:text-brand-primary transition-colors" />
                </button>
              </div>
            </motion.div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            {toc.length ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-brand-white rounded-2xl border border-brand-gray/60 overflow-hidden shadow-sm"
              >
                <div className="px-6 py-5 border-b border-brand-gray/50 bg-gradient-to-r from-brand-primary/5 to-brand-blue/5">
                  <p className="font-heading text-xs font-extrabold text-brand-primary uppercase tracking-widest">
                    In This Article
                  </p>
                </div>
                <ol className="p-4 space-y-2">
                  {toc.map((heading, index) => (
                    <li key={index}>
                      <a
                        href={`#section-${index}`}
                        className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-brand-gray/50 group transition-all duration-200"
                      >
                        <span className="font-heading text-sm font-black text-brand-gray/80 shrink-0 mt-0.5">
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

            {/* Related Posts */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-brand-white rounded-2xl border border-brand-gray/60 overflow-hidden shadow-sm"
            >
              <div className="px-6 py-5 border-b border-brand-gray/50">
                <p className="font-heading text-base font-bold text-brand-dark">More from the Blog</p>
              </div>
              <ul className="divide-y divide-brand-gray/40">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={getBlogLink(item)}
                      className="flex items-start gap-4 px-6 py-5 group hover:bg-brand-gray/30 transition-colors duration-200"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-blue/10 shrink-0 flex items-center justify-center mt-0.5">
                        <span className="font-heading font-black text-brand-primary text-sm">
                          {item.category?.[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm font-medium text-brand-dark group-hover:text-brand-primary transition-colors duration-200 leading-snug line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-xs text-brand-dark/40 mt-1.5 font-body">{item.date}</p>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className="text-brand-dark/20 group-hover:text-brand-primary shrink-0 mt-1 transition-all duration-200" 
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CTA Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl overflow-hidden bg-gradient-to-br from-brand-primary via-brand-primary to-brand-blue p-7 text-white shadow-lg"
            >
              <p className="font-heading text-base font-bold mb-2">Ready to Join Us?</p>
              <p className="font-body text-sm text-white/80 mb-6 leading-relaxed">
                Applications for the upcoming semester are now open. Take the first step towards your future.
              </p>
              <Link
                to="/admissions"
                className="flex items-center justify-center gap-2 bg-white text-brand-primary text-sm font-bold font-body px-6 py-3.5 rounded-xl hover:bg-brand-gray/20 hover:text-white transition-all duration-300 w-full"
              >
                Apply Now <ExternalLink size={14} />
              </Link>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}
