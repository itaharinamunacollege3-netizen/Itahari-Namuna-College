import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const ProgramCard = ({ program, onExplore }) => {
  // Color presets tailored to each program type based on image_2a239f.jpg
  const badgeColors = {
    bit: "bg-emerald-600",
    bca: "bg-[#2563EB]", // Blue badge as seen in image_2a239f.jpg
    bhm: "bg-[#EA580C]", // Orange badge as seen in image_2a239f.jpg
    bbs: "bg-purple-600",
    bsw: "bg-rose-600",
  };

  const tagThemes = {
    bit: "text-emerald-700 bg-emerald-50 border-emerald-100",
    bca: "text-sky-700 bg-sky-50 border-sky-100",
    bhm: "text-amber-700 bg-amber-50 border-amber-100",
    bbs: "text-purple-700 bg-purple-50 border-purple-100",
    bsw: "text-rose-700 bg-rose-50 border-rose-100",
  };

  const currentBadgeColor = badgeColors[program.id] || "bg-stone-600";
  const currentTagTheme =
    tagThemes[program.id] || "text-stone-700 bg-stone-50 border-stone-100";

  return (
    <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-300 text-left h-full">
      {/* CARD TOP: IMAGE CONTAINER WITH FLOATING BADGES */}
      <div className="relative h-48 sm:h-52 w-full bg-stone-100 overflow-hidden">
        {/* Deep background gradient mask overlay for stark white typography contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-stone-900/20 to-transparent z-10" />

        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover"
        />

        {/* Floating Program Shortcode Name Badge (Left side) */}
        <div
          className={`absolute top-4 left-4 z-20 ${currentBadgeColor} text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider`}
        >
          {program.id}
        </div>

        {/* Floating Duration Frame Indicator (Right side) */}
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-xs text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-2xs">
          {program.duration}
        </div>

        {/* Title Text anchored directly inside the image base framework */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <h2 className="font-heading font-bold text-white text-lg sm:text-xl tracking-tight drop-shadow-xs">
            {program.title}
          </h2>
        </div>
      </div>

      {/* CARD BOTTOM: SYLLABUS META & ACTION BAR HEADER LINK */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3.5">
          {/* University Affiliation Track */}
          <div className="flex items-center gap-2 text-[#006A38] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-none" />
            <span>{program.university}</span>
          </div>

          {/* Core Descriptive Context */}
          <p className="font-body text-stone-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
            {program.overview}
          </p>

          {/* Micro-Curriculum Core Tag Bundles */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {program.highlights?.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-md border ${currentTagTheme} max-w-full truncate`}
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        {/* Green-themed Action Outline Trigger conforming exactly to image_2a239f.jpg */}

        <button
          onClick={(e) => {
            e.preventDefault(); // Stop any parent form/link actions
            e.stopPropagation(); // Stop the event from bubbling up
            onExplore(program.id);
          }}
          className="w-full py-2.5 px-4 border border-[#006A38] text-[#006A38] font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-50/40 transition-all duration-200 cursor-pointer mt-auto"
        >
          <span>Explore {program.id.toUpperCase()} Program</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;
