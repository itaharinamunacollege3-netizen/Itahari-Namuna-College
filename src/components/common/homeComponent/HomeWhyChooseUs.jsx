import { School, Handshake, Globe, GraduationCap, DollarSign, Trophy } from 'lucide-react';

export default function HomeWhyChooseUs() {
  // Static data array explicitly matching the 6 value pillars shown in image_399be5.png
  const pillars = [
    {
      title: "Modern Infrastructure",
      description: "State-of-the-art labs, digital library, smart classrooms, and 24/7 wi-fi connectivity across campus.",
      icon: School
    },
    {
      title: "Industry Partnerships",
      description: "Direct MOUs with 50+ companies for internship placements, live projects, and graduate recruitment.",
      icon: Handshake
    },
    {
      title: "Global Exposure",
      description: "Study tours, international seminars, and exchange programs with partner institutions in Asia and Europe.",
      icon: Globe
    },
    {
      title: "Expert Faculty",
      description: "120+ qualified faculty with PhDs, industry experience, and active research publications.",
      icon: GraduationCap
    },
    {
      title: "Scholarship Support",
      description: "Merit-based and need-based scholarships covering up to 75% of tuition fees for eligible students.",
      icon: DollarSign
    },
    {
      title: "Award-Winning Campus",
      description: "Recognized as Best Managed Campus by TU and recipient of National Education Excellence Award 2023.",
      icon: Trophy
    }
  ];

  return (
    <section className="w-full bg-brand-dark py-16 text-brand-white border-b border-brand-dark/30">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER BLOCK: Centered Titles Matching image_399be5.png         */}
        {/* ========================================================================= */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-gold tracking-widest uppercase block">
            Why Itahari Namuna Campus
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-brand-white tracking-tight">
            A Campus Built for Your Future
          </h2>
        </div>

        {/* ========================================================================= */}
        {/* PILLARS GRID TRACK: Responsive 3-Column Box Grid Setup                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={idx}
                className="bg-[#1e2633]/60 border border-brand-white/5 rounded-2xl p-6 space-y-4 hover:bg-[#1e2633]/90 hover:border-brand-white/10 transition-all duration-300 group"
              >
                {/* Clean, uncontained icon presentation mimicking image_399be5.png layout */}
                <div className="text-brand-white group-hover:scale-105 transition-transform duration-300 origin-left">
                  <IconComponent className="w-6 h-6 stroke-[1.8]" />
                </div>
                
                {/* Content Block */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-brand-white tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-brand-gray/60 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}