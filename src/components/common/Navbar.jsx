import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from "../../assets/others/onlylogo.webp"
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academic' },
    { name: 'Cells & Units', path: '/cells-and-units' },
    { name: 'Notices', path: '/notices' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Facilities', path: '/facilities' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    
    <header className="sticky top-0 z-50 backdrop-blur-md bg-linear-to-br from-emerald-900/57 via-emerald-950/60 to-stone-950/70 border-brand-gray/50 px-8 py-2 flex justify-between items-center transition-all duration-300">
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
      <nav className="hidden xl:flex space-x-8 font-medium text-sm tracking-wide">
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
      </nav>

      {/* Mobile Toggle */}
      <button
        className="xl:hidden p-2 text-brand-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="xl:hidden absolute top-full left-0 w-full bg-brand-white border-b border-brand-gray/20 p-6 flex flex-col space-y-4 shadow-xl">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-brand-dark font-medium py-2"
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}