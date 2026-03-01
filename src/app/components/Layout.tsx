import { Outlet, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { useState, useEffect, useRef } from "react";
import {
  Activity,
  Rocket,
  Satellite,
  CalendarDays,
  Radio,
  Home,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";
import { Starfield } from "./Starfield";
import { SystemClock } from "./SystemClock";
import { PulseIndicator } from "./PulseIndicator";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/terminal", label: "Terminal", icon: Activity },
  { path: "/missions", label: "Missions", icon: Rocket },
  { path: "/constellation", label: "Constellation", icon: Satellite },
  { path: "/launches", label: "Launches", icon: CalendarDays },
  { path: "/intel", label: "Intel Feed", icon: Radio },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const isHomepage = location.pathname === "/";

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-screen bg-sb-void relative">
      <Starfield />

      {/* ── Floating Desktop Navigation ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          ${scrolled
            ? "bg-sb-void/80 backdrop-blur-2xl border-b border-sb-border shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : isHomepage
              ? "bg-transparent"
              : "bg-sb-surface-0/60 backdrop-blur-xl border-b border-sb-border/50"
          }
        `}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 group"
          >
            <img
              src="/logo.png"
              alt="SpaceByte"
              className="h-10 w-auto rounded-lg transition-transform duration-300 group-hover:scale-105 object-contain"
            />
            <div>
              <div
                className="font-display text-sb-text-primary tracking-tight text-[0.9375rem] font-semibold"
              >
                SpaceByte
              </div>
              <div
                className="font-mono text-sb-text-tertiary hidden sm:block text-[0.5rem] uppercase tracking-[0.1em] -mt-px"
              >
                Intelligence Terminal
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`
                    relative flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all duration-250 group
                    ${isActive
                      ? "text-sb-cyan"
                      : "text-sb-text-secondary hover:text-sb-text-primary"
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sb-cyan" : "text-sb-text-tertiary group-hover:text-sb-text-secondary"}`} />
                  <span className={`text-[0.8125rem] ${isActive ? 'font-medium' : 'font-normal'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-sb-cyan/[0.06] border border-sb-cyan/10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right side — Status, Theme & Clock */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <div className="w-px h-4 bg-sb-border" />
            <div className="flex items-center gap-2">
              <PulseIndicator status="live" />
              <span
                className="font-mono text-sb-cyan text-[0.5625rem] font-semibold uppercase tracking-[0.1em]"
              >
                Live
              </span>
            </div>
            <div className="w-px h-4 bg-sb-border" />
            <SystemClock />
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-sb-text-secondary hover:text-sb-text-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* ── Mobile Slide Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-sb-void/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col gap-2 pt-20 px-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
                      ${isActive
                        ? "bg-sb-cyan/8 text-sb-cyan"
                        : "text-sb-text-secondary hover:text-sb-text-primary hover:bg-sb-surface-2/30"
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-sb-cyan" : "text-sb-text-tertiary"}`} />
                    <span className={`text-base ${isActive ? 'font-medium' : 'font-normal'}`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="absolute bottom-8 left-6 right-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-sb-surface-1/50 border border-sb-border">
                <div className="flex items-center gap-2">
                  <PulseIndicator status="live" />
                  <span className="font-mono text-sb-green text-[0.625rem] uppercase tracking-[0.05em]">
                    Systems Nominal
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  <SystemClock />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Pill Nav ── */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <div className="flex items-center justify-around px-2 py-2 rounded-2xl bg-sb-surface-0/90 backdrop-blur-2xl border border-sb-border shadow-[0_-4px_30px_rgba(0,0,0,0.4)]">
          {navItems.filter(n => n.path !== "/").map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200
                  ${isActive ? "text-sb-cyan" : "text-sb-text-tertiary"}
                `}
              >
                <Icon className="w-4.5 h-4.5" />
                <span className={`text-[0.5625rem] ${isActive ? 'font-semibold' : 'font-normal'}`}>
                  {item.label.split(" ")[0]}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav"
                    className="absolute inset-0 rounded-xl bg-sb-cyan/[0.06]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Page content with transitions ── */}
      <main className={`relative z-10 ${isHomepage ? "" : "pt-14"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
