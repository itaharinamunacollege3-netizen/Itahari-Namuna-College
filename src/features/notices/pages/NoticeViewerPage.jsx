import { useLoaderData, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NoticeDetailView from '../components/NoticeDetailView';
import PageBanner from '../../../components/common/PageBanner';

export default function NoticeViewerPage() {
  const notice = useLoaderData();

  if (!notice) {
    return (
      <div className="w-full bg-stone-50 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-2">Notice not found</h1>
        <p className="text-brand-dark/50 mb-6">This notice may have been removed or the link is incorrect.</p>
        <Link
          to="/notices"
          className="inline-flex items-center gap-2 bg-brand-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-brand-primary/90 transition"
        >
          <ArrowLeft size={16} /> Back to all notices
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <PageBanner title={notice.title} subtitle={`${notice.author} • ${notice.publishedDate}`} />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 py-8 sm:py-12">
        <Link
          to="/notices"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition mb-6"
        >
          <ArrowLeft size={16} /> Back to all notices
        </Link>
        <NoticeDetailView notice={notice} />
      </div>
    </div>
  );
}
