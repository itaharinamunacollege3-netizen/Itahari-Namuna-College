import { motion } from "motion/react";
import React from "react";
export default function AnimatedSection({ children, className }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.15 } // Automatically staggers children!
        }
      }}
    >
      {/* This automatically applies fade-up to any child element inside */}
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.9} }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}