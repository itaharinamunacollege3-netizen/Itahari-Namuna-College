import { useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import LeadershipTab from "../../components/common/aboutComponent/LeadershipTab";
import VisionMissionTab from "../../components/common/aboutComponent/VisionMissionTab";
import StaffTab from "../../components/common/aboutComponent/StaffTab";
import AnimatedSection from "../../components/animations/AnimatedSection"
import FacultyStaff from "../../components/common/aboutComponent/FacultyStaff";
const AboutPage = () => {
  const [activeTab, setActiveTab] = useState("leadership");

  // Array of options to cleanly map out the tabs and handle shifting positioning
  const tabsConfig = [
    { id: "leadership", label: "Leadership & Governance" },
    { id: "vision", label: "Vision & Mission" },
    { id: "facultyStaff", label: "Faculty Staff" },
    { id: "staff", label: "Administrative Staff" },
  ];

  // Helper calculation to slide the background highlight pill based on index position
  const getActiveIndex = () =>
    tabsConfig.findIndex((tab) => tab.id === activeTab);

  return (
    <AnimatedSection>
      <div className="w-full bg-stone-50 min-h-screen pb-20">
        <PageBanner
          title="About Our Institution"
          subtitle="Built on a legacy of trust, quality, and service — Itahari Namuna College."
        />
        <div className="max-w-7xl mx-auto px-6 mt-12 text-left">
          {/* PREMIUM SLIDING PILL SWITCHER CONTAINER */}
          {/* PREMIUM SLIDING PILL SWITCHER CONTAINER */}
          <div className="inline-block w-full sm:w-auto bg-stone-200/60 p-1.5 rounded-2xl border border-stone-200/60 relative overflow-hidden backdrop-blur-xs">

            {/* GRID CONTAINER: Ensures perfect alignment for the sliding pill */}
            <div
              role="tablist"
              className="grid grid-cols-1 sm:grid-cols-4 gap-1 relative z-10"
            >
              {/* THE SLIDING ACCENT PILL: Now transitions based on grid columns */}
              <div
                className="absolute top-0 bottom-0 bg-white shadow-md shadow-stone-300/60 rounded-xl transition-all duration-300 ease-out pointer-events-none hidden sm:block"
                style={{
                  width: `calc(25% - 0.375rem)`,
                  transform: `translateX(${getActiveIndex() * 100}%)`,
                }}
              />

              {/* TAB BUTTON TRIGGER HOOKS */}
              {tabsConfig.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  className={`relative z-10 font-heading font-bold cursor-pointer text-xs sm:text-sm px-4 h-9 transition-colors duration-300 focus:outline-hidden whitespace-nowrap flex items-center justify-center ${activeTab === tab.id
                      ? "text-emerald-800"
                      : "text-stone-500 hover:text-stone-800"
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT ENVELOPE: Smoothly glides and fades up whenever a tab changes */}
          <div className="mt-10 w-full">
            {activeTab === "leadership" && (
              <div className="animate-fade-in-up">
                {/* <LeadershipTab /> */}
                <LeadershipTab />
              </div>
            )}

            {activeTab === "vision" && (
              <div className="animate-fade-in-up">
                {/* <VisionTab /> */}
                <VisionMissionTab />
              </div>
            )}
            {activeTab === "facultyStaff" && (
              <div className="animate-fade-in-up">
                {/* <faculty staff /> */}
                <FacultyStaff />
              </div>
            )}

            {activeTab === "staff" && (
              <div className="animate-fade-in-up">
                {/* <StaffTab /> */}
                <StaffTab />
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default AboutPage;
