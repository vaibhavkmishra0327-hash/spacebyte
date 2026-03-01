import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { DataPanel } from "./DataPanel";
import { PulseIndicator } from "./PulseIndicator";
import { AnimatedCounter } from "./AnimatedCounter";
import { Calendar, Rocket, MapPin, Clock, ChevronDown, ChevronUp, ExternalLink, Crosshair } from "lucide-react";
import { useLaunches } from "../../lib/hooks";
import type { Launch } from "../../lib/database.types";

const statusConfig = {
  go: { label: "GO", color: "text-sb-green", bg: "bg-sb-green/10", pulse: "nominal" as const },
  upcoming: { label: "UPCOMING", color: "text-sb-cyan", bg: "bg-sb-cyan/10", pulse: "live" as const },
  hold: { label: "HOLD", color: "text-sb-amber", bg: "bg-sb-amber/10", pulse: "warning" as const },
  success: { label: "SUCCESS", color: "text-sb-green", bg: "bg-sb-green/10", pulse: "nominal" as const },
  scrubbed: { label: "SCRUBBED", color: "text-sb-red", bg: "bg-sb-red/10", pulse: "critical" as const },
};

export function Launches() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: launches, loading } = useLaunches();

  // Auto-expand first "go" launch
  const firstGo = launches.find((l) => l.status === "go");
  const expandedId = expanded ?? firstGo?.id ?? null;
  const goCount = launches.filter((l) => l.status === "go").length;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="font-display text-sb-text-primary">Launch Manifest</h1>
          <p className="text-sb-text-tertiary mt-1 text-[0.8125rem]">
            Upcoming and scheduled launches for India's space program
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-center">
            <div className="font-mono text-sb-cyan text-xl font-semibold">{launches.length}</div>
            <div className="text-sb-text-tertiary text-[0.625rem] uppercase tracking-[0.05em]">Scheduled</div>
          </div>
          <div className="w-px h-8 bg-sb-border" />
          <div className="text-center">
            <div className="font-mono text-sb-green text-xl font-semibold">{goCount}</div>
            <div className="text-sb-text-tertiary text-[0.625rem] uppercase tracking-[0.05em]">Go for Launch</div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-8 space-y-3">
          {launches.map((launch, i) => {
            const isExpanded = expandedId === launch.id;
            const st = statusConfig[launch.status];

            return (
              <motion.div
                key={launch.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className={`
                  sb-panel sb-panel-hover rounded-xl transition-all duration-300 cursor-pointer
                  ${isExpanded ? "!border-sb-border-active" : "hover:!border-sb-border-active/50"}
                `}
                onClick={() => setExpanded(expandedId === launch.id ? null : launch.id)}
              >
                {/* Main row */}
                <div className="flex items-center gap-4 p-4">
                  {/* Date block */}
                  <div className="w-14 shrink-0 text-center">
                    <div className="font-mono text-sb-text-data text-base font-semibold leading-[1.2]">
                      {new Date(launch.date).getDate().toString().padStart(2, "0")}
                    </div>
                    <div className="font-mono text-sb-text-tertiary text-[0.5625rem] uppercase">
                      {new Date(launch.date).toLocaleDateString("en", { month: "short" })}
                    </div>
                  </div>

                  <div className="w-px h-10 bg-sb-border" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-sb-text-primary text-sm font-medium">
                        {launch.vehicle}
                      </span>
                      <span className="text-sb-text-tertiary text-xs">·</span>
                      <span className="text-sb-text-secondary text-[0.8125rem]">
                        {launch.mission}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sb-text-tertiary text-[0.6875rem]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {launch.site}
                      </span>
                      <span className="flex items-center gap-1">
                        <Rocket className="w-3 h-3" />
                        {launch.payload}
                      </span>
                    </div>
                  </div>

                  {/* Status + Countdown */}
                  <div className="flex items-center gap-4 shrink-0">
                    {launch.countdown && (
                      <span className="font-mono text-sb-amber text-xs font-medium tabular-nums">
                        {launch.countdown}
                      </span>
                    )}
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${st.bg}`}>
                      <PulseIndicator status={st.pulse} />
                      <span className={`font-mono ${st.color} text-[0.5625rem] font-semibold tracking-[0.05em]`}>
                        {st.label}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-sb-text-tertiary" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-sb-text-tertiary" />
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-sb-border"
                  >
                    <div className="p-4 space-y-3">
                      <p className="text-sb-text-secondary text-[0.8125rem] leading-[1.6]">
                        {launch.description}
                      </p>
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: "Launch Pad", value: launch.pad },
                          { label: "Target Orbit", value: launch.orbit },
                          { label: "Payload Mass", value: launch.payload_mass },
                          { label: "Window", value: launch.window || launch.time },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="text-sb-text-tertiary text-[0.5625rem] font-medium uppercase tracking-[0.06em]">
                              {item.label}
                            </div>
                            <div className="font-mono text-sb-text-primary text-[0.8125rem]">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Mission Control CTA */}
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/mission-control/${launch.id}`); }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sb-cyan/10 text-sb-cyan border border-sb-cyan/15 hover:bg-sb-cyan/15 hover:border-sb-cyan/25 transition-all duration-300 mt-1 text-xs font-medium"
                      >
                        <Crosshair className="w-3.5 h-3.5" />
                        Enter Mission Control
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Side panel - Year overview */}
        <div className="col-span-4 space-y-4">
          <DataPanel title="FY 2026 Overview" subtitle="APR 25 — MAR 26" delay={0.3} accent="green">
            <div className="space-y-4">
              {[
                { label: "Total Launches", value: "18", sub: "planned" },
                { label: "PSLV", value: "8", sub: "flights" },
                { label: "GSLV / LVM3", value: "6", sub: "flights" },
                { label: "SSLV", value: "4", sub: "flights" },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center justify-between py-1">
                  <span className="text-sb-text-secondary text-[0.8125rem]">{item.label}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-sb-text-primary text-base font-semibold">{item.value}</span>
                    <span className="text-sb-text-tertiary text-[0.625rem]">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </DataPanel>

          <DataPanel title="Launch Sites" subtitle="ACTIVE" delay={0.4}>
            <div className="space-y-3">
              {[
                { name: "SDSC-SHAR, Sriharikota", pads: "FLP, SLP, SLP-UB, SLP-G", launches: 16 },
                { name: "Thumba TERLS", pads: "Sounding Rocket Pad", launches: 2 },
              ].map((site) => (
                <div key={site.name} className="p-2.5 rounded-md bg-sb-surface-2/30 border border-sb-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3 h-3 text-sb-cyan" />
                    <span className="text-sb-text-primary text-[0.8125rem] font-medium">
                      {site.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sb-text-tertiary text-[0.625rem]">
                      {site.pads}
                    </span>
                    <span className="font-mono text-sb-text-data text-[0.6875rem]">
                      {site.launches} launches
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DataPanel>

          <DataPanel title="Vehicle Fleet" subtitle="CAPABILITY" delay={0.5} accent="amber">
            <div className="space-y-2">
              {[
                { name: "PSLV", payload: "1,750 kg", orbit: "SSO", reliability: "98.1%" },
                { name: "GSLV Mk II", payload: "2,500 kg", orbit: "GTO", reliability: "75.0%" },
                { name: "LVM3", payload: "8,000 kg", orbit: "LEO", reliability: "100%" },
                { name: "SSLV", payload: "500 kg", orbit: "LEO", reliability: "75.0%" },
              ].map((v) => (
                <div key={v.name} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-sb-surface-2/30 transition-colors">
                  <div>
                    <div className="font-mono text-sb-text-primary text-[0.8125rem] font-medium">
                      {v.name}
                    </div>
                    <div className="text-sb-text-tertiary text-[0.625rem]">
                      {v.payload} to {v.orbit}
                    </div>
                  </div>
                  <span className="font-mono text-sb-green text-xs font-medium">
                    {v.reliability}
                  </span>
                </div>
              ))}
            </div>
          </DataPanel>
        </div>
      </div>
    </div>
  );
}
