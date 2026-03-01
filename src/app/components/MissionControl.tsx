import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Rocket,
  MapPin,
  Cloud,
  Wind,
  Thermometer,
  Gauge,
  Radio,
  Satellite,
  Timer,
  Zap,
  X,
  Maximize2,
  Activity,
} from "lucide-react";
import { PulseIndicator } from "./PulseIndicator";

/* ── Mission Data ── */
const missionData: Record<string, {
  name: string;
  vehicle: string;
  mission: string;
  launchDate: string;
  site: string;
  pad: string;
  orbit: string;
  payload: string;
  payloadMass: string;
  description: string;
  status: string;
}> = {
  "sslv-d5": {
    name: "SSLV-D5",
    vehicle: "SSLV-D5",
    mission: "EOS-10",
    launchDate: "2026-03-03T04:00:00Z",
    site: "SDSC-SHAR, Sriharikota",
    pad: "First Launch Pad",
    orbit: "SSO-500",
    payload: "Earth Observation Satellite",
    payloadMass: "320 kg",
    description: "Fifth developmental flight of Small Satellite Launch Vehicle carrying EOS-10 multispectral imaging satellite.",
    status: "GO",
  },
  "gaganyaan-1": {
    name: "Gaganyaan-1",
    vehicle: "LVM3-G1",
    mission: "Gaganyaan-1",
    launchDate: "2026-08-15T01:30:00Z",
    site: "SDSC-SHAR, Sriharikota",
    pad: "Second Launch Pad - G",
    orbit: "LEO-400",
    payload: "Crew Module (3 Astronauts)",
    payloadMass: "8,200 kg",
    description: "India's first crewed spaceflight. Three astronauts in 400km orbit for a 3-day mission.",
    status: "PREPARATION",
  },
};

