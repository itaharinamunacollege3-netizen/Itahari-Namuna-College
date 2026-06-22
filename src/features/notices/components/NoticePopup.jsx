import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedNotices } from '../services/noticesService';

let shownThisLoad = false;

export default function NoticePopup() {
  const [notices, setNotices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeButtonRef = useRef(null);

  const notice = notices[currentIndex] ?? null;
  const total = notices.length;

  const handleClose = () => {
    setOpen(false);
  };

  const handleRead = () => {
    if (!notice) return;
    setOpen(false);
    navigate(`/notices/${notice.id}`);
  };

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (shownThisLoad) return;
    let active = true;
    getFeaturedNotices().then((featured) => {
      if (!active || !featured || featured.length === 0) return;
      shownThisLoad = true;
      setNotices(featured);
      setCurrentIndex(0);
      setOpen(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft' && total > 1) goToPrev();
      if (e.key === 'ArrowRight' && total > 1) goToNext();
    };
    window.addEventListener('keydown', onKey);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, total, goToPrev, goToNext]);

  if (!open || !notice) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/0 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-brand-white rounded-2xl shadow-2xl border border-brand-gray/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          aria-label="Close notice"
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
        >
          <X size={18} />
        </button>

        {notice.image && (
          <button
            onClick={handleRead}
            aria-label={`Open ${notice.title}`}
            className="block w-full"
          >
            <img
              src={notice.image}
              alt={notice.title}
              className="w-full max-h-72 object-cover"
            />
          </button>
        )}

        <div className="p-7">
          {total > 1 && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wide text-brand-dark/50">
                {currentIndex + 1} / {total} notices
              </span>
              <div className="flex gap-1">
                <button
                  onClick={goToPrev}
                  aria-label="Previous notice"
                  className="p-1 rounded-full hover:bg-brand-gray/20 transition"
                >
                  <ChevronLeft size={16} className="text-brand-dark/60" />
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next notice"
                  className="p-1 rounded-full hover:bg-brand-gray/20 transition"
                >
                  <ChevronRight size={16} className="text-brand-dark/60" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {(notice.tags ?? []).map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  tag === 'IMPORTANT' ? 'bg-red-100 text-red-600' : 'bg-brand-blue/10 text-brand-blue'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h2
            id="notice-popup-title"
            className="font-heading font-extrabold text-xl text-brand-dark leading-tight mb-3 pr-6"
          >
            {notice.title}
          </h2>

          <p className="text-sm text-brand-dark/70 leading-relaxed line-clamp-4 mb-6">
            {notice.description}
          </p>

          <button
            onClick={handleRead}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white text-sm font-bold px-5 py-3 rounded-xl hover:bg-brand-primary/90 transition"
          >
            Read more <ArrowRight size={16} />
          </button>

          {total > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {notices.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to notice ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-brand-primary'
                      : 'w-2 bg-brand-gray/40 hover:bg-brand-gray/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
