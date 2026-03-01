import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useNavigate } from "react-router";
import {
  Rocket,
  Satellite,
  TrendingUp,
  Radio,
  ArrowRight,
  ChevronDown,
  Zap,
  Globe,
  Activity,
  Shield,
} from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";
import { PulseIndicator } from "./PulseIndicator";

/* ── Countdown Timer ── */
function LaunchCountdown() {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date("2026-03-03T04:00:00Z"); // SSLV-D5 launch
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const segments = [
    { label: "DAYS", value: timeLeft.d },
    { label: "HRS", value: timeLeft.h },
    { label: "MIN", value: timeLeft.m },
    { label: "SEC", value: timeLeft.s },
  ];

  return (
    <div className="flex items-center gap-3">
      {segments.map((seg, i) => (
        <div key={seg.label} className="flex items-center gap-3">
          <div className="text-center">
            <div
              className="font-mono text-sb-text-hero tabular-nums text-[1.75rem] font-semibold leading-none"
            >
              {seg.value.toString().padStart(2, "0")}
            </div>
            <div
              className="font-mono text-sb-text-tertiary mt-1 text-[0.5rem] tracking-[0.15em]"
            >
              {seg.label}
            </div>
          </div>
          {i < 3 && (
            <span className="text-sb-cyan/30 font-mono text-lg mb-3">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Floating Metric Panel ── */
function FloatingMetric({
  label,
  value,
  suffix,
  icon: Icon,
  iconColor,
  iconBg,
  delay,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: typeof Rocket;
  iconColor: string;
  iconBg: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sb-panel sb-panel-hover rounded-xl px-5 py-4 cursor-default group [perspective:600px]"
      whileHover={{ y: -2, transition: { duration: 0.25 } }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="font-mono text-sb-text-tertiary uppercase tracking-wider text-[0.5625rem] tracking-[0.1em]"
        >
          {label}
        </span>
        <div
          className={`p-1.5 rounded-lg ${iconBg}`}
        >
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
      </div>
      <AnimatedCounter
        value={value}
        suffix={suffix || ""}
        className="font-mono tabular-nums"
        duration={2200}
      />
    </motion.div>
  );
}

/* ── Scroll Reveal Section ── */
function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Featured Launch Card ── */
function FeaturedLaunchCard() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className="sb-panel sb-panel-hover rounded-xl overflow-hidden cursor-pointer group"
      onClick={() => navigate("/launches")}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
    >
      <div className="p-5 border-b border-sb-border/50">
        <div className="flex items-center gap-2 mb-3">
          <PulseIndicator status="live" />
          <span
            className="font-mono text-sb-green uppercase text-[0.5625rem] font-semibold tracking-[0.08em]"
          >
            Next Launch — GO
          </span>
        </div>
        <h3 className="font-display text-sb-text-hero text-lg mb-1">
          SSLV-D5 · EOS-10
        </h3>
        <p className="text-sb-text-secondary text-[0.8125rem]">
          Earth Observation satellite to SSO-500 from SDSC-SHAR
        </p>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span
            className="font-mono text-sb-text-tertiary uppercase text-[0.5625rem] tracking-[0.1em]"
          >
            T-Minus
          </span>
          <span
            className="font-mono text-sb-amber uppercase text-[0.5625rem] tracking-[0.05em]"
          >
            SDSC-SHAR, Sriharikota
          </span>
        </div>
        <LaunchCountdown />
      </div>
      <div className="px-5 py-3 border-t border-sb-border/50 flex items-center justify-between">
        <span className="text-sb-text-tertiary text-xs">
          View mission details
        </span>
        <ArrowRight className="w-4 h-4 text-sb-text-tertiary group-hover:text-sb-cyan group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </motion.div>
  );
}

/* ── Intelligence Signal Card ── */
function IntelSignalCard() {
  const navigate = useNavigate();
  const signals = [
    { time: "14:32", tag: "LAUNCH", text: "Gaganyaan-1 crew training Phase III completed", tagColor: "text-sb-cyan bg-sb-cyan/10" },
    { time: "13:18", tag: "ORBIT", text: "Chandrayaan-4 orbit insertion burn confirmed", tagColor: "text-sb-green bg-sb-green/10" },
    { time: "12:05", tag: "POLICY", text: "IN-SPACe approves 3 new commercial launch providers", tagColor: "text-sb-amber bg-sb-amber/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className="sb-panel sb-panel-hover rounded-xl overflow-hidden cursor-pointer group"
      onClick={() => navigate("/intel")}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
    >
      <div className="p-5 border-b border-sb-border/50">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-3.5 h-3.5 text-sb-amber" />
          <span
            className="font-mono text-sb-amber uppercase text-[0.5625rem] font-semibold tracking-[0.08em]"
          >
            Intelligence Feed
          </span>
        </div>
        <p className="text-sb-text-secondary mt-1 text-xs">
          Latest signals from India's space ecosystem
        </p>
      </div>
      <div className="p-5 space-y-3">
        {signals.map((sig, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 + i * 0.1 }}
            className="flex gap-3"
          >
            <span
              className="font-mono text-sb-text-tertiary shrink-0 tabular-nums text-[0.625rem]"
            >
              {sig.time}
            </span>
            <div>
              <span
                className={`inline-block font-mono px-1.5 py-0.5 rounded mb-0.5 ${sig.tagColor} text-[0.5rem] font-semibold tracking-[0.06em]`}
              >
                {sig.tag}
              </span>
              <p className="text-sb-text-secondary text-xs leading-normal">
                {sig.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="px-5 py-3 border-t border-sb-border/50 flex items-center justify-between">
        <span className="text-sb-text-tertiary text-xs">
          Open full feed
        </span>
        <ArrowRight className="w-4 h-4 text-sb-text-tertiary group-hover:text-sb-cyan group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   HOMEPAGE — CINEMATIC HERO
   ══════════════════════════════════════════════ */
export function Homepage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.97]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, 60]);

  return (
    <div className="min-h-screen">
      {/* ── HERO SECTION ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Gradient depth layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top-center radial */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 sb-hero-glow-cyan"
          />
          {/* Bottom violet glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[400px] opacity-40 sb-hero-glow-violet"
          />
        </div>

        {/* Orbit ring animation around headline area */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="w-[600px] h-[600px] rounded-full border border-sb-cyan/[0.04]"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sb-cyan/30" />
          </motion.div>
          <motion.div
            className="absolute w-[450px] h-[450px] rounded-full border border-sb-violet/[0.03]"
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute bottom-0 right-0 w-1 h-1 rounded-full bg-sb-violet/20" />
          </motion.div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sb-border bg-sb-surface-1/50 backdrop-blur-xl mb-8"
          >
            <PulseIndicator status="live" />
            <span
              className="font-mono text-sb-cyan text-[0.625rem] font-semibold tracking-[0.12em] uppercase"
            >
              Space Intelligence Active
            </span>
            <div className="w-px h-3 bg-sb-border mx-1" />
            <span className="font-mono text-sb-text-tertiary text-[0.5625rem]">
              v2.0
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-sb-text-hero mb-6 text-[clamp(2.5rem,5.5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.04em]"
          >
            India's Space
            <br />
            <span className="sb-gradient-text">
              Intelligence Terminal
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-sb-text-secondary max-w-xl mx-auto mb-10 text-[1.0625rem] leading-[1.65]"
          >
            Real-time launches. Startup intelligence. Market analytics.
            <br />
            <span className="text-sb-text-tertiary">
              Tracking India's space ecosystem in one command interface.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => navigate("/terminal")}
              className="sb-cta-glow relative inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-sb-cyan text-sb-void font-display font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] text-sm"
            >
              Open Terminal
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/missions")}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl border border-sb-border text-sb-text-secondary hover:text-sb-text-primary hover:border-sb-border-active font-display font-medium transition-all duration-300 bg-sb-surface-1/30 backdrop-blur-xl text-sm"
            >
              View Missions
            </button>
          </motion.div>

          {/* Floating metrics row */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            <FloatingMetric label="Active Satellites" value={58} icon={Satellite} iconColor="text-sb-cyan" iconBg="bg-sb-cyan/10" delay={1.0} />
            <FloatingMetric label="FY26 Missions" value={14} icon={Rocket} iconColor="text-sb-green" iconBg="bg-sb-green/10" delay={1.1} />
            <FloatingMetric label="Success Rate" value={97.8} suffix="%" icon={TrendingUp} iconColor="text-sb-amber" iconBg="bg-sb-amber/10" delay={1.2} />
            <FloatingMetric label="Ground Stations" value={12} icon={Radio} iconColor="text-[#a78bfa]" iconBg="bg-[#a78bfa]/10" delay={1.3} />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-sb-text-tertiary text-[0.5625rem] tracking-[0.1em] uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4 text-sb-text-tertiary" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── FEATURED CONTENT SECTION ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <RevealSection className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-px bg-sb-cyan/30" />
            <span
              className="font-mono text-sb-cyan text-[0.625rem] font-semibold tracking-[0.12em] uppercase"
            >
              Mission Brief
            </span>
          </div>
          <h2
            className="font-display text-sb-text-hero mb-2 text-[1.75rem] font-semibold tracking-[-0.02em]"
          >
            What's happening now
          </h2>
          <p className="text-sb-text-secondary text-[0.9375rem]">
            Live intelligence from across India's space program.
          </p>
        </RevealSection>

        <div className="grid grid-cols-2 gap-5">
          <RevealSection delay={0.1}>
            <FeaturedLaunchCard />
          </RevealSection>
          <RevealSection delay={0.2}>
            <IntelSignalCard />
          </RevealSection>
        </div>
      </section>

      {/* ── CAPABILITIES SECTION ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <RevealSection className="text-center mb-16">
          <h2
            className="font-display text-sb-text-hero mb-3 text-[2rem] font-semibold tracking-[-0.03em]"
          >
            Intelligence infrastructure
            <br />
            <span className="text-sb-text-secondary">for the space economy.</span>
          </h2>
        </RevealSection>

        <div className="grid grid-cols-3 gap-5">
          {[
            {
              icon: Rocket,
              label: "Launch Tracking",
              desc: "Real-time manifest with countdown, vehicle telemetry, and launch site intelligence.",
              iconColor: "text-sb-cyan",
              iconBg: "bg-sb-cyan/10",
            },
            {
              icon: Globe,
              label: "Mission Control",
              desc: "Immersive mission view with trajectory visualization, weather data, and live telemetry.",
              iconColor: "text-sb-green",
              iconBg: "bg-sb-green/10",
            },
            {
              icon: Shield,
              label: "Constellation Watch",
              desc: "Track every Indian space asset in orbit — communications, EO, navigation, and deep space.",
              iconColor: "text-[#a78bfa]",
              iconBg: "bg-[#a78bfa]/10",
            },
            {
              icon: Zap,
              label: "Intel Feed",
              desc: "Curated intelligence from ISRO, IN-SPACe, DRDO, and commercial space companies.",
              iconColor: "text-sb-amber",
              iconBg: "bg-sb-amber/10",
            },
            {
              icon: TrendingUp,
              label: "Market Analytics",
              desc: "Startup funding, policy changes, and commercial space market data — all in one view.",
              iconColor: "text-[#fb7185]",
              iconBg: "bg-[#fb7185]/10",
            },
            {
              icon: Activity,
              label: "AI Intelligence",
              desc: "Context-aware insights, anomaly detection, and predictive analysis powered by ML.",
              iconColor: "text-[#e879f9]",
              iconBg: "bg-[#e879f9]/10",
            },
          ].map((item, i) => (
            <RevealSection key={item.label} delay={0.05 * i}>
              <motion.div
                className="sb-panel sb-panel-hover rounded-xl p-6 h-full cursor-default"
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${item.iconBg}`}
                >
                  <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <h3 className="font-display text-sb-text-primary mb-2 text-base font-medium">
                  {item.label}
                </h3>
                <p className="text-sb-text-secondary text-[0.8125rem] leading-[1.65]">
                  {item.desc}
                </p>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32">
        <RevealSection className="text-center">
          <div
            className="sb-panel sb-cta-section rounded-2xl p-12 text-center"
          >
            <h2
              className="font-display text-sb-text-hero mb-3 text-[1.75rem] font-semibold tracking-[-0.02em]"
            >
              Ready for launch?
            </h2>
            <p className="text-sb-text-secondary mb-8 max-w-md mx-auto text-[0.9375rem] leading-[1.6]">
              Access India's most comprehensive space intelligence platform. Real-time data. Zero noise.
            </p>
            <button
              onClick={() => navigate("/terminal")}
              className="sb-cta-glow relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-sb-cyan text-sb-void font-display font-medium transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] text-[0.9375rem]"
            >
              Enter Terminal
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </RevealSection>
      </section>
    </div>
  );
}
