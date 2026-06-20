import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { getFeaturedNotice } from '../services/noticesService';

const DISMISS_KEY = 'dismissedNotice';

export default function NoticePopup() {
  const [notice, setNotice] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const closeButtonRef = useRef(null);

  const dismiss = () => {
    if (notice) localStorage.setItem(DISMISS_KEY, String(notice.id));
  };

  const handleClose = () => {
    dismiss();
    setOpen(false);
  };

  const handleRead = () => {
    dismiss();
    setOpen(false);
    navigate(`/notices/${notice.id}`);
  };

  useEffect(() => {
    let active = true;
    getFeaturedNotice().then((featured) => {
      if (!active || !featured) return;
      const dismissed = localStorage.getItem(DISMISS_KEY);
      if (String(dismissed) === String(featured.id)) return;
      setNotice(featured);
      setOpen(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (notice) localStorage.setItem(DISMISS_KEY, String(notice.id));
      setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, notice]);

  if (!open || !notice) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
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
          <div className="flex flex-wrap gap-2 mb-3">
            {notice.tags.map((tag) => (
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
        </div>
      </div>
    </div>
  );
}
