import { useState, useEffect } from "react";
import AnimatedSection from "../../animations/AnimatedSection";
import { getStaffPublic } from "../../common/aboutComponent/services/staffService"; // Ensure this service is created

const StaffTab = () => {
  const [staffData, setStaffData] = useState({});
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStaffPublic().then((data) => {
      setStaffData(data || {});
      const keys = Object.keys(data || {});
      if (keys.length > 0) setActiveCategory(keys[0]);
      setLoading(false);
    });
  }, []);

  const currentStaff = staffData[activeCategory] || [];

  if (loading) return <div className="text-center py-10">Loading Staff...</div>;

  if (Object.keys(staffData).length === 0) {
    return <div className="text-center py-20 text-stone-500">No staff data available.</div>;
  }

  return (
    <AnimatedSection>
      <div className="w-full space-y-8 relative z-10">
        {/* SUB-CATEGORY FILTER ROW */}
        <div className="flex items-center flex-wrap pb-2 gap-2 scrollbar-hide">
          {Object.keys(staffData).map((categoryName) => (
            <button
              key={categoryName}
              onClick={() => setActiveCategory(categoryName)}
              className={`px-5 py-2 cursor-pointer rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border ${
                activeCategory === categoryName
                  ? "bg-[#006A38] text-white border-[#006A38]"
                  : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
              }`}
            >
              {categoryName}
            </button>
          ))}
        </div>

        {/* STAFF GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentStaff.map((staff) => (
            <div
              key={staff.id}
              className="group relative bg-white border border-stone-200 rounded-2xl p-5 flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-full flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/50 mb-4 flex items-center justify-center">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={staff.photo ? `${import.meta.env.VITE_API_BASE_URL}/${staff.photo}` : "/placeholder.png"}
                    alt={staff.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1 text-center px-1">
                  <h4 className="font-bold text-stone-800 text-sm leading-snug">
                    {staff.name}
                  </h4>
                  <p className="text-xs font-medium text-[#006A38] uppercase tracking-wide">
                    {staff.role}
                  </p>
                  <p className="text-[11px] text-stone-400 font-medium">
                    {staff.department}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default StaffTab;