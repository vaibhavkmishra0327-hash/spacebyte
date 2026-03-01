import { motion } from "motion/react";
import type { ReactNode } from "react";

interface DataPanelProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  accent?: "cyan" | "amber" | "green" | "red" | "violet";
  noPadding?: boolean;
}

const accentColors = {
  cyan: { bar: "bg-sb-cyan/50", glow: "sb-panel-glow-cyan" },
  amber: { bar: "bg-sb-amber/50", glow: "sb-panel-glow-amber" },
  green: { bar: "bg-sb-green/50", glow: "sb-panel-glow-green" },
  red: { bar: "bg-sb-red/50", glow: "sb-panel-glow-red" },
  violet: { bar: "bg-sb-violet/50", glow: "sb-panel-glow-violet" },
};

export function DataPanel({
  title,
  subtitle,
  children,
  className = "",
  delay = 0,
  accent = "cyan",
  noPadding = false,
}: DataPanelProps) {
  const colors = accentColors[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`
        sb-panel sb-panel-hover rounded-xl ${colors.glow}
        ${className}
      `}
      whileHover={{ y: -1, transition: { duration: 0.25 } }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sb-border/60">
        <div className="flex items-center gap-2.5">
          <div className={`w-0.5 h-3.5 rounded-full ${colors.bar}`} />
          <span
            className="text-sb-text-secondary tracking-wider text-[0.6875rem] font-medium uppercase tracking-[0.08em]"
          >
            {title}
          </span>
        </div>
        {subtitle && (
          <span
            className="font-mono text-sb-text-tertiary text-[0.5625rem] tracking-[0.04em]"
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Content */}
      <div className={noPadding ? "" : "p-4"}>
        {children}
      </div>
    </motion.div>
  );
}
