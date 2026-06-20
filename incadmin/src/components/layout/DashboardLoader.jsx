import { motion } from "framer-motion";
import { useEffect } from "react";
import { LogoMark } from "@/components/cms/Logo";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardLoader() {
  const { completeBoot } = useAuth();

  useEffect(() => {
    const timer = setTimeout(completeBoot, 1800);
    return () => clearTimeout(timer);
  }, [completeBoot]);

  return (
    <div className="gradient-hero flex min-h-screen flex-col items-center justify-center text-white">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <LogoMark size="xl" light />
      </motion.div>
      <motion.h1
        className="text-2xl font-bold"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Itahari Namuna College
      </motion.h1>
      <motion.p
        className="mt-2 text-white/80"
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        Loading admin dashboard…
      </motion.p>
      <motion.span
        className="loading loading-spinner loading-lg mt-8 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
    </div>
  );
}
