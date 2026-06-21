import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import NoticeRowCard from '../components/NoticeRowCard';
import NoticeDetailView from '../components/NoticeDetailView';
import AnimatedSection from '../../../components/animations/AnimatedSection';
import NoticeFilterTabs from '../components/NoticeFilterTabs';
import PageBanner from '../../../components/common/PageBanner';
import { getNotices } from '../services/noticesService';

export default function NoticeBoardPage() {
  const initialNotices = useLoaderData();
  const [notices, setNotices] = useState(initialNotices);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(initialNotices[0]?.id ?? null);

  // Fetch filtered notices from the backend whenever the search or category
  // changes. Search is debounced so we don't fire a request per keystroke.
  useEffect(() => {
    let active = true;
    const handler = setTimeout(() => {
      getNotices({
        search: searchTerm,
        tag: activeCategory === 'All' ? '' : activeCategory,
      }).then((data) => {
        if (active) setNotices(data);
      });
    }, 300);
    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [searchTerm, activeCategory]);

  const selectedNotice =
    notices.find((n) => n.id === selectedId) ?? notices[0] ?? null;

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <PageBanner title="Official Notices & Announcements" subtitle="Real-time updates from the administration, faculty, and departments." />
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-4">Notices</h2>

          <NoticeFilterTabs
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          <AnimatedSection className="space-y-3">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <NoticeRowCard
                  key={notice.id}
                  data={notice}
                  onClick={() => setSelectedId(notice.id)}
                  isActive={selectedNotice?.id === notice.id}
                />
              ))
            ) : (
              <p className="text-center py-10 text-brand-dark/40 italic">No notices found.</p>
            )}
          </AnimatedSection>
        </div>

        <div className="lg:w-2/3">
          <AnimatedSection>
            <NoticeDetailView notice={selectedNotice} />
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}