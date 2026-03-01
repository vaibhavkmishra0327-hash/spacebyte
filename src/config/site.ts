// ============================================================
// SpaceByte Template — Site Configuration
// ============================================================
// Customize every aspect of your dashboard from this single file.
// No need to dig through components — just change values here.
// ============================================================

export const siteConfig = {
  // ── Branding ──
  name: "SpaceByte",
  tagline: "India's Space Intelligence Terminal",
  description:
    "Real-time space operations dashboard tracking launches, satellites, missions, and intelligence from India's space programme.",
  url: "https://spacebyte.vercel.app",
  author: "Vaibhav Mishra",

  // ── Navigation ──
  // Icons are from lucide-react — see https://lucide.dev/icons
  // You can add/remove/reorder items here.
  nav: [
    { path: "/", label: "Home", icon: "Home" },
    { path: "/terminal", label: "Terminal", icon: "Activity" },
    { path: "/missions", label: "Missions", icon: "Rocket" },
    { path: "/constellation", label: "Constellation", icon: "Satellite" },
    { path: "/launches", label: "Launches", icon: "CalendarDays" },
    { path: "/intel", label: "Intel Feed", icon: "Radio" },
  ],

  // ── Hero Section (Homepage) ──
  hero: {
    badge: "LIVE OPERATIONS",
    heading: "India's Space\nIntelligence Terminal",
    subheading:
      "Real-time mission tracking, orbital telemetry, and launch intelligence — all in one terminal.",
    cta: { label: "Enter Terminal", path: "/terminal" },
  },

  // ── Homepage Stats ──
  stats: [
    { label: "Active Satellites", value: 58, suffix: "+", iconColor: "text-sb-cyan", iconBg: "bg-sb-cyan/10", icon: "Satellite" },
    { label: "Launches 2026", value: 12, iconColor: "text-sb-violet", iconBg: "bg-sb-violet/10", icon: "Rocket" },
    { label: "Uplink Rate", value: 99.7, suffix: "%", iconColor: "text-sb-green", iconBg: "bg-sb-green/10", icon: "TrendingUp" },
    { label: "Intel Sources", value: 24, iconColor: "text-sb-amber", iconBg: "bg-sb-amber/10", icon: "Radio" },
  ],

  // ── Feature Cards (Homepage) ──
  features: [
    {
      icon: "Rocket",
      iconColor: "text-sb-cyan",
      iconBg: "bg-sb-cyan/10",
      title: "Launch Command",
      description: "Live countdown, vehicle specs, pad status, and payload data for every scheduled launch.",
      link: "/launches",
    },
    {
      icon: "Satellite",
      iconColor: "text-sb-violet",
      iconBg: "bg-sb-violet/10",
      title: "Constellation Grid",
      description: "Track every satellite in ISRO's constellation — orbit, health, signal strength, and telemetry.",
      link: "/constellation",
    },
    {
      icon: "Activity",
      iconColor: "text-sb-green",
      iconBg: "bg-sb-green/10",
      title: "Mission Ops",
      description: "Deep-dive into active missions with real-time phase tracking and telemetry dashboards.",
      link: "/missions",
    },
    {
      icon: "Radio",
      iconColor: "text-sb-amber",
      iconBg: "bg-sb-amber/10",
      title: "Intel Feed",
      description: "Curated intelligence stream from launch sites, tracking stations, and policy channels.",
      link: "/intel",
    },
  ],

  // ── Supabase Configuration ──
  // These are read from environment variables at build time.
  // Set them in .env or your hosting provider's environment settings.
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },

  // ── Theme ──
  // Colors are defined in src/styles/theme.css via CSS variables.
  // To change the color scheme, edit the variables there.
  // The template supports both dark (default) and light mode.
  theme: {
    defaultMode: "dark" as "dark" | "light",
    // Set to true to respect the user's OS preference
    respectSystemPreference: true,
  },

  // ── Footer / Credit ──
  footer: {
    text: "Built with SpaceByte Template",
    link: "https://github.com/vaibhavkmishra0327-hash/spacebyte",
  },
} as const;

export type SiteConfig = typeof siteConfig;
