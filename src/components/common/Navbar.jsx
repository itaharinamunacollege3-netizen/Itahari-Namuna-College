import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, FileText } from 'lucide-react';
import logo from "../../assets/others/onlylogo.webp";
import incLogo from '../../assets/others/INC LOGO.png'
const publicationsDropdown = [
  {
    name: 'Blog',
    path: '/publications/blog',
    description: 'Stories, insights & campus life',
    icon: FileText,
  },
  {
    name: 'Journal',
    path: '/publications/journal',
    description: 'Peer-reviewed academic research',
    icon: BookOpen,
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPubDropdownOpen, setIsPubDropdownOpen] = useState(false);
  const [isMobilePubOpen, setIsMobilePubOpen] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();

  const isPublicationsActive = location.pathname.startsWith('/publications');

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/academic' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Cells & Units', path: '/cells-and-units' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Publications', path: '/publications', hasDropdown: true },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsPubDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobilePubOpen(false);
  }, [location.pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 border-brand-gray/50 ${isScrolled
      ? 'bg-brand-white/70 backdrop-blur-md shadow-md border-b py-3'
      : 'bg-brand-white py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          {/* <img
            src={logo}
            alt="Itahari Namuna College"
            className="h-16 w-16 shrink-0 object-contain"
          />
          <div className="hidden sm:flex flex-col justify-center">
            <p className="font-heading text-[17px] font-bold leading-tight tracking-tight text-brand-dark">Itahari Namuna </p>
            <span className='text-[15px] font-bold leading-tight tracking-tight text-brand-dark/80'>College</span>
          </div> */}
          <img src={incLogo} alt="" className="w-45 shrink-0 object-contain bg-blend-screen" />
        </Link>

      {/* Desktop Links */}
      <nav className="hidden xl:flex items-center space-x-8 font-medium text-sm tracking-wide">
        {navItems.map((item) => {
          if (item.hasDropdown) {
            return (
              <div
                key={item.name}
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setIsPubDropdownOpen(true)}
                onMouseLeave={() => setIsPubDropdownOpen(false)}
              >
                {/* Trigger */}
                <button
                  className={`font-body transition-all duration-300 relative pb-1 flex items-center gap-1 hover:text-brand-primary cursor-pointer ${isPublicationsActive
                    ? 'text-brand-primary font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-primary after:rounded-full'
                    : 'text-brand-dark/80'
                  }`}
                >
                  {item.name}
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${isPubDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Invisible bridge fills the mt gap so mouse doesn't leave the parent */}
                <div className="absolute top-full left-0 w-full h-3" />

                {/* Dropdown Panel */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-brand-white rounded-xl shadow-xl border border-brand-gray/60 overflow-hidden transition-all duration-200 origin-top ${isPubDropdownOpen
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {/* Arrow */}
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-white border-l border-t border-brand-gray/60 rotate-45" />

                  <div className="p-2">
                    {publicationsDropdown.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => setIsPubDropdownOpen(false)}
                          className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-brand-gray/50 group transition-colors duration-150"
                        >
                          <span className="mt-0.5 p-1.5 rounded-md bg-brand-primary/10 group-hover:bg-brand-primary/15 transition-colors duration-150">
                            <Icon size={13} className="text-brand-primary" />
                          </span>
                          <div>
                            <p className="font-body font-semibold text-brand-dark text-sm group-hover:text-brand-primary transition-colors duration-150">
                              {sub.name}
                            </p>
                            <p className="font-body text-xs text-brand-dark/50 mt-0.5 leading-snug">
                              {sub.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `font-body transition-all duration-300 relative pb-1 hover:text-brand-primary cursor-pointer ${isActive
                  ? 'text-brand-primary font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-primary after:rounded-full'
                  : 'text-brand-dark/80'
                }`
              }
            >
              {item.name}
            </NavLink>
          );
        })}

        <Link to="/admissions" className="ml-4 px-4 py-2 bg-brand-gold text-white rounded-md font-medium hover:opacity-90 transition-all duration-300 shadow-md">
          <span>Apply Now</span>
        </Link>
      </nav>

      {/* Mobile Toggle */}
      <button
        className="xl:hidden p-2 text-brand-dark"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      </div>{/* end max-w-7xl container */}

      {/* Mobile Menu */}
      <div
        className={`xl:hidden absolute top-full left-0 w-full overflow-hidden bg-brand-white transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[600px] opacity-100 border-b border-brand-dark drop-shadow-brand-dark' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="p-6 flex flex-col items-center space-y-4">
          {navItems.map((item) => {
            if (item.hasDropdown) {
              return (
                <div key={item.name} className="w-full flex flex-col items-center">
                  <button
                    onClick={() => setIsMobilePubOpen(!isMobilePubOpen)}
                    className={`flex items-center gap-1.5 py-2 font-medium transition-colors ${isPublicationsActive ? 'text-brand-primary' : 'text-brand-dark/90'} hover:text-brand-primary`}
                  >
                    {item.name}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${isMobilePubOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Mobile Sub-links */}
                  <div
                    className={`overflow-hidden transition-all duration-300 w-full ${isMobilePubOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="flex flex-col items-center gap-2 pt-1 pb-2">
                      {publicationsDropdown.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          onClick={() => { setIsMobileMenuOpen(false); setIsMobilePubOpen(false); }}
                          className="text-sm font-body text-brand-dark/70 hover:text-brand-primary transition-colors py-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-brand-dark/90 font-medium py-2 hover:text-brand-primary transition-colors"
              >
                {item.name}
              </NavLink>
            );
          })}

          <Link
            to="/admissions"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 w-full text-center bg-linear-to-tr from-[#075F6C]/90 via-[#054a55] to-[#0a0a0a]/90 text-white px-4 py-3 rounded-md font-medium shadow-lg hover:opacity-90 transition-all"
          >
            <span>Apply Now</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}