import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, ChevronRight, ChevronLeft, ExternalLink } from "lucide-react";
import { getNotices } from "../../features/notices/services/noticesService";

export default function FloatingNotice() {
  const [notices, setNotices] = useState([]);
  const [noticeExpanded, setNoticeExpanded] = useState(false);
  
  const [unreadCount, setUnreadCount] = useState(() => {
    const savedCount = localStorage.getItem("unreadNoticeCount");
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    let active = true;
    getNotices().then((data) => {
      if (active) {
        setNotices(data);
        const savedCount = localStorage.getItem("unreadNoticeCount");
        if (!savedCount) {
          setUnreadCount(data.length);
          localStorage.setItem("unreadNoticeCount", data.length.toString());
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleMarkAsRead = () => {
    if (unreadCount > 0) {
      const newCount = Math.max(0, unreadCount - 1);
      setUnreadCount(newCount);
      localStorage.setItem("unreadNoticeCount", newCount.toString());
    }
  };

  if (notices.length === 0) return null;

  const latestNotice = notices[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40"
    >
      <AnimatePresence mode="wait">
        {!noticeExpanded ? (
          <motion.div
            key="compact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 400, damping: 25 }}
          >
            <button
              onClick={() => setNoticeExpanded(true)}
              className="relative group bg-linear-to-b from-brand-primary to-brand-blue backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(4,93,48,0.4)] border border-brand-white/20 hover:border-brand-white/40 transition-all duration-500 hover:shadow-[0_25px_70px_-20px_rgba(4,93,48,0.5)] hover:scale-105 active:scale-95"
            >
              <div className="flex flex-col items-center gap-2 px-4 py-5">
                <div className="relative">
                  <div className="w-10 h-10 bg-brand-white/20 rounded-full flex items-center justify-center group-hover:bg-brand-white/30 transition-colors">
                    <Bell className="w-5 h-5 text-brand-white group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                  {unreadCount > 0 && (
                    <motion.span
                      key={unreadCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-brand-crimson text-brand-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-brand-white shadow-lg"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </div>
                <div className="w-7 h-px bg-brand-white/30" />
                <div className="w-10 h-10 bg-brand-white/15 rounded-full flex items-center justify-center group-hover:bg-brand-white/25 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-brand-white/90 group-hover:translate-y-[-2px] transition-transform duration-300" />
                </div>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.45, type: "spring", stiffness: 350, damping: 25 }}
          >
            <div className="bg-brand-white rounded-tl-2xl rounded-bl-2xl rounded-tr-xl rounded-br-xl shadow-[0_25px_80px_-20px_rgba(0,0,0,0.25)] border border-brand-gray/20 overflow-hidden w-72">
              <div className="bg-linear-to-b from-brand-primary to-brand-blue px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-brand-white/20 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-brand-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-brand-white text-sm uppercase tracking-[0.15em]">Latest Notice</h3>
                    </div>
                    <span className="flex-shrink-0 w-8 h-8 bg-brand-white/30 text-brand-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                      {unreadCount}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 w-full">
                  {unreadCount > 0 && (
                    <motion.button
                      key="mark-read"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMarkAsRead}
                      className="flex-1 px-3 py-1.5 bg-brand-white/20 hover:bg-brand-white/30 rounded-full text-brand-white text-xs font-bold transition-colors text-center"
                    >
                      Mark as Read
                    </motion.button>
                  )}
                  <button
                    onClick={() => setNoticeExpanded(false)}
                    className="flex-shrink-0 w-10 h-10 bg-brand-white/15 hover:bg-brand-white/25 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-brand-white" />
                  </button>
                </div>
              </div>

              {/* Notice content with title + tags as links */}
              <div className="px-5 py-4 space-y-3">
                {/* Tags as clickable links */}
                {latestNotice.tags && latestNotice.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {latestNotice.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/notices/${latestNotice.id}`}
                        onClick={handleMarkAsRead}
                        className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full transition-all duration-200 hover:scale-105 ${
                          tag === 'IMPORTANT'
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
                        }`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Title as clickable link */}
                <Link
                  to={`/notices/${latestNotice.id}`}
                  onClick={handleMarkAsRead}
                  className="block group"
                >
                  <h4 className="font-heading font-extrabold text-brand-dark text-[15px] leading-snug group-hover:text-brand-primary transition-colors duration-200">
                    {latestNotice.title}
                  </h4>
                </Link>

                {/* Published date */}
                {latestNotice.publishedDate && (
                  <p className="text-brand-dark/50 text-[11px] font-medium">
                    {new Date(latestNotice.publishedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}

                {/* Read full notice link */}
                <Link
                  to={`/notices/${latestNotice.id}`}
                  onClick={handleMarkAsRead}
                  className="flex items-center gap-1.5 text-brand-primary text-xs font-bold hover:text-brand-primary/80 transition-colors pt-1"
                >
                  Read full notice <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}