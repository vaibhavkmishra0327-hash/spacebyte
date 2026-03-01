-- ============================================================
-- SpaceByte — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ── LAUNCHES TABLE ──
CREATE TABLE IF NOT EXISTS launches (
  id TEXT PRIMARY KEY,
  vehicle TEXT NOT NULL,
  mission TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  site TEXT NOT NULL,
  pad TEXT NOT NULL,
  orbit TEXT NOT NULL,
  payload TEXT NOT NULL,
  payload_mass TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'go', 'hold', 'success', 'scrubbed')),
  description TEXT NOT NULL,
  countdown TEXT,
  "window" TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── SATELLITES TABLE ──
CREATE TABLE IF NOT EXISTS satellites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  norad TEXT NOT NULL,
  type TEXT NOT NULL,
  orbit TEXT NOT NULL CHECK (orbit IN ('LEO', 'GEO', 'MEO', 'SSO', 'HEO', 'L1')),
  altitude TEXT NOT NULL,
  inclination TEXT NOT NULL,
  period TEXT NOT NULL,
  health TEXT NOT NULL CHECK (health IN ('nominal', 'warning', 'critical')),
  signal INTEGER NOT NULL CHECK (signal >= 0 AND signal <= 100),
  launched DATE NOT NULL,
  band TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── MISSIONS TABLE ──
CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'operational', 'preparation', 'concept', 'completed')),
  phase TEXT NOT NULL,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  launch_date TEXT NOT NULL,
  vehicle TEXT NOT NULL,
  mission_day INTEGER NOT NULL DEFAULT 0,
  telemetry_altitude TEXT DEFAULT '—',
  telemetry_velocity TEXT DEFAULT '—',
  telemetry_fuel TEXT DEFAULT '—',
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── INTEL FEED TABLE ──
CREATE TABLE IF NOT EXISTS intel_feed (
  id TEXT PRIMARY KEY,
  time TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('LAUNCH', 'ORBIT', 'POLICY', 'COMMERCIAL', 'DEFENSE', 'SCIENCE')),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  source TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── ROW LEVEL SECURITY — Public read, authenticated write ──
ALTER TABLE launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE satellites ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE intel_feed ENABLE ROW LEVEL SECURITY;

-- Public read access (using anon key)
CREATE POLICY "Public read launches" ON launches FOR SELECT USING (true);
CREATE POLICY "Public read satellites" ON satellites FOR SELECT USING (true);
CREATE POLICY "Public read missions" ON missions FOR SELECT USING (true);
CREATE POLICY "Public read intel_feed" ON intel_feed FOR SELECT USING (true);

-- Authenticated write access (for admin / future dashboard)
CREATE POLICY "Auth insert launches" ON launches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update launches" ON launches FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete launches" ON launches FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert satellites" ON satellites FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update satellites" ON satellites FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete satellites" ON satellites FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert missions" ON missions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update missions" ON missions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete missions" ON missions FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth insert intel_feed" ON intel_feed FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update intel_feed" ON intel_feed FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth delete intel_feed" ON intel_feed FOR DELETE USING (auth.role() = 'authenticated');

-- ── Auto-update updated_at timestamps ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER launches_updated_at BEFORE UPDATE ON launches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER satellites_updated_at BEFORE UPDATE ON satellites FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER intel_feed_updated_at BEFORE UPDATE ON intel_feed FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── INDEXES for common queries ──
CREATE INDEX idx_launches_status ON launches(status);
CREATE INDEX idx_launches_date ON launches(date);
CREATE INDEX idx_satellites_orbit ON satellites(orbit);
CREATE INDEX idx_satellites_health ON satellites(health);
CREATE INDEX idx_missions_status ON missions(status);
CREATE INDEX idx_intel_feed_category ON intel_feed(category);
CREATE INDEX idx_intel_feed_priority ON intel_feed(priority);
CREATE INDEX idx_intel_feed_date ON intel_feed(date DESC);
