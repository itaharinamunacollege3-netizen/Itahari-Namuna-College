import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from "../../assets/others/onlylogo.webp"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
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
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 px-8 py-2 flex justify-between items-center transition-all duration-500 border-brand-gray/50 ${
        isScrolled 
          ? 'bg-linear-to-tr from-emerald-900/70 via-emerald-950/70 to-stone-950/90 shadow-lg backdrop-blur-md' 
          : 'bg-linear-to-tr from-emerald-900 via-emerald-950 to-stone-950/90 backdrop-blur-md'
      }`}>
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/95 p-1.5 shadow-md ring-1 ring-white/30">
          <img src={logo} alt="Itahari Namuna College" className="h-full w-full object-contain" />
        </div>
        <div className="hidden sm:block">
          <p className="font-heading text-sm font-bold leading-tight text-brand-white">Itahari Namuna</p>
          <p className="text-[11px] text-brand-white/70">College</p>
        </div>
      </Link>

      {/* Desktop Links */}
      <nav className="hidden xl:flex items-center space-x-8 font-medium text-sm tracking-wide">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `font-body transition-all duration-300 relative pb-1 hover:text-brand-blue cursor-pointer ${isActive
                ? 'text-brand-blue font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-blue after:rounded-full'
                : 'text-brand-white/80'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
        <Link to="/admissions" className="ml-4 px-4 py-2 bg-linear-to-r from-brand-blue to-brand-blue/30 text-white rounded-md font-medium hover:opacity-90 transition-all duration-300 shadow-md">
          <span>Apply Now</span>
        </Link>
      </nav>

      {/* Mobile Toggle */}
      <button
        className="xl:hidden p-2 text-brand-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu - Smooth Transition */}
      <div 
        className={`xl:hidden absolute top-full left-0 w-full overflow-hidden bg-linear-to-br from-emerald-900 via-emerald-950 to-stone-950 transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-125 opacity-100 border-b border-white/10' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="p-6 flex flex-col items-center space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-brand-white/90 font-medium py-2 hover:text-brand-blue transition-colors"
            >
              {item.name}
            </NavLink>
          ))}
          <Link 
            to="/admissions" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 w-full text-center bg-linear-to-r from-brand-blue to-emerald-600 text-white px-4 py-3 rounded-md font-medium shadow-lg hover:opacity-90 transition-all"
          >
            <span>Apply Now</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}