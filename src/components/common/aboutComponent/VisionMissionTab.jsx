import React from 'react';
import { 
  Eye, 
  Target, 
  Compass, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  Cpu, 
  Search 
} from 'lucide-react';
import AnimatedSection from '../../animations/AnimatedSection';

const VisionMissionTab = () => {
  // Objectives split out into clean, scannable value cards inspired by image_2b105d.png
  const objectives = [
    {
      icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      title: "Global Standards",
      desc: "To establish an ideal education center that offers a learning environment of global standard in various programs."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      title: "Ethics & Discipline",
      desc: "To nurture self-confidence, self-discipline, and ethics of the student helping them become a responsible citizen."
    },
    {
      icon: <Briefcase className="w-5 h-5 text-sky-600" />,
      title: "Career Competence",
      desc: "To prepare students for challenging and rewarding careers by providing quality and competence-based educational programs."
    },
    {
      icon: <Award className="w-5 h-5 text-purple-600" />,
      title: "Proactive Graduates",
      desc: "To produce proactive graduates enshrined with integrated personalities to meet the changing needs of global employers."
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
      title: "ICT & Research",
      desc: "To integrate information, communication, technology (ICT), and research-based education into modern physical facilities."
    },
    {
      icon: <Search className="w-5 h-5 text-rose-600" />,
      title: "Faculty Development",
      desc: "To promote and support research and scholarship, academic freedom, and continuous professional faculty development."
    }
  ];

  return (
    <AnimatedSection>
    <div className="w-full space-y-10 text-left relative z-10">
      
      {/* SECTION 1: ASYMMETRIC TOP ROW SPLIT (Inspired by image_2b105d.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Vision Card with soft organic green gradient */}
        <div className="lg:col-span-5 p-8 bg-linear-to-br from-white/95 via-emerald-50/10 to-emerald-900/5 border border-emerald-100 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-5">
              <Eye className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="font-heading font-bold text-stone-800 text-xl tracking-tight">Our Vision</h2>
            <p className="mt-4 font-body text-stone-600 text-sm leading-relaxed">
              To establish itself as an ideal education institution by offering quality education and preparing globally competent human resources that can transform the society.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-emerald-100/50 text-[11px] font-bold tracking-wider text-emerald-600/70 uppercase">
            INC • Transforming Society
          </div>
        </div>

        {/* Right Column: Mission Card with premium rose/wine accent tint */}
        <div className="lg:col-span-7 p-8 bg-linear-to-br from-white/95 via-rose-50/15 to-blue-900/5 border border-rose-100 rounded-3xl shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center mb-5">
            <Target className="w-5 h-5 text-rose-600" />
          </div>
          <h2 className="font-heading font-bold text-stone-800 text-xl tracking-tight">Our Mission</h2>
          <p className="mt-3 font-body text-stone-600 text-sm leading-relaxed">
            Provide excellent educational opportunities that are responsive to the needs of the community and help students meet economic, social, and environmental challenges to become active participants in shaping the world in the future.
          </p>

          {/* Institutional Goals nested directly into the Mission framework */}
          <div className="mt-6 pt-5 border-t border-stone-200/60 space-y-3.5">
            <h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase">Core Institutional Goals</h4>
            
            <div className="flex items-start gap-3">
              <span className="flex-none mt-1 text-xs text-rose-500">✓</span>
              <p className="font-body text-stone-600 text-xs sm:text-sm">
                Develop and maintain educational quality by strengthening the teaching-learning process and environment.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="flex-none mt-1 text-xs text-rose-500">✓</span>
              <p className="font-body text-stone-600 text-xs sm:text-sm">
                Development of capable human resources by nurturing potential in every student individually and collectively.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-none mt-1 text-xs text-rose-500">✓</span>
              <p className="font-body text-stone-600 text-xs sm:text-sm">
                Ensure academic and managerial efficiency and effectiveness for providing a conducive teaching-learning environment.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: OBJECTIVES CORE MATRIX MATRIX (Matching lower grid of image_2b105d.png) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-1">
          <Compass className="w-4 h-4 text-sky-500" />
          <h3 className="text-xs font-bold tracking-widest text-stone-400 uppercase">Core Objectives</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {objectives.map((obj, idx) => (
            <div 
              key={idx}
              className="p-5 bg-stone-50/40 backdrop-blur-md border border-stone-200/60 rounded-2xl flex gap-4 items-start shadow-2xs hover:border-stone-300/80 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center flex-none mt-0.5">
                {obj.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-stone-800 text-sm tracking-tight">
                  {obj.title}
                </h4>
                <p className="font-body text-stone-500 text-xs sm:text-sm leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
    </AnimatedSection>
  );
};

export default VisionMissionTab;