import { useState, useEffect } from "react";
import { getFacilities, getFacilityCategories } from "../data/facilitiesService";
import FacilityRow from "../components/FacilityRow";
import PageBanner from "../../../components/common/PageBanner";
import AnimatedSection from "../../../components/animations/AnimatedSection";

const FacilitiesPage = () => {
  const [activeFilter, setActiveFilter] = useState("All Facilities");
  const [facilities, setFacilities] = useState([]);
  const [categories, setCategories] = useState(["All Facilities"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const [allFacilities, cats] = await Promise.all([
          getFacilities(),
          getFacilityCategories(),
        ]);

        if (!active) return;
        setFacilities(allFacilities);
        setCategories(["All Facilities", ...cats]);
      } catch (err) {
        console.error("Failed to load facilities:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const filteredData = activeFilter === "All Facilities"
    ? facilities
    : facilities.filter(item => item.category === activeFilter);

  return (

      <div className="min-h-screen bg-[#F7F6F3]">
      <PageBanner title="College Facilities" subtitle="Why Itahari Namuna Campus?" />

      <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Tab Filter - Responsive Grid */}
          <div className="flex justify-center lg:justify-start">
          <div className="grid grid-cols-1 lg:flex gap-2 p-2 bg-stone-200/60 rounded-xl w-full md:flex lg:w-fit">
              {categories.map((filter) => (
              <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-3 rounded-xl cursor-pointer font-bold text-xs sm:text-sm transition-all ease-in-out whitespace-nowrap ${
                  activeFilter === filter
                  ? "bg-[#006A38] text-white shadow-md"
                  : "text-stone-600 hover:text-stone-800 bg-white/50 lg:bg-transparent"
                  }`}
              >
                  {filter}
              </button>
              ))}
          </div>
          </div>

          {/* Alternating Rows */}
          {loading ? (
            <div className="py-20 text-center text-stone-500">Loading facilities...</div>
          ) : (
            <div className="space-y-12">
            {filteredData.map((facility, index) => (
                <FacilityRow
                key={facility.id}
                data={facility}
                isReversed={index % 2 !== 0}
                />
            ))}
            </div>
          )}
      </div>
      </div>

  );
};

export default FacilitiesPage;