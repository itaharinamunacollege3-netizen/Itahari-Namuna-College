import React, { useState, useMemo, useEffect } from 'react';
import { mockNotices } from '../data/mockNotices';
import NoticeRowCard from '../components/NoticeRowCard';
import NoticeDetailView from '../components/NoticeDetailView';
import AnimatedSection from '../../../components/animations/AnimatedSection';
import NoticeFilterTabs from '../components/NoticeFilterTabs';
import PageBanner from '../../../components/common/PageBanner';
export default function NoticeBoardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedNotice, setSelectedNotice] = useState(mockNotices[0]);

  const filteredNotices = useMemo(() => {
    return mockNotices.filter((n) => {
      const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || n.tags.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);
  useEffect(() => {
    // If the currently selected notice is NOT in the filtered list,
    // select the first one from the filtered list automatically.
    if (filteredNotices.length > 0 && !filteredNotices.find(n => n.id === selectedNotice?.id)) {
      setSelectedNotice(filteredNotices[0]);
    }
  }, [filteredNotices]);
  return (
    <div className="w-full bg-stone-50 min-h-screen pb-20">
      <PageBanner title="Official Notices & Announcements" subtitle="Real-time updates from the administration, faculty, and departments." />
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        {/* LEFT: Master List */}
        <div className="lg:w-1/3">
          <h2 className="text-2xl font-heading font-bold text-brand-dark mb-4">Notices</h2>

          <NoticeFilterTabs
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

          {/* Render the filtered list */}
          <AnimatedSection className="space-y-3">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <NoticeRowCard
                  key={notice.id}
                  data={notice}
                  onClick={() => setSelectedNotice(notice)}
                  isActive={selectedNotice?.id === notice.id}
                />
              ))
            ) : (
              <p className="text-center py-10 text-brand-dark/40 italic">No notices found.</p>
            )}
          </AnimatedSection>
        </div>

        {/* RIGHT: Detail View */}
        <div className="lg:w-2/3">
          <AnimatedSection>
            <NoticeDetailView notice={selectedNotice} />
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}