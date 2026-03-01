import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DataPanel } from "./DataPanel";
import { PulseIndicator } from "./PulseIndicator";
import {
  Radio,
  TrendingUp,
  Globe,
  Shield,
  Satellite,
  Rocket,
  Building2,
  Zap,
  Filter,
} from "lucide-react";
import { useIntelFeed, FALLBACK_INTEL } from "../../lib/hooks";
import type { IntelItem } from "../../lib/database.types";

type IntelCategory = "ALL" | "LAUNCH" | "ORBIT" | "POLICY" | "COMMERCIAL" | "DEFENSE" | "SCIENCE";

const categoryConfig: Record<string, { icon: typeof Radio; color: string; bg: string; barBg: string }> = {
  LAUNCH: { icon: Rocket, color: "text-sb-cyan", bg: "bg-sb-cyan/10", barBg: "bg-sb-cyan" },
  ORBIT: { icon: Globe, color: "text-sb-green", bg: "bg-sb-green/10", barBg: "bg-sb-green" },
  POLICY: { icon: Building2, color: "text-sb-amber", bg: "bg-sb-amber/10", barBg: "bg-sb-amber" },
  COMMERCIAL: { icon: TrendingUp, color: "text-[#a78bfa]", bg: "bg-[#a78bfa]/10", barBg: "bg-[#a78bfa]" },
  DEFENSE: { icon: Shield, color: "text-sb-red", bg: "bg-sb-red/10", barBg: "bg-sb-red" },
  SCIENCE: { icon: Zap, color: "text-[#e879f9]", bg: "bg-[#e879f9]/10", barBg: "bg-[#e879f9]" },
};

const priorityStyle = {
  high: "border-l-sb-red",
  medium: "border-l-sb-amber/50",
  low: "border-l-sb-surface-3",
};

export function IntelFeed() {
  const [filter, setFilter] = useState<IntelCategory>("ALL");
  const { data: intelItems, loading } = useIntelFeed();

  const filtered =
    filter === "ALL" ? intelItems : intelItems.filter((i) => i.category === filter);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="font-display text-sb-text-primary">Intelligence Feed</h1>
          <p className="text-sb-text-tertiary mt-1 text-[0.8125rem]">
            Curated intelligence from across India's space ecosystem
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PulseIndicator status="live" />
          <span className="font-mono text-sb-cyan text-[0.625rem] font-semibold tracking-[0.1em]">
            LIVE FEED
          </span>
        </div>
      </motion.div>

      {/* Category filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 flex-wrap"
      >
        {(["ALL", "LAUNCH", "ORBIT", "POLICY", "COMMERCIAL", "DEFENSE", "SCIENCE"] as IntelCategory[]).map((cat) => {
          const conf = cat !== "ALL" ? categoryConfig[cat] : null;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`
                flex items-center gap-1.5 px-3 py-1 rounded-md font-mono transition-all duration-200
                text-[0.625rem] font-medium tracking-[0.05em]
                ${
                  filter === cat
                    ? "bg-sb-cyan/10 text-sb-cyan border border-sb-cyan/20"
                    : "bg-sb-surface-2/40 text-sb-text-tertiary border border-sb-border hover:text-sb-text-secondary"
                }
              `}
            >
              {conf && <conf.icon className="w-3 h-3" />}
              {cat}
            </button>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-12 gap-5">
        {/* Feed */}
        <div className="col-span-8 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => {
              const conf = categoryConfig[item.category];
              const Icon = conf.icon;
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.04 }}
                  className={`
                    sb-panel sb-panel-hover rounded-xl
                    border-l-2 ${priorityStyle[item.priority]}
                    transition-all duration-300 cursor-default
                  `}
                >
                  <div className="p-4">
                    {/* Top meta */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${conf.bg}`}>
                          <Icon className={`w-3 h-3 ${conf.color}`} />
                          <span className={`font-mono ${conf.color} text-[0.5625rem] font-semibold tracking-[0.05em]`}>
                            {item.category}
                          </span>
                        </div>
                        {item.priority === "high" && (
                          <span className="font-mono text-sb-red bg-sb-red/10 px-1.5 py-0.5 rounded text-[0.5rem] font-bold tracking-[0.08em]">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sb-text-tertiary">
                        <span className="font-mono text-[0.625rem] tabular-nums">{item.time}</span>
                        <span className="font-mono text-[0.5625rem]">{item.date}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sb-text-primary mb-1.5">{item.title}</h3>

                    {/* Body */}
                    <p className="text-sb-text-secondary mb-3 text-[0.8125rem] leading-[1.65]">
                      {item.body}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-sb-text-tertiary bg-sb-surface-3/50 px-1.5 py-0.5 rounded text-[0.5625rem]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-sb-text-tertiary text-[0.6875rem]">
                        {item.source}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Sidebar analytics */}
        <div className="col-span-4 space-y-4">
          <DataPanel title="Feed Analytics" subtitle="TODAY" delay={0.3} accent="amber">
            <div className="space-y-3">
              {Object.entries(categoryConfig).map(([cat, conf]) => {
                const count = intelItems.filter((i) => i.category === cat).length;
                const Icon = conf.icon;
                return (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${conf.color}`} />
                      <span className="text-sb-text-secondary text-[0.8125rem]">{cat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-sb-surface-3 rounded-full overflow-hidden">
                        <div
                          ref={(el) => { if (el) el.style.width = `${(count / intelItems.length) * 100}%`; }}
                          className={`h-full rounded-full ${conf.barBg}`}
                        />
                      </div>
                      <span className="font-mono text-sb-text-primary text-xs font-medium tabular-nums">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </DataPanel>

          <DataPanel title="Priority Breakdown" subtitle="LAST 24H" delay={0.4}>
            <div className="space-y-3">
              {[
                { label: "High Priority", count: intelItems.filter((i) => i.priority === "high").length, color: "text-sb-red", barClass: "bg-sb-red" },
                { label: "Medium", count: intelItems.filter((i) => i.priority === "medium").length, color: "text-sb-amber", barClass: "bg-sb-amber" },
                { label: "Low", count: intelItems.filter((i) => i.priority === "low").length, color: "text-sb-text-tertiary", barClass: "bg-sb-surface-3" },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between">
                  <span className="text-sb-text-secondary text-[0.8125rem]">{p.label}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-sb-surface-3 rounded-full overflow-hidden">
                      <div
                        ref={(el) => { if (el) el.style.width = `${(p.count / intelItems.length) * 100}%`; }}
                        className={`h-full rounded-full ${p.barClass}`}
                      />
                    </div>
                    <span className={`font-mono ${p.color} text-xs font-medium`}>
                      {p.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DataPanel>

          <DataPanel title="Sources" subtitle="VERIFIED" delay={0.5} accent="green">
            <div className="space-y-2">
              {[...new Set(intelItems.map((i) => i.source))].map((source) => (
                <div key={source} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <PulseIndicator status="nominal" />
                    <span className="text-sb-text-secondary text-[0.8125rem]">{source}</span>
                  </div>
                  <span className="font-mono text-sb-green text-[0.5625rem] font-medium">VERIFIED</span>
                </div>
              ))}
            </div>
          </DataPanel>
        </div>
      </div>
    </div>
  );
}
