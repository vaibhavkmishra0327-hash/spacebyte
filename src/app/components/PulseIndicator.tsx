import { motion } from "motion/react";

interface PulseIndicatorProps {
  status: "live" | "nominal" | "warning" | "critical";
  size?: "sm" | "md";
}

const statusColors = {
  live: "bg-sb-cyan",
  nominal: "bg-sb-green",
  warning: "bg-sb-amber",
  critical: "bg-sb-red",
};

const glowColors = {
  live: "bg-sb-cyan/40",
  nominal: "bg-sb-green/40",
  warning: "bg-sb-amber/40",
  critical: "bg-sb-red/40",
};

export function PulseIndicator({ status, size = "sm" }: PulseIndicatorProps) {
  const dim = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";

  return (
    <span className="relative inline-flex">
      <motion.span
        className={`${dim} rounded-full ${statusColors[status]}`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className={`absolute inset-0 ${dim} rounded-full ${glowColors[status]}`}
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
    </span>
  );
}
