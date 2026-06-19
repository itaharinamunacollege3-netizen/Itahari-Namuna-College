import React from "react";
import AnimatedSection from "../../../components/animations/AnimatedSection";

const FacilityRow = ({ data, isReversed }) => {
  return (
    // Added 'flex-col' by default, 'lg:flex-row' for larger screens
    <AnimatedSection>
        <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 py-12 lg:py-20 items-center ${isReversed ? "lg:flex-row-reverse" : ""}`}>
        
        {/* IMAGE SIDE */}
        <div className="w-full lg:w-1/2 relative">
            <div className="overflow-hidden rounded-2xl lg:rounded-3xl border border-stone-200 shadow-lg">
            <img 
                src={data.image} 
                alt={data.title} 
                // Changed h-[400px] to aspect-video for fluid scaling
                className="w-full aspect-4/3 lg:aspect-video object-cover hover:scale-105 transition-transform duration-700" 
            />
            </div>
            {/* Index Badge - slightly smaller on mobile */}
            <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 bg-[#006A38] text-white w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl lg:rounded-2xl font-bold text-xl lg:text-2xl shadow-lg z-10">
            {data.index}
            </div>
        </div>

        {/* CONTENT SIDE */}
        <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6">
            <span className="inline-block text-[#006A38] font-bold tracking-wider uppercase text-[10px] lg:text-xs border border-[#006A38] px-3 py-1 rounded-full">
            {data.category}
            </span>
            
            <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-800 leading-tight">{data.title}</h2>
            <p className="text-sm lg:text-lg italic text-[#006A38] mt-2">{data.tagline}</p>
            </div>

            <div className="text-sm lg:text-base text-stone-600 leading-relaxed space-y-3 lg:space-y-4">
            <p>{data.descriptionPart1}</p>
            <p>{data.descriptionPart2}</p>
            </div>

            {/* TECH SPECS LIST - Responsive Grid */}
            <div className="pt-2 lg:pt-4 border-t border-stone-200">
            <h4 className="font-bold text-stone-800 mb-3 uppercase text-[10px] lg:text-sm">Technical Specs</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                {data.specs.map((spec, i) => (
                <li key={i} className="flex items-center text-xs lg:text-sm font-mono text-stone-700">
                    <span className="text-[#006A38] mr-2">➜</span> {spec}
                </li>
                ))}
            </ul>
            </div>
        </div>
        </div>
    </AnimatedSection>
  );
};

export default FacilityRow;