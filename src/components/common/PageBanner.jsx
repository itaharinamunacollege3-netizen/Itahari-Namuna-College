
const PageBanner = ({ title, subtitle }) => {
  return (
    <div className="relative w-full bg-linear-to-br from-emerald-900 via-emerald-950 to-stone-950 py-16 md:py-20 overflow-hidden border-b border-emerald-800/20">
      
      {/* Abstract Architectural Geometric Accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-12 -right-12 w-96 h-96 border-4 border-emerald-500 rounded-full" />
        <div className="absolute -bottom-24 -left-12 w-80 h-80 border border-emerald-400 rotate-45 transform" />
        <div className="absolute top-1/2 left-1/3 w-full h-px bg-linear-to-r from-transparent via-emerald-500 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-left">
        {/* Minimalist Path Tracker */}
        <div className="text-xs font-semibold text-emerald-400/80 tracking-wider uppercase mb-3 flex items-center gap-2">
          <span>Home</span>
          <span className="text-stone-500">/</span>
          <span className="text-stone-300">{title}</span>
        </div>

        {/* Banner Content Display */}
        <h1 className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-stone-100 tracking-tight max-w-4xl leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="font-body text-sm sm:text-base text-stone-400 font-medium max-w-2xl mt-2 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageBanner;