import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Satellite,
  Rocket,
  Target,
  TrendingUp,
  ArrowUpRight,
  Radio,
  Globe,
  Zap,
  Activity,
} from "lucide-react";
import { DataPanel } from "./DataPanel";
import { AnimatedCounter } from "./AnimatedCounter";
import { PulseIndicator } from "./PulseIndicator";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useLaunches, useSatellites, useIntelFeed } from "../../lib/hooks";

const telemetryData = Array.from({ length: 40 }, (_, i) => ({
  t: i,
  signal: 85 + Math.sin(i * 0.3) * 12 + Math.random() * 5,
  power: 72 + Math.cos(i * 0.2) * 8 + Math.random() * 4,
}));

const tagColors: Record<string, string> = {
  LAUNCH: "text-sb-cyan bg-sb-cyan/10",
  ORBIT: "text-sb-green bg-sb-green/10",
  POLICY: "text-sb-amber bg-sb-amber/10",
  TELEMETRY: "text-sb-red bg-sb-red/10",
  COMMERCIAL: "text-[#a78bfa] bg-[#a78bfa]/10",
  SCIENCE: "text-[#e879f9] bg-[#e879f9]/10",
  DEFENSE: "text-[#fb7185] bg-[#fb7185]/10",
};

export function Terminal() {
  const [tick, setTick] = useState(0);
  const { data: launches } = useLaunches();
  const { data: satellites } = useSatellites();
  const { data: intelItems } = useIntelFeed();

  // Derive summary data from hooks
  const recentLaunches = launches.slice(0, 4);
  const activeSatellites = satellites.slice(0, 6);
  const intelFeed = intelItems.slice(0, 5);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-sb-cyan" />
            <span
              className="font-mono text-sb-cyan text-[0.625rem] font-semibold tracking-[0.12em] uppercase"
            >
              Command Terminal
            </span>
          </div>
          <h1 className="font-display text-sb-text-hero text-[1.75rem] font-semibold tracking-[-0.03em]">
            System Overview
          </h1>
          <p className="text-sb-text-secondary mt-1 text-sm">
            Real-time telemetry and intelligence from India's space infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sb-surface-1/60 border border-sb-border">
            <PulseIndicator status="live" />
            <span className="font-mono text-sb-green text-[0.5625rem] font-medium uppercase tracking-[0.06em]">
              All Systems Nominal
            </span>
          </div>
        </div>
      </motion.div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Active Satellites",
            value: 58,
            delta: "+3",
            icon: Satellite,
            iconColor: "text-sb-cyan",
            iconBg: "bg-sb-cyan/10",
          },
          {
            label: "Missions FY26",
            value: 14,
            delta: "+2",
            icon: Rocket,
            iconColor: "text-sb-green",
            iconBg: "bg-sb-green/10",
          },
          {
            label: "Success Rate",
            value: 97.8,
            decimals: 1,
            suffix: "%",
            delta: "+0.3%",
            icon: Target,
            iconColor: "text-sb-amber",
            iconBg: "bg-sb-amber/10",
          },
          {
            label: "Ground Stations",
            value: 12,
            delta: "All online",
            icon: Radio,
            iconColor: "text-[#a78bfa]",
            iconBg: "bg-[#a78bfa]/10",
          },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15 + i * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="sb-panel sb-panel-hover rounded-xl p-5 group cursor-default"
            whileHover={{ y: -2, transition: { duration: 0.25 } }}
          >
            <div className="flex items-start justify-between mb-4">
              <span
                className="text-sb-text-tertiary font-mono uppercase tracking-wider text-[0.5625rem] tracking-[0.08em]"
              >
                {metric.label}
              </span>
              <div
                className={`p-1.5 rounded-lg ${metric.iconBg}`}
              >
                <metric.icon className={`w-3.5 h-3.5 ${metric.iconColor}`} />
              </div>
            </div>
            <div className="flex items-end gap-2.5">
              <AnimatedCounter
                value={metric.value}
                decimals={metric.decimals || 0}
                suffix={metric.suffix || ""}
                className="font-mono"
                duration={1800}
              />
              <span className="text-sb-green font-mono mb-0.5 flex items-center gap-0.5 text-[0.625rem]">
                <ArrowUpRight className="w-2.5 h-2.5" />
                {metric.delta}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Telemetry Chart */}
        <div className="col-span-8">
          <DataPanel title="Signal Telemetry" subtitle="LIVE · 40s WINDOW" delay={0.3}>
            <div className="h-[220px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryData}>
                  <defs>
                    <linearGradient id="signalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="t"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4a5873", fontSize: 9, fontFamily: "JetBrains Mono" }}
                  />
                  <YAxis
                    domain={[60, 110]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4a5873", fontSize: 9, fontFamily: "JetBrains Mono" }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(11,17,34,0.95)",
                      border: "1px solid rgba(56,189,248,0.12)",
                      borderRadius: 8,
                      fontSize: 11,
                      fontFamily: "JetBrains Mono",
                      color: "#e8edf5",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      backdropFilter: "blur(12px)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="signal"
                    stroke="#38bdf8"
                    strokeWidth={1.5}
                    fill="url(#signalGrad)"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="power"
                    stroke="#a78bfa"
                    strokeWidth={1}
                    fill="url(#powerGrad)"
                    dot={false}
                    opacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-5 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded bg-sb-cyan" />
                <span className="font-mono text-sb-text-tertiary text-[0.5625rem] uppercase tracking-[0.06em]">
                  Signal Strength
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded bg-[#a78bfa]" />
                <span className="font-mono text-sb-text-tertiary text-[0.5625rem] uppercase tracking-[0.06em]">
                  Power Output
                </span>
              </div>
            </div>
          </DataPanel>
        </div>

        {/* Active Constellation */}
        <div className="col-span-4">
          <DataPanel title="Active Constellation" subtitle={`${activeSatellites.length} TRACKED`} delay={0.4}>
            <div className="space-y-1.5">
              {activeSatellites.map((sat) => (
                <div
                  key={sat.name}
                  className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-sb-surface-2/30 transition-colors group cursor-default"
                >
                  <div className="flex items-center gap-2.5">
                    <PulseIndicator
                      status={sat.health as "nominal" | "warning"}
                    />
                    <div>
                      <div className="font-mono text-sb-text-primary text-xs font-medium">
                        {sat.name}
                      </div>
                      <div className="font-mono text-sb-text-tertiary text-[0.5625rem]">
                        {sat.type} · {sat.band}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-mono ${
                        sat.signal > 90
                          ? "text-sb-green"
                          : sat.signal > 80
                          ? "text-sb-amber"
                          : "text-sb-red"
                      } text-[0.6875rem] font-medium tabular-nums`}
                    >
                      {sat.signal}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DataPanel>
        </div>

        {/* Recent Launches */}
        <div className="col-span-7">
          <DataPanel title="Launch History" subtitle="FY 2026" delay={0.5} noPadding>
            <table className="w-full">
              <thead>
                <tr className="border-b border-sb-border/60">
                  {["Vehicle", "Mission", "Date", "Orbit", "Payload", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-sb-text-tertiary text-[0.5625rem] font-semibold uppercase tracking-[0.08em]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {recentLaunches.map((launch, i) => (
                  <motion.tr
                    key={launch.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.06 }}
                    className="border-b border-sb-border/30 hover:bg-sb-surface-2/20 transition-colors cursor-default"
                  >
                    <td className="px-4 py-3 font-mono text-sb-text-data text-xs font-medium">
                      {launch.vehicle}
                    </td>
                    <td className="px-4 py-3 text-sb-text-primary text-xs">
                      {launch.mission}
                    </td>
                    <td className="px-4 py-3 font-mono text-sb-text-secondary text-[0.6875rem] tabular-nums">
                      {launch.date}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono bg-sb-surface-3/40 text-sb-text-secondary px-2 py-0.5 rounded-md text-[0.625rem]">
                        {launch.orbit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sb-text-secondary text-xs">
                      {launch.payload}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <PulseIndicator
                          status={launch.status === "success" ? "nominal" : "live"}
                        />
                        <span
                          className={`font-mono ${
                            launch.status === "success"
                              ? "text-sb-green"
                              : "text-sb-cyan"
                          } text-[0.625rem] font-medium uppercase tracking-[0.05em]`}
                        >
                          {launch.status}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </DataPanel>
        </div>

        {/* Intel Feed */}
        <div className="col-span-5">
          <DataPanel
            title="Intelligence Feed"
            subtitle="REALTIME"
            delay={0.6}
            accent="amber"
          >
            <div className="space-y-3">
              {intelFeed.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.06 }}
                  className="flex gap-3 group cursor-default"
                >
                  <div className="flex flex-col items-center pt-0.5">
                    <span className="font-mono text-sb-text-tertiary text-[0.5625rem] tabular-nums">
                      {item.time}
                    </span>
                    <div className="w-px flex-1 bg-sb-border mt-1.5" />
                  </div>
                  <div className="pb-3 min-w-0">
                    <span
                      className={`inline-block font-mono px-1.5 py-0.5 rounded-md mb-1 ${
                        tagColors[item.category] || "text-sb-text-tertiary bg-sb-surface-3"
                      } text-[0.5625rem] font-semibold tracking-[0.05em]`}
                    >
                      {item.category}
                    </span>
                    <p className="text-sb-text-secondary group-hover:text-sb-text-primary transition-colors text-xs leading-[1.55]">
                      {item.title}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </DataPanel>
        </div>
      </div>

      {/* Bottom scanner bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="sb-panel rounded-xl flex items-center justify-between px-5 py-3"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-3.5 h-3.5 text-sb-amber" />
          <span className="font-mono text-sb-text-tertiary text-[0.625rem] uppercase tracking-[0.06em]">
            Next scheduled event
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sb-text-primary text-xs">
            {launches[0]?.vehicle ?? "SSLV-D5"} · {launches[0]?.mission ?? "EOS-10"} Launch
          </span>
          <span className="font-mono text-sb-amber text-[0.6875rem] tabular-nums">
            {launches[0]?.countdown ?? "T-04d 08h 32m"}
          </span>
          <span className="font-mono bg-sb-amber/10 text-sb-amber px-2.5 py-0.5 rounded-md text-[0.5625rem] font-semibold tracking-[0.05em]">
            {launches[0]?.site ?? "SDSC-SHAR"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
