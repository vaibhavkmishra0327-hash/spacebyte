import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DataPanel } from "./DataPanel";
import { PulseIndicator } from "./PulseIndicator";
import { Search, Filter, Satellite, Radio, Eye } from "lucide-react";
import { useSatellites } from "../../lib/hooks";
import type { Satellite as SatelliteRow } from "../../lib/database.types";

type OrbitType = "LEO" | "GEO" | "MEO" | "SSO" | "HEO" | "L1";

// Alias for compatibility with OrbitalVisualization
type SatelliteData = SatelliteRow;

const orbitColors: Record<OrbitType, { hex: string; text: string; bg: string }> = {
  LEO: { hex: "#38bdf8", text: "text-sb-cyan", bg: "bg-sb-cyan/[0.08]" },
  GEO: { hex: "#34d399", text: "text-sb-green", bg: "bg-sb-green/[0.08]" },
  MEO: { hex: "#a78bfa", text: "text-sb-violet", bg: "bg-sb-violet/[0.08]" },
  SSO: { hex: "#f59e0b", text: "text-sb-amber", bg: "bg-sb-amber/[0.08]" },
  HEO: { hex: "#fb7185", text: "text-[#fb7185]", bg: "bg-[#fb7185]/[0.08]" },
  L1: { hex: "#e879f9", text: "text-[#e879f9]", bg: "bg-[#e879f9]/[0.08]" },
};

export function Constellation() {
  const [filter, setFilter] = useState<OrbitType | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SatelliteData | null>(null);
  const { data: satellites, loading } = useSatellites();

  const filtered = satellites.filter((s) => {
    const matchOrbit = filter === "ALL" || s.orbit === filter;
    const matchSearch =
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase());
    return matchOrbit && matchSearch;
  });

  const orbitCounts = satellites.reduce((acc, s) => {
    acc[s.orbit] = (acc[s.orbit] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="font-display text-sb-text-primary">Constellation</h1>
          <p className="text-sb-text-tertiary mt-1 text-[0.8125rem]">
            Real-time tracking of {satellites.length} Indian space assets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sb-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search satellite..."
              className="pl-8 pr-3 py-1.5 bg-sb-surface-2/60 border border-sb-border rounded-md font-mono text-sb-text-primary placeholder:text-sb-text-tertiary focus:border-sb-border-active focus:outline-none transition-colors text-xs w-[200px]"
            />
          </div>
        </div>
      </motion.div>

      {/* Orbit filter pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-2"
      >
        {["ALL", "LEO", "GEO", "SSO", "HEO", "L1"].map((orbit) => (
          <button
            key={orbit}
            onClick={() => setFilter(orbit as OrbitType | "ALL")}
            className={`
              px-3 py-1 rounded-md font-mono transition-all duration-200
              text-[0.625rem] font-medium tracking-[0.05em]
              ${
                filter === orbit
                  ? "bg-sb-cyan/10 text-sb-cyan border border-sb-cyan/20"
                  : "bg-sb-surface-2/40 text-sb-text-tertiary border border-sb-border hover:text-sb-text-secondary"
              }
            `}
          >
            {orbit}
            {orbit !== "ALL" && (
              <span className="ml-1.5 opacity-50">{orbitCounts[orbit] || 0}</span>
            )}
            {orbit === "ALL" && (
              <span className="ml-1.5 opacity-50">{satellites.length}</span>
            )}
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-12 gap-4">
        {/* Orbital Visualization */}
        <div className="col-span-5">
          <DataPanel title="Orbital Map" subtitle="EQUATORIAL VIEW" delay={0.2}>
            <OrbitalVisualization satellites={filtered} onSelect={setSelected} selected={selected} />
          </DataPanel>
        </div>

        {/* Satellite List */}
        <div className="col-span-7">
          <DataPanel title="Asset Registry" subtitle={`${filtered.length} ASSETS`} delay={0.25} noPadding>
            <div className="max-h-[480px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-sb-surface-1 z-10">
                  <tr className="border-b border-sb-border">
                    {["Satellite", "Type", "Orbit", "Alt", "Signal", "Health"].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-sb-text-tertiary text-[0.5625rem] font-semibold uppercase tracking-[0.08em]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((sat, i) => (
                      <motion.tr
                        key={sat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelected(sat)}
                        className={`border-b border-sb-border/30 cursor-pointer transition-colors ${
                          selected?.id === sat.id
                            ? "bg-sb-cyan/5"
                            : "hover:bg-sb-surface-2/30"
                        }`}
                      >
                        <td className="px-3 py-2">
                          <div className="font-mono text-sb-text-primary text-xs font-medium">
                            {sat.name}
                          </div>
                          <div className="font-mono text-sb-text-tertiary text-[0.5625rem]">
                            NORAD {sat.norad}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-sb-text-secondary text-xs">
                          {sat.type}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`font-mono px-1.5 py-0.5 rounded text-[0.5625rem] font-semibold ${orbitColors[sat.orbit].text} ${orbitColors[sat.orbit].bg}`}
                          >
                            {sat.orbit}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-mono text-sb-text-secondary text-[0.6875rem] tabular-nums">
                          {sat.altitude}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1 bg-sb-surface-3 rounded-full overflow-hidden">
                              <div
                                ref={(el) => { if (el) el.style.width = `${sat.signal}%`; }}
                                className={`h-full rounded-full ${sat.signal > 90 ? "bg-sb-green" : sat.signal > 80 ? "bg-sb-amber" : "bg-sb-red"}`}
                              />
                            </div>
                            <span className="font-mono text-sb-text-secondary text-[0.625rem] tabular-nums">
                              {sat.signal}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <PulseIndicator status={sat.health} />
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </DataPanel>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="bg-sb-surface-1/60 backdrop-blur-sm rounded-lg border border-sb-border-active p-5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PulseIndicator status={selected.health} size="md" />
                  <h2 className="font-display text-sb-text-primary">{selected.name}</h2>
                  <span
                    className={`font-mono px-2 py-0.5 rounded text-[0.5625rem] font-semibold ${orbitColors[selected.orbit].text} ${orbitColors[selected.orbit].bg}`}
                  >
                    {selected.orbit}
                  </span>
                </div>
                <p className="text-sb-text-tertiary text-[0.8125rem]">
                  {selected.type} · NORAD {selected.norad} · Launched {selected.launched}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-sb-text-tertiary hover:text-sb-text-primary transition-colors px-2 py-1 text-xs"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {[
                { label: "Altitude", value: selected.altitude },
                { label: "Inclination", value: selected.inclination },
                { label: "Period", value: selected.period },
                { label: "Band", value: selected.band },
                { label: "Signal", value: `${selected.signal}%` },
                { label: "Status", value: selected.status },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-sb-text-tertiary mb-1 text-[0.5625rem] font-medium uppercase tracking-[0.06em]">
                    {item.label}
                  </div>
                  <div className="font-mono text-sb-text-primary text-[0.8125rem] tabular-nums">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrbitalVisualization({
  satellites,
  onSelect,
  selected,
}: {
  satellites: SatelliteData[];
  onSelect: (s: SatelliteData) => void;
  selected: SatelliteData | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const hoverRef = useRef<SatelliteData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = 400;
    const h = 360;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;

    const orbitRadii: Record<string, number> = {
      LEO: 60,
      SSO: 75,
      MEO: 100,
      GEO: 130,
      HEO: 150,
      L1: 165,
    };

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(56,189,248,0.03)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < w; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let i = 0; i < h; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }

      // Earth
      const earthGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
      earthGrad.addColorStop(0, "#1e3a5f");
      earthGrad.addColorStop(0.7, "#0c2744");
      earthGrad.addColorStop(1, "#061520");
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = earthGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(56,189,248,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Earth glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 28, cx, cy, 45);
      glowGrad.addColorStop(0, "rgba(56,189,248,0.08)");
      glowGrad.addColorStop(1, "rgba(56,189,248,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Orbit rings
      Object.entries(orbitRadii).forEach(([orbit, radius]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${orbitColors[orbit as OrbitType].hex}15`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Satellites
      satellites.forEach((sat, i) => {
        const radius = orbitRadii[sat.orbit] || 100;
        const speed = sat.orbit === "LEO" || sat.orbit === "SSO" ? 0.008 : 0.002;
        const angle = time * speed + (i * Math.PI * 2) / satellites.length + i * 0.7;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius * 0.45; // Elliptical

        const isSelected = selected?.id === sat.id;
        const color = orbitColors[sat.orbit].hex;
        const size = isSelected ? 4 : 2.5;

        // Glow
        if (isSelected) {
          const satGlow = ctx.createRadialGradient(x, y, 0, x, y, 12);
          satGlow.addColorStop(0, `${color}40`);
          satGlow.addColorStop(1, `${color}00`);
          ctx.beginPath();
          ctx.arc(x, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = satGlow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Label for selected
        if (isSelected) {
          ctx.font = "9px 'JetBrains Mono'";
          ctx.fillStyle = color;
          ctx.fillText(sat.name, x + 8, y + 3);
        }
      });

      time++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animRef.current);
  }, [satellites, selected]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="w-[400px] h-[360px] rounded"
      />
    </div>
  );
}
