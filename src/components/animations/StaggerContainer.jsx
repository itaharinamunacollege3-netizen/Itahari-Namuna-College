import { motion } from "motion/react";

export default function StaggerContainer({ children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        visible: { transition: { staggerChildren: 0.15 } }
      }}
    >
      {children}
    </motion.div>
  );
}