/* ── Live Countdown ── */
function MissionCountdown({ targetDate }: { targetDate: string }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(targetDate);
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1">
      {[
        { label: "D", value: time.d },
        { label: "H", value: time.h },
        { label: "M", value: time.m },
        { label: "S", value: time.s },
      ].map((seg, i) => (
        <div key={seg.label} className="flex items-center gap-1">
          <div className="text-center">
            <motion.div
              key={seg.value}
              initial={{ y: -4, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-sb-text-hero tabular-nums text-[3.5rem] font-semibold leading-none"
            >
              {seg.value.toString().padStart(2, "0")}
            </motion.div>
            <div
              className="font-mono text-sb-text-tertiary mt-1 text-[0.5rem] tracking-[0.2em]"
            >
              {seg.label === "D" ? "DAYS" : seg.label === "H" ? "HOURS" : seg.label === "M" ? "MINS" : "SECS"}
            </div>
          </div>
          {i < 3 && (
            <span className="text-sb-cyan/20 font-mono mb-5 mx-2 text-[2.5rem]">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Rocket Schematic ── */
function RocketSchematic() {
  return (
    <div className="relative w-20 h-64 mx-auto">
      {/* Simplified rocket shape using CSS */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative w-full h-full"
      >
        {/* Nose cone */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 sb-rocket-nose"
        />
        {/* Body */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-32 bg-gradient-to-b from-sb-cyan/15 to-sb-cyan/5 rounded-sm border border-sb-cyan/10" />
        {/* Stage 2 */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-10 h-10 bg-gradient-to-b from-sb-cyan/10 to-sb-violet/5 rounded-sm border border-sb-cyan/8" />
        {/* Stage 1 */}
        <div className="absolute top-50 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-sb-violet/10 to-sb-amber/5 rounded-sm border border-sb-violet/8" />
        {/* Exhaust glow */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-12 rounded-full sb-exhaust-glow"
          animate={{ opacity: [0.4, 0.8, 0.4], scaleY: [0.9, 1.1, 0.9] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Stage labels */}
        <div className="absolute top-12 -right-16 font-mono text-sb-text-tertiary text-[0.5rem] tracking-[0.05em]">
          PAYLOAD
        </div>
        <div className="absolute top-42 -right-12 font-mono text-sb-text-tertiary text-[0.5rem] tracking-[0.05em]">
          SS-2
        </div>
        <div className="absolute top-54 -right-12 font-mono text-sb-text-tertiary text-[0.5rem] tracking-[0.05em]">
          SS-1
        </div>
      </motion.div>
    </div>
  );
}

/* ── Telemetry Value ── */
function TelemetryValue({
  label,
  value,
  unit,
  icon: Icon,
  color = "text-sb-cyan",
  delay = 0,
}: {
  label: string;
  value: string;
  unit?: string;
  icon: typeof Gauge;
  color?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="sb-panel rounded-lg p-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-3 h-3 ${color}`} />
        <span
          className="font-mono text-sb-text-tertiary uppercase text-[0.5rem] tracking-[0.1em]"
        >
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-mono ${color} tabular-nums text-[1.125rem] font-semibold`}>
          {value}
        </span>
        {unit && (
          <span className="font-mono text-sb-text-tertiary text-[0.625rem]">
            {unit}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════
   MISSION CONTROL — Full Immersive Mode
   ══════════════════════════════════════════════════ */
export function MissionControl() {
  const navigate = useNavigate();
  const { id } = useParams();
  const mission = missionData[id || "sslv-d5"] || missionData["sslv-d5"];
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Grid overlay background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 sb-grid-overlay"
      />

      {/* Top scan line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px z-50 sb-scan-line"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Top Control Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-sb-border bg-sb-void/80 backdrop-blur-2xl"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/launches")}
            className="flex items-center gap-2 text-sb-text-secondary hover:text-sb-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[0.8125rem]">Back to Launches</span>
          </button>
          <div className="w-px h-4 bg-sb-border" />
          <div className="flex items-center gap-2">
            <PulseIndicator status="live" />
            <span
              className="font-mono text-sb-cyan text-[0.5625rem] font-semibold tracking-[0.12em] uppercase"
            >
              Mission Control Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sb-text-tertiary text-[0.625rem] tracking-[0.06em] uppercase">
            {mission.vehicle} · {mission.mission}
          </span>
          <button
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
            className="p-1.5 rounded-lg hover:bg-sb-surface-2/50 text-sb-text-tertiary hover:text-sb-text-primary transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/launches")}
            aria-label="Close mission control"
            className="p-1.5 rounded-lg hover:bg-sb-surface-2/50 text-sb-text-tertiary hover:text-sb-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Main Mission Control Content */}
      <div className="relative z-10 flex h-[calc(100vh-52px)]">
        {/* Left Telemetry Panel */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-72 border-r border-sb-border/50 p-4 space-y-3 overflow-y-auto bg-sb-void/40 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-3.5 h-3.5 text-sb-cyan" />
            <span
              className="font-mono text-sb-cyan uppercase text-[0.5625rem] font-semibold tracking-[0.1em]"
            >
              Telemetry
            </span>
          </div>

          <TelemetryValue label="Altitude" value="0.0" unit="km" icon={Gauge} delay={0.5} />
          <TelemetryValue label="Velocity" value="0.00" unit="km/s" icon={Zap} color="text-sb-green" delay={0.6} />
          <TelemetryValue label="Downrange" value="0.0" unit="km" icon={MapPin} color="text-sb-violet" delay={0.7} />
          <TelemetryValue label="G-Load" value="1.0" unit="G" icon={Activity} color="text-sb-amber" delay={0.8} />
          <TelemetryValue label="Flight Time" value="T-00:00" icon={Timer} color="text-sb-text-secondary" delay={0.9} />

          <div className="pt-3 border-t border-sb-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-3.5 h-3.5 text-sb-green" />
              <span className="font-mono text-sb-green uppercase text-[0.5625rem] font-semibold tracking-[0.1em]">
                Systems Check
              </span>
            </div>
            {[
              { name: "Guidance", status: "GO" },
              { name: "Propulsion", status: "GO" },
              { name: "Avionics", status: "GO" },
              { name: "Telemetry", status: "GO" },
              { name: "Range Safety", status: "GO" },
              { name: "Weather", status: "GO" },
            ].map((sys, i) => (
              <motion.div
                key={sys.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.05 }}
                className="flex items-center justify-between py-1.5"
              >
                <span className="text-sb-text-secondary text-xs">
                  {sys.name}
                </span>
                <span
                  className="font-mono text-sb-green text-[0.5625rem] font-semibold tracking-[0.06em]"
                >
                  {sys.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Center — Countdown & Schematic */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Radial grid */}
          <div
            className="absolute inset-0 pointer-events-none sb-radial-glow"
          />

          {/* Mission status badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-sb-green/20 bg-sb-green/5 mb-8"
          >
            <PulseIndicator status="nominal" />
            <span
              className="font-mono text-sb-green text-[0.5625rem] font-semibold tracking-[0.1em] uppercase"
            >
              Status — {mission.status}
            </span>
          </motion.div>

          {/* Mission name */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mb-4"
          >
            <h1
              className="font-display text-sb-text-hero text-[2rem] font-semibold tracking-[-0.03em]"
            >
              {mission.vehicle}
            </h1>
            <p className="text-sb-text-secondary text-[0.9375rem]">
              {mission.mission} · {mission.payload}
            </p>
          </motion.div>

          {/* Central countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mb-10"
          >
            <div className="font-mono text-sb-text-tertiary text-center mb-4 text-[0.625rem] tracking-[0.15em] uppercase">
              T-Minus to Launch
            </div>
            <MissionCountdown targetDate={mission.launchDate} />
          </motion.div>

          {/* Rocket schematic */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <RocketSchematic />
          </motion.div>

          {/* Launch site info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-6 flex items-center gap-4"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-sb-amber" />
              <span className="text-sb-text-secondary text-xs">{mission.site}</span>
            </div>
            <div className="w-px h-3 bg-sb-border" />
            <span className="font-mono text-sb-text-tertiary text-[0.6875rem]">
              Pad: {mission.pad}
            </span>
            <div className="w-px h-3 bg-sb-border" />
            <span className="font-mono text-sb-text-tertiary text-[0.6875rem]">
              Target: {mission.orbit}
            </span>
          </motion.div>
        </div>

        {/* Right — Weather & Info Panel */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-72 border-l border-sb-border/50 p-4 space-y-4 overflow-y-auto bg-sb-void/40 backdrop-blur-xl"
        >
          {/* Weather */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="w-3.5 h-3.5 text-sb-amber" />
              <span className="font-mono text-sb-amber uppercase text-[0.5625rem] font-semibold tracking-[0.1em]">
                Weather Overlay
              </span>
            </div>
            <div className="space-y-2">
              {[
                { icon: Thermometer, label: "Temperature", value: "28°C", color: "text-sb-amber" },
                { icon: Wind, label: "Wind Speed", value: "12 kts", color: "text-sb-cyan" },
                { icon: Cloud, label: "Cloud Base", value: "4,200 ft", color: "text-sb-text-secondary" },
                { icon: Gauge, label: "Visibility", value: "10+ km", color: "text-sb-green" },
              ].map((w, i) => (
                <motion.div
                  key={w.label}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-sb-surface-1/30"
                >
                  <div className="flex items-center gap-2">
                    <w.icon className={`w-3 h-3 ${w.color}`} />
                    <span className="text-sb-text-tertiary text-[0.6875rem]">
                      {w.label}
                    </span>
                  </div>
                  <span className={`font-mono ${w.color} tabular-nums text-xs font-medium`}>
                    {w.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mission Details */}
          <div className="pt-3 border-t border-sb-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-3.5 h-3.5 text-sb-violet" />
              <span
                className="font-mono text-sb-violet uppercase text-[0.5625rem] font-semibold tracking-[0.1em]"
              >
                Mission Brief
              </span>
            </div>
            <p className="text-sb-text-secondary mb-4 text-xs leading-[1.65]">
              {mission.description}
            </p>
            <div className="space-y-2.5">
              {[
                { label: "Vehicle", value: mission.vehicle },
                { label: "Payload", value: mission.payload },
                { label: "Mass", value: mission.payloadMass },
                { label: "Orbit", value: mission.orbit },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sb-text-tertiary text-[0.6875rem]">
                    {item.label}
                  </span>
                  <span className="font-mono text-sb-text-primary text-xs">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Refresh Pulse */}
          <div className="pt-3 border-t border-sb-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Satellite className="w-3.5 h-3.5 text-sb-cyan" />
              <span
                className="font-mono text-sb-cyan uppercase text-[0.5625rem] font-semibold tracking-[0.1em]"
              >
                Data Refresh
              </span>
            </div>
            <motion.div
              className="h-1 rounded-full bg-sb-surface-3 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-sb-cyan to-sb-violet rounded-full w-[40%]"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-mono text-sb-text-tertiary text-[0.5625rem]">
                Last update: 2s ago
              </span>
              <span className="font-mono text-sb-green text-[0.5625rem]">
                CONNECTED
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom status bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-2 border-t border-sb-border/50 bg-sb-void/80 backdrop-blur-2xl"
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-sb-text-tertiary text-[0.5625rem] tracking-[0.06em] uppercase">
            ISRO Ground Network
          </span>
          <div className="flex items-center gap-2">
            <PulseIndicator status="nominal" />
            <span className="font-mono text-sb-green text-[0.5625rem]">
              Bengaluru · Hassan · Port Blair
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sb-text-tertiary tabular-nums text-[0.625rem]">
            {new Date().toISOString().slice(11, 19)} UTC
          </span>
          <span className="font-mono text-sb-cyan text-[0.5625rem] font-semibold tracking-[0.08em]">
            MISSION CONTROL v2.0
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
