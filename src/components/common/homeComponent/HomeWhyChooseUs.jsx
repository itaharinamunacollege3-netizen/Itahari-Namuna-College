import { School, Handshake, Globe, GraduationCap, DollarSign, Trophy } from 'lucide-react';

export default function HomeWhyChooseUs() {
  const pillars = [
    { title: "Modern Infrastructure", description: "State-of-the-art labs, digital library, smart classrooms, and 24/7 wi-fi connectivity across campus.", icon: School },
    { title: "Industry Partnerships", description: "Direct MOUs with 50+ companies for internship placements, live projects, and graduate recruitment.", icon: Handshake },
    { title: "Global Exposure", description: "Study tours, international seminars, and exchange programs with partner institutions in Asia and Europe.", icon: Globe },
    { title: "Expert Faculty", description: "120+ qualified faculty with PhDs, industry experience, and active research publications.", icon: GraduationCap },
    { title: "Scholarship Support", description: "Merit-based and need-based scholarships covering up to 75% of tuition fees for eligible students.", icon: DollarSign },
    { title: "Award-Winning Campus", description: "Recognized as Best Managed Campus by TU and recipient of National Education Excellence Award 2023.", icon: Trophy }
  ];

  return (
    <section className="w-full bg-brand-white py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-brand-orange tracking-[0.2em] uppercase block">
            Why Itahari Namuna Campus
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-brand-dark tracking-tight">
            A Campus Built for Your Future
          </h2>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={idx}
                className="group flex flex-col items-start p-8 rounded-3xl bg-brand-gray/50 hover:bg-brand-gray transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-6 p-3 rounded-2xl bg-brand-white shadow-sm text-brand-gold">
                  <IconComponent className="w-6 h-6 stroke-[1.8]" />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-lg text-brand-dark tracking-wide">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-sm text-brand-dark/70 leading-relaxed">
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