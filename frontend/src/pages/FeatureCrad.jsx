import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title, desc, index }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: [0.95, 1.05, 1], opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut"
      }}
      viewport={{ once: true }}

      whileHover={{
        scale: 1.05,
        borderColor: "#22d3ee",
        boxShadow: "0 0 20px rgba(34,211,238,0.35)"
      }}

      className="
      bg-[#0b0f14]/70
      border border-gray-800
      rounded-xl
      p-8
      transition
      "
    >
      <div className="mb-4 text-cyan-400">
        <Icon size={26} />
      </div>

      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-400 text-sm">
        {desc}
      </p>
    </motion.div>
  );
}