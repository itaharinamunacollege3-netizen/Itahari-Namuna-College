import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set scroll to top smooth behavior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.5,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <button
        onClick={scrollToTop}
        className="bg-linear-to-br from-brand-primary to-brand-blue text-brand-white p-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 active:scale-95"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </motion.div>
  );
}