import { useState, useMemo } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import NoticeRowCard from '../components/NoticeRowCard';
import NoticeDetailView from '../components/NoticeDetailView';
import AnimatedSection from '../../../components/animations/AnimatedSection';
import NoticeFilterTabs from '../components/NoticeFilterTabs';
import PageBanner from '../../../components/common/PageBanner';

export default function NoticeBoardPage() {
  const allNotices = useLoaderData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(allNotices[0]?.id ?? null);

  const categories = useMemo(() => {
    const set = new Set();
    allNotices.forEach((n) => {
      if (n.category) set.add(n.category);
      (Array.isArray(n.tags) ? n.tags : []).forEach((tag) => {
        if (tag) set.add(tag);
      });
    });
    return ['All', ...set];
  }, [allNotices]);

  const notices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return allNotices.filter((notice) => {
      const tags = Array.isArray(notice.tags) ? notice.tags : [];
      const matchesCategory =
        activeCategory === 'All' ||
        notice.category === activeCategory ||
        tags.includes(activeCategory);
      const haystack = [notice.title, notice.description, notice.author, notice.category, ...tags]
        .map((field) => String(field ?? '').toLowerCase());
      const matchesSearch = !query || haystack.some((field) => field.includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [allNotices, searchTerm, activeCategory]);

  const selectedNotice =
    notices.find((n) => n.id === selectedId) ?? notices[0] ?? null;

  const handleSelect = (id) => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setSelectedId(id);
    } else {
      navigate(`/notices/${id}`);
    }
  };

  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <PageBanner title="Official Notices & Announcements" subtitle="Real-time updates from the administration, faculty, and departments." />
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-4">Notices</h2>

          <NoticeFilterTabs
            categories={categories}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          <div className="space-y-3">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <NoticeRowCard
                  key={notice.id}
                  data={notice}
                  onClick={() => handleSelect(notice.id)}
                  isActive={selectedNotice?.id === notice.id}
                />
              ))
            ) : (
              <p className="text-center py-10 text-brand-dark/40 italic">No notices found.</p>
            )}
          </div>
        </div>

        <div className="lg:w-2/3 hidden lg:block h-screen md:sticky top-15">
          <AnimatedSection>
            <NoticeDetailView notice={selectedNotice} />
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
