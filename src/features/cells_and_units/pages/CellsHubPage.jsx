import { unitsData } from "../data/unitaData"; // Assuming the data structure we built
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
  return (
    <div className="min-h-screen bg-gray-50">
        {/* 1. Page Banner */}

        <PageBanner
          title="College Committees & Cells"
          subtitle="Explore our governance, academic support, and student engagement units."
          />
          <AnimatedSection>

        {/* 2. Grid Container */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(unitsData).map(([key, unit]) => (
              <AnimatedSection>
                <CellOverviewCard
                  key={key} // Use the object key (cmc, iqac, etc.)
                  unit={{ ...unit, id: key }} // Pass the key as the id into the unit prop
                  borderColor={colorMap[key] || "#6b7280"}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
    </AnimatedSection>
      </div>
  );
}
