import { motion } from "motion/react";
import { DataPanel } from "./DataPanel";
import { PulseIndicator } from "./PulseIndicator";
import { AnimatedCounter } from "./AnimatedCounter";
import { ArrowUpRight, ChevronRight, Clock, Globe, MapPin } from "lucide-react";
import { useMissions } from "../../lib/hooks";
import type { Mission } from "../../lib/database.types";

const statusMap = {
  active: { label: "Active", color: "text-sb-cyan", pulse: "live" as const },
  operational: { label: "Operational", color: "text-sb-green", pulse: "nominal" as const },
  preparation: { label: "Preparation", color: "text-sb-amber", pulse: "warning" as const },
  concept: { label: "Concept", color: "text-sb-text-tertiary", pulse: "warning" as const },
};

export function Missions() {
  const { data: missions, loading } = useMissions();

  const activeCount = missions.filter((m) => m.status === "active").length;
  const operationalCount = missions.filter((m) => m.status === "operational").length;
  const prepCount = missions.filter((m) => m.status === "preparation" || m.status === "concept").length;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="font-display text-sb-text-primary">Mission Control</h1>
          <p className="text-sb-text-tertiary mt-1 text-[0.8125rem]">
            Active, planned, and legacy missions across ISRO's program
          </p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: "Active", count: activeCount, color: "text-sb-cyan" },
            { label: "Operational", count: operationalCount, color: "text-sb-green" },
            { label: "In Prep", count: prepCount, color: "text-sb-amber" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={`font-mono ${s.color} text-sm font-semibold`}>
                {s.count}
              </span>
              <span className="text-sb-text-tertiary text-[0.6875rem]">{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Mission Cards */}
      <div className="grid grid-cols-2 gap-4">
        {missions.map((mission, i) => {
          const st = statusMap[mission.status];
          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
              className="sb-panel sb-panel-hover rounded-xl transition-all duration-300 group cursor-default"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between p-4 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <PulseIndicator status={st.pulse} />
                    <span className={`font-mono ${st.color} text-[0.5625rem] font-semibold uppercase tracking-[0.08em]`}>
                      {st.label}
                    </span>
                  </div>
                  <h2 className="font-display text-sb-text-primary group-hover:text-sb-cyan transition-colors">
                    {mission.name}
                  </h2>
                  <p className="text-sb-text-tertiary mt-0.5 text-xs">
                    {mission.type}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-sb-surface-3/60 px-2 py-1 rounded">
                  <span className="font-mono text-sb-text-secondary text-[0.625rem]">
                    {mission.vehicle}
                  </span>
                </div>
              </div>

              {/* Phase & Progress */}
              <div className="px-4 pb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sb-text-secondary text-[0.6875rem]">
                    {mission.phase}
                  </span>
                  <span className="font-mono text-sb-text-data text-[0.6875rem] tabular-nums">
                    {mission.progress}%
                  </span>
                </div>
                <div className="h-1 bg-sb-surface-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mission.progress}%` }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className={`h-full rounded-full bg-gradient-to-r ${
                      mission.status === "active"
                        ? "from-sb-cyan to-sb-cyan/50"
                        : mission.status === "operational"
                        ? "from-sb-green to-sb-green/50"
                        : "from-sb-amber to-sb-amber/50"
                    }`}
                  />
                </div>
              </div>

              {/* Telemetry */}
              <div className="px-4 pb-3 grid grid-cols-3 gap-3">
                {[
                  { key: "altitude", val: mission.telemetry_altitude },
                  { key: "velocity", val: mission.telemetry_velocity },
                  { key: "fuel", val: mission.telemetry_fuel },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="text-sb-text-tertiary text-[0.5625rem] font-medium uppercase tracking-[0.06em]">
                      {item.key}
                    </div>
                    <div className="font-mono text-sb-text-primary text-xs tabular-nums">
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-sb-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sb-text-tertiary">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono text-[0.625rem]">
                      {mission.mission_day > 0 ? `Day ${mission.mission_day}` : mission.launch_date}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-sb-text-tertiary group-hover:text-sb-cyan transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
