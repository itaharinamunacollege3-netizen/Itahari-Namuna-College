import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-primary text-brand-white pt-12 pb-6 border-t border-brand-primary/20 font-body">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-brand-white/10 pb-10">
        
        {/* Identity Panel Summary Frame */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-heading font-extrabold text-lg tracking-tight">
            Itahari Namuna College
          </h3>
          <p className="text-sm text-brand-white/80 leading-relaxed max-w-sm">
            Empowering academic growth and excellence through modern technical programs and a supportive structural community learning framework.
          </p>
        </div>

        {/* Academic Program Resource Link Column */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-gold">
            Academic Programs
          </h4>
          <div className="flex flex-col space-y-2 text-sm text-brand-white/80">
            <Link to="/academic/bca" className="hover:text-brand-blue transition-colors duration-200">Bachelor of Computer Applications (BCA)</Link>
            <Link to="/academic/bhm" className="hover:text-brand-blue transition-colors duration-200">Bachelor of Hotel Management (BHM)</Link>
            <Link to="/academic/bbm" className="hover:text-brand-blue transition-colors duration-200">Bachelor of Business Management (BBM)</Link>
            <Link to="/academic/bsw" className="hover:text-brand-blue transition-colors duration-200">Bachelor of Social Work (BSW)</Link>
          </div>
        </div>

        {/* Contact Connectivity Layout Block */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-gold">
            Contact Channels
          </h4>
          <div className="flex flex-col space-y-2 text-sm text-brand-white/80">
            <p>Itahari, Sunsari, Nepal</p>
            <p>Phone: +977-25-XXXXXX</p>
            <p>Email: info@itaharinamuna.edu.np</p>
          </div>
        </div>

      </div>

      {/* Intellectual Copyright Ground Node Row */}
      <div className="max-w-7xl mx-auto px-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-brand-white/60 space-y-2 sm:space-y-0">
        <p>&copy; {currentYear} Itahari Namuna College. All rights reserved.</p>
        <p className="tracking-wide">Affiliated with Tribhuvan University (TU)</p>
      </div>
    </footer>
  );
}