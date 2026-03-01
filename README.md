<div align="center">

# 🚀 SpaceByte — Dashboard Template

### A premium React + Tailwind CSS dashboard with a cinematic space-operations aesthetic

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-spacebyte.vercel.app-00d4ff?style=for-the-badge)](https://spacebyte.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

*Dark mode (default) + Light mode included*

</div>

---

## ✨ Why SpaceByte?

Most dashboard templates look the same — corporate, sterile, forgettable. **SpaceByte is different.** It's a fully-animated, cinematic terminal UI that feels like a mission control center. Built with production-grade code and a design system that makes every page feel alive.

**Perfect for:** SaaS dashboards, monitoring tools, analytics platforms, developer portfolios, crypto dashboards, gaming stat trackers, IoT control panels — or anything that needs to look premium and futuristic.

---

## 🎯 What You Get

### 6 Fully-Built Pages

| Page | Description |
|------|-------------|
| **Homepage** | Animated hero with countdown timer, floating metric cards, feature grid, CTA section |
| **Terminal** | Real-time operations dashboard with data panels, charts, status indicators |
| **Missions** | Expandable mission cards with progress bars, telemetry data, phase tracking |
| **Constellation** | Satellite tracking grid with health indicators, signal bars, orbit data |
| **Launches** | Launch schedule with vehicle specs, payload info, pad status, countdown |
| **Intel Feed** | Categorized news feed with priority tags, source badges, category filters |

### 40+ UI Components

- Animated counters & pulse indicators
- Data panels with glow effects
- Interactive star field background (canvas-based)
- System clock with IST/UTC/MET display
- Smooth page transitions (Framer Motion)
- Responsive navigation with mobile bottom bar
- All shadcn/ui components included

### Design System

- **100+ CSS custom properties** for complete theming control
- **Dark mode** (deep cosmic black) — default
- **Light mode** (clean, professional) — toggle included
- Custom typography scale, spacing, border system
- Glow effects, gradients, glassmorphism panels

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite 6** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Recharts** | Data visualization / charts |
| **Lucide React** | Icon system (487 icons) |
| **Radix UI** | Accessible headless UI primitives |
| **React Router 7** | Client-side routing |
| **Supabase** | Backend (optional — works without it) |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/vaibhavkmishra0327-hash/spacebyte.git
cd spacebyte
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — the dashboard works immediately with built-in fallback data. No backend required.

### 3. (Optional) Connect Supabase Backend

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then run the SQL files in Supabase SQL Editor:
1. `supabase/schema.sql` — creates tables with RLS
2. `supabase/seed.sql` — populates sample data

### 4. Build for Production

```bash
npm run build
npm run preview  # test the production build locally
```

### 5. Deploy

One-click deploy to Vercel, Netlify, or any static host:

```bash
npx vercel --prod
```

---

## 🎨 Customization

### Site Configuration

All customizable values live in **one file**: `src/config/site.ts`

```typescript
export const siteConfig = {
  name: "YourBrand",
  tagline: "Your Tagline Here",
  hero: {
    heading: "Your Dashboard\nHeading",
    subheading: "Your description text here.",
    cta: { label: "Get Started", path: "/dashboard" },
  },
  // ... stats, features, nav items, theme settings
};
```

### Colors & Theme

All colors are CSS custom properties in `src/styles/theme.css`:

```css
:root {
  --sb-void: #040812;        /* Background */
  --sb-cyan: #38bdf8;        /* Primary accent */
  --sb-violet: #a78bfa;      /* Secondary accent */
  --sb-green: #34d399;       /* Success */
  --sb-amber: #fbbf24;       /* Warning */
  --sb-red: #f87171;         /* Error */
  /* ... 100+ more variables */
}
```

Change the variables and the entire dashboard updates.

### Adding New Pages

1. Create your component in `src/app/components/`
2. Add a route in `src/app/routes.ts`
3. Add a nav item in `src/config/site.ts`

---

## 📁 Project Structure

```
src/
├── config/
│   └── site.ts              # ← All customization here
├── app/
│   ├── App.tsx              # App entry point
│   ├── routes.ts            # Route definitions
│   └── components/
│       ├── Homepage.tsx      # Animated landing page
│       ├── Terminal.tsx      # Operations dashboard
│       ├── Missions.tsx      # Mission tracker
│       ├── Constellation.tsx # Satellite grid
│       ├── Launches.tsx      # Launch schedule
│       ├── IntelFeed.tsx     # Categorized news feed
│       ├── Layout.tsx        # Shell + navigation
│       ├── Starfield.tsx     # Canvas star background
│       ├── ThemeToggle.tsx   # Dark/light mode switch
│       ├── SystemClock.tsx   # Multi-timezone clock
│       ├── PulseIndicator.tsx
│       ├── AnimatedCounter.tsx
│       ├── DataPanel.tsx
│       └── ui/              # 40+ shadcn/ui components
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── database.types.ts    # TypeScript types
│   └── hooks.ts             # Data hooks with fallbacks
├── styles/
│   ├── theme.css            # Design system (100+ variables)
│   ├── tailwind.css         # Tailwind config
│   ├── index.css            # Global styles
│   └── fonts.css            # Typography
└── main.tsx                 # Entry point

supabase/
├── schema.sql               # Database schema + RLS policies
└── seed.sql                 # Sample data
```

---

## 📱 Responsive

- **Desktop:** Full layout with floating navigation
- **Tablet:** Adapted grid layouts
- **Mobile:** Bottom navigation bar, stacked cards, touch-friendly

---

## ⚡ Performance

- **Vite 6** — sub-second HMR, optimized production bundles
- **Canvas starfield** — GPU-accelerated, zero layout thrash
- **CSS variables** — instant theme switching without re-renders
- **Fallback data** — works instantly without any backend

---

## 📄 License

MIT — use for personal projects, client work, SaaS products, anything.

---

<div align="center">

**Built by [Vaibhav Mishra](https://github.com/vaibhavkmishra0327-hash)**

⭐ Star this repo if you find it useful!

</div>