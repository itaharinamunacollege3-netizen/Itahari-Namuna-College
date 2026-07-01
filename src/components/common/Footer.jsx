import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPrograms } from '../../features/academics/services/programsService';
import { Dot } from 'lucide-react';
import collegeLogo from '../../assets/others/onlylogo.webp';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6';

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
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <img 
              src={collegeLogo} 
              alt="Itahari Namuna College" 
              className="w-14 h-14 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
              style={{ filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.3))' }}
            />
            <div>
              <h3 className="font-heading font-bold text-lg text-white tracking-tight leading-tight">
                Itahari Namuna
              </h3>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400/80">College</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-stone-400 max-w-sm">
            Empowering academic growth and excellence through modern technical programs and a supportive structural community learning framework.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-brand-primary hover:border-brand-primary/50 transition-all duration-300 group">
              <FaFacebook className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors duration-300" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-brand-crimson hover:border-brand-crimson/50 transition-all duration-300 group">
              <FaInstagram className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors duration-300" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-brand-blue hover:border-brand-blue/50 transition-all duration-300 group">
              <FaLinkedin className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors duration-300" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-stone-700 hover:border-stone-600 transition-all duration-300 group">
              <FaXTwitter className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors duration-300" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/[0.08] hover:bg-red-600 hover:border-red-500/50 transition-all duration-300 group">
              <FaYoutube className="w-4 h-4 text-stone-400 group-hover:text-white transition-colors duration-300" />
            </a>
          </div>
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