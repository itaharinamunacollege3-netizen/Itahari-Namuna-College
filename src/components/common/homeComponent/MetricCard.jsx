import { useEffect, useRef } from 'react';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MetricCard() {
  const containerRef = useRef(null);

  useEffect(() => {
    const counters = containerRef.current.querySelectorAll('[data-target]');
    counters.forEach((counter) => {
      const targetVal = parseInt(counter.getAttribute('data-target'), 10);

      gsap.fromTo(counter, 
        { textContent: 0 },
        {
          textContent: targetVal,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: function() {
            if (counter.getAttribute('data-suffix')) {
              counter.textContent = Math.floor(this.targets()[0].textContent).toLocaleString() + counter.getAttribute('data-suffix');
            }
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const metricStats = [
    { icon: BookOpen, value: 8, suffix: '', label: 'TU Programs' },
    { icon: Users, value: 1800, suffix: '+', label: 'Enrolled Students' },
    { icon: Award, value: 98, suffix: '%', label: 'Pass Rate' },
    { icon: TrendingUp, value: 13, suffix: '+', label: 'Years of Excellence' }
  ];

  return (
    <section className="w-full bg-brand-white  py-10 shadow-xs">
      <div ref={containerRef} className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center justify-center text-center">
        {metricStats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <div key={idx} className="flex flex-col items-center space-y-3 group">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <IconComponent className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex flex-col space-y-1">
                <span
                  data-target={stat.value}
                  data-suffix={stat.suffix}
                  className="font-heading font-extrabold text-2xl sm:text-3xl text-brand-dark tabular-nums"
                >
                  0{stat.suffix}
                </span>
                <span className="font-body text-xs sm:text-sm text-brand-dark/60 font-medium tracking-wide">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}