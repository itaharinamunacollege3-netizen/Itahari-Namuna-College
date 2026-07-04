import { Link } from 'react-router-dom';
import { Mail, Phone, Bell, ClipboardList } from 'lucide-react';

export default function Topbar() {
  return (
    <div
      className="w-full font-body text-brand-dark border-b border-amber-400/40"
     style={{ background: 'linear-gradient(135deg, #075F6C, #054a55, #054a55)' }}

    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-1.5 flex flex-row justify-end sm:justify-between items-center gap-1.5 sm:gap-0">

        {/* ── Left: Contact Info (hidden on mobile) ── */}
        <div className="hidden sm:flex flex-wrap justify-start items-center gap-3 sm:gap-5 text-[11.5px] font-medium text-brand-dark/90">

          {/* Phone */}
          <a
            href="tel:025-586701"
            className="flex items-center gap-1.5 text-brand-white hover:text-brand-white/70 transition-colors duration-300 group"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-dark/10 group-hover:bg-brand-primary/15 transition-colors duration-300">
              <Phone size={10} className="text-brand-white group-hover:text-brand-white transition-colors duration-300" />
            </span>
            <span>025-586701 / 585701</span>
          </a>

          {/* Separator */}
          <span className="hidden sm:inline-block w-px h-3 bg-brand-white/25 rounded-full" />

          {/* Email */}
          <a
            href="mailto:contact@namunacollege.edu.np"
            className="flex items-center gap-1.5 text-brand-white hover:text-brand-white/70 transition-colors duration-300 group"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-white/10 group-hover:bg-brand-white/15 transition-colors duration-300">
              <Mail size={10} className="text-brand-white group-hover:text-brand-white transition-colors duration-300" />
            </span>
            <span>contact@namunacollege.edu.np</span>
          </a>
        </div>

        {/* ── Right: Quick Links ── */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-semibold tracking-wide uppercase">

          {/* Notices Link */}
          <Link
            to="/notices"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold text-white shadow-sm hover:bg-brand-gold/85 hover:shadow-md hover:-translate-y-px transition-all duration-300"
          >
            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <Bell size={10} />
            <span>Notices</span>
          </Link>

          {/* Separator */}
          <span className="text-brand-dark/30 hidden sm:inline">·</span>

          {/* Results Link */}
          <Link
            to="/results"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-gold/30 bg-brand-gold/8 text-brand-gold hover:bg-brand-gold hover:text-white hover:border-brand-gold hover:shadow-md hover:-translate-y-px transition-all duration-300"
          >
            <ClipboardList size={10} />
            <span>Results</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
