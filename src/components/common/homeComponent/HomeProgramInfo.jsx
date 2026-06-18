import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Utensils, Briefcase, Users, ArrowRight } from 'lucide-react';

export default function HomeProgramInfo() {
  // Static data array structured explicitly to map the colors, icons, and layout in image_39fdf7.png
  const programs = [
    {
      id: 'bca',
      code: 'BCA',
      title: 'Bachelor of Computer Application',
      description: 'Cutting-edge curriculum in software, AI, and web technologies with industry-integrated labs.',
      duration: '4 Years',
      seats: '60 Seats',
      icon: Code,
      theme: {
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        iconColor: 'text-blue-500'
      }
    },
    {
      id: 'bhm',
      code: 'BHM',
      title: 'Bachelor of Hotel Management',
      description: 'Hospitality excellence with hands-on internship placements at 5-star hotels nationwide.',
      duration: '4 Years',
      seats: '48 Seats',
      icon: Utensils,
      theme: {
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        iconColor: 'text-amber-500'
      }
    },
    {
      id: 'bbm',
      code: 'BBM',
      title: 'Bachelor of Business Management',
      description: 'Strategic management, entrepreneurship, and finance for tomorrow\'s business leaders.',
      duration: '4 Years',
      seats: '72 Seats',
      icon: Briefcase,
      theme: {
        text: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        iconColor: 'text-emerald-500'
      }
    },
    {
      id: 'bsw',
      code: 'BSW',
      title: 'Bachelor of Social Work',
      description: 'Community-centered education in welfare, development, and humanitarian service.',
      duration: '4 Years',
      seats: '36 Seats',
      icon: Users,
      theme: {
        text: 'text-rose-600',
        bg: 'bg-rose-50',
        border: 'border-rose-100',
        iconColor: 'text-rose-500'
      }
    }
  ];

  return (
    <section className="w-full bg-brand-gray/40 py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* ========================================================================= */}
        {/* HEADER BLOCK: Title and Redirect Action Button Row                        */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-blue tracking-widest uppercase block">
              Our Academic Programs
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-brand-dark tracking-tight">
              TU-Affiliated Undergraduate Degrees
            </h2>
          </div>
          
          <Link
            to="/academic"
            className="inline-flex items-center justify-center space-x-2 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 group self-start md:self-auto"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ========================================================================= */}
        {/* CARDS GRID TRACK: 4 Column Fixed Responsive Display Layer               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program) => {
            const IconComponent = program.icon;
            return (
              <div 
                key={program.id}
                className="bg-brand-white border border-brand-gray rounded-2xl p-6 flex flex-col justify-between min-h-85 shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                {/* Upper Body Segment: Icon, Label Code, Title, Description */}
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-xl ${program.theme.bg} border ${program.theme.border} flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${program.theme.iconColor}`} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className={`text-xs font-bold tracking-wider uppercase block ${program.theme.text}`}>
                      {program.code}
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-brand-dark leading-snug">
                      {program.title}
                    </h3>
                  </div>

                  <p className="font-body text-xs sm:text-sm text-brand-dark/60 leading-relaxed">
                    {program.description}
                  </p>
                </div>

                {/* Bottom Metrics Border Divider Row */}
                <div className="border-t border-brand-gray/60 pt-4 mt-6 flex justify-between text-left">
                  <div>
                    <span className={`text-xs font-bold block ${program.theme.text}`}>
                      {program.duration}
                    </span>
                    <span className="text-[11px] font-medium text-brand-dark/40 uppercase tracking-wider block">
                      Duration
                    </span>
                  </div>
                  <div>
                    <span className={`text-xs font-bold block ${program.theme.text}`}>
                      {program.seats}
                    </span>
                    <span className="text-[11px] font-medium text-brand-dark/40 uppercase tracking-wider block">
                      Available
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}