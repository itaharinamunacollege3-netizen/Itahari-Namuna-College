import { useState, useEffect } from "react";
import AnimatedSection from "../../animations/AnimatedSection";
import { getFacultyPublic } from "../../../components/common/aboutComponent/services/facultyService";

const FacultyStaff = () => {
    const [facultyData, setFacultyData] = useState({});
    const [activeFaculty, setActiveFaculty] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFacultyPublic()
            .then((data) => {
                setFacultyData(data || {});
                const keys = Object.keys(data || {});
                if (keys.length > 0) setActiveFaculty(keys[0]);
            })
            .catch((err) => {
                console.error("Error fetching faculty:", err);
                setFacultyData({});
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const data = facultyData[activeFaculty] || [];

    if (loading) return <div className="text-center py-10">Loading Faculty...</div>;

    if (Object.keys(facultyData).length === 0) {
        return <div className="text-center py-20 text-stone-500">No faculty data available.</div>;
    }

    // console.log("Fetched Faculty Data:", facultyData);
    return (
        <AnimatedSection>
            <div className="space-y-8">
                {/* FILTER PILLS */}
                <div className="flex items-center flex-wrap pb-2 gap-2 scrollbar-hide">
                    {Object.keys(facultyData).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveFaculty(key)}
                            className={`px-3 py-2 md:px-5 md:py-2  cursor-pointer rounded-full text-[12px] md:text-sm font-bold transition-all duration-300 whitespace-nowrap border ${activeFaculty === key
                                ? "bg-[#006A38] text-white border-[#006A38]"
                                : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                                }`}

                        >
                            {String(key).replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())} Faculty
                        </button>
                    ))}
                </div>

                {/* UNIFORM GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.map((m, i) => (
                        <div key={m.id ?? i} className="group relative bg-white border border-stone-200 rounded-2xl p-5 flex flex-col items-center justify-between shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="w-full flex flex-col items-center">
                                <div className="w-52 h-52 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/50 mb-4 flex items-center justify-center">
                                    <img
                                        loading="lazy"
                                        decoding="async"
                                        src={m.image || "/placeholder.png"}
                                        alt={m.name}
                                        className="w-full h-full object-cover group-hover:scale-107 transition-transform duration-350"
                                    />
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