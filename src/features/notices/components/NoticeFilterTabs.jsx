// src/features/notices/components/NoticeFilterTabs.jsx
import { Search } from 'lucide-react';

export default function NoticeFilterTabs({
  categories = ['All'],
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory
}) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" size={18} />
        <input
          type="text"
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-brand-white border border-brand-gray/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 transition-all text-sm font-body"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-brand-primary text-brand-white'
                : 'bg-brand-gray/10 text-brand-dark/70 hover:bg-brand-gray/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}