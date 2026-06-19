import { useState, useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import NoticeRowCard from '../components/NoticeRowCard';
import NoticeDetailView from '../components/NoticeDetailView';
import AnimatedSection from '../../../components/animations/AnimatedSection';
import NoticeFilterTabs from '../components/NoticeFilterTabs';
import PageBanner from '../../../components/common/PageBanner';

export default function NoticeBoardPage() {
  const notices = useLoaderData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(notices[0]?.id ?? null);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || n.tags.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [notices, searchTerm, activeCategory]);

  const selectedNotice =
    filteredNotices.find((n) => n.id === selectedId) ?? filteredNotices[0] ?? null;

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
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
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