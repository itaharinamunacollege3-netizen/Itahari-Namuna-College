import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Utensils, Briefcase, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { getPrograms } from '../../../features/academics/services/programsService';

const THEMES = {
  blue: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', iconColor: 'text-blue-500' },
  amber: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', iconColor: 'text-amber-500' },
  emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', iconColor: 'text-emerald-500' },
  rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', iconColor: 'text-rose-500' },
};

const PRESENTATION = {
  BCA: { icon: Code, theme: THEMES.blue },
  BHM: { icon: Utensils, theme: THEMES.amber },
  BBM: { icon: Briefcase, theme: THEMES.emerald },
  BSW: { icon: Users, theme: THEMES.rose },
};

const FALLBACK_THEMES = [THEMES.blue, THEMES.amber, THEMES.emerald, THEMES.rose];

function presentationFor(code, index) {
  return PRESENTATION[code] ?? { icon: GraduationCap, theme: FALLBACK_THEMES[index % FALLBACK_THEMES.length] };
}

export default function HomeProgramInfo() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    let active = true;
    getPrograms().then((data) => {
      if (active) setPrograms(Array.isArray(data) ? data.slice(0, 4) : []);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="w-full bg-brand-gray/40 py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => {
            const { icon: IconComponent, theme } = presentationFor(program.code, index);
            const description = program.tagline || program.overview || '';
            const seats = program.seats ? `${program.seats} Seats` : null;
            return (
              <Link
                to={`/academic/${program.id}`}
                key={program.id}
                className="bg-brand-white border border-brand-gray rounded-2xl p-6 flex flex-col justify-between min-h-85 shadow-xs hover:shadow-md transition-shadow duration-300"
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-xl ${theme.bg} border ${theme.border} flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${theme.iconColor}`} />
                  </div>

                  <div className="space-y-1.5">
                    <span className={`text-xs font-bold tracking-wider uppercase block ${theme.text}`}>
                      {program.code}
                    </span>
                    <h3 className="font-heading font-extrabold text-lg text-brand-dark leading-snug">
                      {program.title}
                    </h3>
                  </div>

                  <p className="font-body text-xs sm:text-sm text-brand-dark/60 leading-relaxed line-clamp-3">
                    {description}
                  </p>
                </div>

                <div className="border-t border-brand-gray/60 pt-4 mt-6 flex justify-between text-left">
                  <div>
                    <span className={`text-xs font-bold block ${theme.text}`}>
                      {program.duration || '—'}
                    </span>
                    <span className="text-[11px] font-medium text-brand-dark/40 uppercase tracking-wider block">
                      Duration
                    </span>
                  </div>
                  {seats && (
                    <div>
                      <span className={`text-xs font-bold block ${theme.text}`}>
                        {seats}
                      </span>
                      <span className="text-[11px] font-medium text-brand-dark/40 uppercase tracking-wider block">
                        Available
                      </span>
                    </div>
                  )}
                </div>

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
