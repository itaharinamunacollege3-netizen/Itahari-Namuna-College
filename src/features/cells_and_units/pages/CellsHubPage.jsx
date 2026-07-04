import { useState, useEffect } from "react";
import { getUnits, getUnitCategories } from "../data/unitsService";
import CellOverviewCard from "../components/CellOverviewCard";
import PageBanner from "../../../components/common/PageBanner";
import AnimatedSection from "../../../components/animations/AnimatedSection";
// Define the brand color map for your 13 units
const colorMap = {
  cmc: "#1e40af",
  iqac: "#065f46",
  sat: "#b45309",
  rmc: "#7e22ce",
  emis: "#be123c",
  fpsmc: "#d97706",
  sqc: "#0f172a",
  eceasc: "#e11d48",
  scpsc: "#0891b2",
  lmsc: "#4338ca",
  srwsc: "#db2777",
  idmsc: "#16a34a",
  saessc: "#f59e0b",
};

export default function CellsHubPage() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [units, setUnits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [itemsPerPage] = useState(9); // 3x3 grid

  const loadUnits = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: itemsPerPage };
      if (activeFilter) params.categoryId = activeFilter;
      
      const unitsResponse = await getUnits(params);

      setUnits(unitsResponse.items || []);
      setMeta(unitsResponse.meta || {});
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to load units:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const cats = await getUnitCategories();
        if (!active) return;
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }

    load();
    // When category filter changes, reset to page 1
    setCurrentPage(1);
    loadUnits(1);
    return () => {
      active = false;
    };
  }, [activeFilter]); // Re-run when activeFilter changes

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > meta.totalPages) return;
    loadUnits(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* 1. Page Banner */}

        <PageBanner
          title="College Committees & Cells"
          subtitle="Explore our governance, academic support, and student engagement units."
          />
          <AnimatedSection>
          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Filter Buttons */}
            {categories.length > 0 && (
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="grid grid-cols-1 lg:flex gap-2 p-2 bg-stone-200/60 rounded-xl w-full md:flex lg:w-fit">
                  <button
                    key="all"
                    onClick={() => setActiveFilter(null)}
                    className={`px-4 py-3 rounded-xl cursor-pointer font-bold text-xs sm:text-sm transition-all ease-in-out whitespace-nowrap ${
                      !activeFilter
                      ? "bg-brand-primary text-white shadow-md"
                      : "text-stone-600 hover:text-stone-800 bg-white/50 lg:bg-transparent"
                    }`}
                  >
                    All Units
                  </button>
                  {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFilter(cat.id)}
                    className={`px-4 py-3 rounded-xl cursor-pointer font-bold text-xs sm:text-sm transition-all ease-in-out whitespace-nowrap ${
                      activeFilter === cat.id
                      ? "bg-brand-primary text-white shadow-md"
                      : "text-stone-600 hover:text-stone-800 bg-white/50 lg:bg-transparent"
                    }`}
                  >
                    {cat.name}
                  </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Grid Container */}
            {loading ? (
              <div className="py-20 text-center text-stone-500">Loading units...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {units.map((unit) => (
                    <AnimatedSection key={unit.id}>
                      <CellOverviewCard
                        unit={{ 
                          ...unit, 
                          id: unit.slug || unit.id, // Use slug or id for the link
                          icon: unit.iconUrl // Map iconUrl to icon for the card
                        }} 
                        borderColor={colorMap[unit.code?.toLowerCase()] || "#6b7280"}
                      />
                    </AnimatedSection>
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 rounded-lg border border-stone-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-stone-600">
                      Page {currentPage} of {meta.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= meta.totalPages}
                      className="px-4 py-2 rounded-lg border border-stone-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
    </AnimatedSection>
      </div>
  );
}
