import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrograms } from '../../features/academics/services/programsService';
import { Dot } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [programs, setPrograms] = useState([]);

    const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academic' },
    { name: 'Notices', path: '/notices' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    getPrograms().then(setPrograms);
  }, []);

  return (
    <footer className="bg-linear-to-b from-emerald-900 via-emerald-950 to-stone-950/85 text-stone-300 pt-16 pb-8 border-t border-stone-800 font-body">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-stone-800 pb-12">
        
        {/* Branding Panel */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-xl text-white tracking-tight">
            Itahari Namuna College
          </h3>
          <p className="text-sm leading-relaxed text-stone-400 max-w-sm">
            Empowering academic growth and excellence through modern technical programs and a supportive structural community learning framework.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-emerald-400">Quick Links</h4>
          <div className="flex flex-col space-y-3 text-sm ">
            {navItems.map((item) => (
              <Link className="hover:text-emerald-400 flex items-center" key={item.name} to={item.path}>
                <Dot className="text-brand-gray/50" /> {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Dynamic Program Links */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-emerald-400">
            Academic Programs
          </h4>
          <div className="flex flex-col space-y-3 text-sm">
            {programs.map((program) => (
              <Link 
                key={program.id} 
                to={`/academic/${program.id}`} 
                className="hover:text-emerald-400 transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="w-1 h-1 rounded-full bg-stone-700 group-hover:bg-[#006A38]" />
                {program.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-emerald-400">
            Contact Channels
          </h4>
          <div className="flex flex-col space-y-3 text-sm text-stone-400">
            <p className="hover:text-white transition-colors">Itahari, Sunsari, Nepal</p>
            <p className="hover:text-white transition-colors">Tel: 025-586701/585701</p>
            <p className="hover:text-white transition-colors">Email: contact@namunacollege.edu.np</p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 gap-4">
        <p>&copy; {currentYear} Itahari Namuna College. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="uppercase tracking-widest">Affiliated with Tribhuvan University</span>
        </div>
      </div>
    </footer>
  );
}