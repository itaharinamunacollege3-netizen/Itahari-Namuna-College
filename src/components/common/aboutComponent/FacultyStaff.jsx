import { useState } from "react";
import AnimatedSection from "../../animations/AnimatedSection";
import { facultyStaffData } from "../aboutComponent/facultyStaffData";

const FacultyStaff = () => {
    const [activeFaculty, setActiveFaculty] = useState("BCA");
    const data = facultyStaffData[activeFaculty] || [];

    return (
        <AnimatedSection>
            <div className="space-y-8">
                {/* FILTER PILLS */}
                <div className="flex items-center flex-wrap pb-2 gap-2 scrollbar-hide">
                    {Object.keys(facultyStaffData).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveFaculty(key)}
                            className={`px-5 py-2  cursor-pointer rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap border ${activeFaculty === key
                                    ? "bg-[#006A38] text-white border-[#006A38]"
                                    : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                                }`}            >
                            {key} Faculty
                        </button>
                    ))}
                </div>

                {/* UNIFORM GRID - HOD appears first if placed first in data.js */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.map((m, i) => (
                        <div key={i} className="group relative bg-white border border-stone-200 rounded-2xl p-5 flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="w-full flex flex-col items-center">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/50 mb-4 flex items-center justify-center">
                                    <img loading="lazy" decoding="async" src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="text-center px-1">
                                    <h4 className="font-bold text-stone-800 text-sm leading-snug">{m.name}</h4>
                                    <p className="text-xs font-medium text-[#006A38] uppercase mt-1">{m.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};
export default FacultyStaff;