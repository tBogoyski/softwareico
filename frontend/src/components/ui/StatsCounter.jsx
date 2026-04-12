import { motion } from "framer-motion";
import useCountUp from "../../hooks/useCountUp";

export default function StatsCounter({ value, label }) {
  const { ref, count } = useCountUp(value, 2000);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-4xl sm:text-5xl font-extrabold text-primary-600">
        {count}+
      </div>
      <div className="mt-2 text-sm font-medium text-gray-600 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}
