/**
 * SpaceByte — Supabase Data Hooks
 *
 * Each hook fetches from Supabase when configured, or falls back to
 * hardcoded data so the app works identically without a backend.
 */

import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import type { Launch, Satellite, Mission, IntelItem } from "./database.types";

// ── Generic fetch helper ──
function useSupabaseQuery<T>(
  tableName: string,
  fallbackData: T[],
  options?: {
    orderBy?: string;
    ascending?: boolean;
    filter?: { column: string; value: string };
  }
): { data: T[]; loading: boolean; error: string | null } {
  const [data, setData] = useState<T[]>(fallbackData);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return; // No Supabase → use fallback

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase!.from(tableName).select("*");

        if (options?.filter) {
          query = query.eq(options.filter.column, options.filter.value);
        }
        if (options?.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending ?? true,
          });
        }

        const { data: rows, error: err } = await query;

        if (cancelled) return;

        if (err) {
          console.error(`[SpaceByte] Error fetching ${tableName}:`, err);
          setError(err.message);
          // Keep fallback data on error
        } else if (rows && rows.length > 0) {
          setData(rows as T[]);
        }
        // If rows is empty, keep fallback data
      } catch (e) {
        if (!cancelled) {
          console.error(`[SpaceByte] Failed to fetch ${tableName}:`, e);
          setError(e instanceof Error ? e.message : "Unknown error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [tableName, options?.filter?.value]);

  return { data, loading, error };
}

// ── Fallback Data ──
// These match the seed data so the app works without Supabase

const FALLBACK_LAUNCHES: Launch[] = [
  {
    id: "sslv-d5", vehicle: "SSLV-D5", mission: "EOS-10", date: "2026-03-03", time: "09:30 IST",
    site: "SDSC-SHAR", pad: "FLP", orbit: "SSO-500", payload: "Earth Observation", payload_mass: "320 kg",
    status: "go", description: "Fifth developmental flight of Small Satellite Launch Vehicle carrying EOS-10 multispectral imaging satellite.",
    countdown: "T-04d 08h 32m", window: "09:30 — 10:15 IST", created_at: "", updated_at: "",
  },
  {
    id: "pslv-c61", vehicle: "PSLV-C61", mission: "Resourcesat-3", date: "2026-03-18", time: "11:00 IST",
    site: "SDSC-SHAR", pad: "SLP", orbit: "SSO-817", payload: "Earth Resources", payload_mass: "1,350 kg",
    status: "upcoming", description: "Continuation of the Resourcesat series for natural resource monitoring with advanced LISS-V sensor.",
    countdown: null, window: "11:00 — 11:30 IST", created_at: "", updated_at: "",
  },
  {
    id: "gslv-f16", vehicle: "GSLV-F16", mission: "NASA-ISRO SAR", date: "2026-04-12", time: "06:00 IST",
    site: "SDSC-SHAR", pad: "SLP-UB", orbit: "SSO-747", payload: "Dual-freq SAR", payload_mass: "2,800 kg",
    status: "upcoming", description: "Joint NASA-ISRO synthetic aperture radar mission. Dual-frequency (L+S band) radar for Earth surface dynamics.",
    countdown: null, window: "06:00 — 06:45 IST", created_at: "", updated_at: "",
  },
  {
    id: "lvm3-m6", vehicle: "LVM3-M6", mission: "OneWeb-India-2", date: "2026-05-20", time: "00:30 IST",
    site: "SDSC-SHAR", pad: "SLP-UB", orbit: "LEO-1200", payload: "36× OneWeb Sats", payload_mass: "5,796 kg",
    status: "upcoming", description: "Second commercial OneWeb constellation deployment by LVM3. 36 satellites to LEO for broadband coverage.",
    countdown: null, window: "00:30 — 01:00 IST", created_at: "", updated_at: "",
  },
  {
    id: "pslv-c62", vehicle: "PSLV-C62", mission: "XPoSat-2", date: "2026-06-15", time: "10:00 IST",
    site: "SDSC-SHAR", pad: "FLP", orbit: "LEO-650", payload: "X-ray Polarimetry", payload_mass: "480 kg",
    status: "upcoming", description: "Follow-up X-ray polarimetry satellite with enhanced spectral capabilities for cosmic source studies.",
    countdown: null, window: null, created_at: "", updated_at: "",
  },
  {
    id: "lvm3-g1", vehicle: "LVM3-G1", mission: "Gaganyaan-1", date: "2026-08-15", time: "07:00 IST",
    site: "SDSC-SHAR", pad: "SLP-G", orbit: "LEO-400", payload: "Crew Module (3)", payload_mass: "8,200 kg",
    status: "upcoming", description: "India's first crewed spaceflight. Three astronauts in a 400km orbit for a 3-day mission. Historic moment for ISRO.",
    countdown: null, window: "07:00 — 07:30 IST", created_at: "", updated_at: "",
  },
];

const FALLBACK_SATELLITES: Satellite[] = [
  { id: "1", name: "GSAT-24", norad: "56994", type: "Communication", orbit: "GEO", altitude: "35,786 km", inclination: "0.1°", period: "23h 56m", health: "nominal", signal: 97, launched: "2022-06-23", band: "Ku", status: "Active", created_at: "", updated_at: "" },
  { id: "2", name: "Cartosat-3A", norad: "58201", type: "Earth Observation", orbit: "SSO", altitude: "509 km", inclination: "97.5°", period: "94m 48s", health: "nominal", signal: 94, launched: "2025-08-15", band: "X", status: "Active", created_at: "", updated_at: "" },
  { id: "3", name: "RISAT-2BR2", norad: "48916", type: "SAR", orbit: "LEO", altitude: "556 km", inclination: "37.0°", period: "95m 42s", health: "nominal", signal: 91, launched: "2024-02-14", band: "X", status: "Active", created_at: "", updated_at: "" },
  { id: "4", name: "NVS-01", norad: "56710", type: "Navigation", orbit: "GEO", altitude: "35,786 km", inclination: "5.0°", period: "23h 56m", health: "nominal", signal: 98, launched: "2023-05-29", band: "L5/S", status: "Active", created_at: "", updated_at: "" },
  { id: "5", name: "NVS-02", norad: "59102", type: "Navigation", orbit: "GEO", altitude: "35,786 km", inclination: "28.0°", period: "23h 56m", health: "nominal", signal: 96, launched: "2026-02-20", band: "L5/S", status: "Active", created_at: "", updated_at: "" },
  { id: "6", name: "Aditya-L1", norad: "57888", type: "Solar Observatory", orbit: "L1", altitude: "1.5M km", inclination: "—", period: "177.86d", health: "nominal", signal: 88, launched: "2023-09-02", band: "S", status: "Science Ops", created_at: "", updated_at: "" },
  { id: "7", name: "INSAT-3DS", norad: "58910", type: "Meteorology", orbit: "GEO", altitude: "35,786 km", inclination: "0.2°", period: "23h 56m", health: "warning", signal: 76, launched: "2024-02-17", band: "S/C", status: "Degraded", created_at: "", updated_at: "" },
  { id: "8", name: "EOS-06", norad: "54363", type: "Earth Observation", orbit: "SSO", altitude: "720 km", inclination: "98.4°", period: "99m 12s", health: "nominal", signal: 93, launched: "2022-11-26", band: "X", status: "Active", created_at: "", updated_at: "" },
  { id: "9", name: "SPADEX-A", norad: "59050", type: "Technology Demo", orbit: "LEO", altitude: "470 km", inclination: "55.0°", period: "93m 48s", health: "nominal", signal: 89, launched: "2026-01-28", band: "S", status: "Docked", created_at: "", updated_at: "" },
  { id: "10", name: "SPADEX-B", norad: "59051", type: "Technology Demo", orbit: "LEO", altitude: "470 km", inclination: "55.0°", period: "93m 48s", health: "nominal", signal: 87, launched: "2026-01-28", band: "S", status: "Docked", created_at: "", updated_at: "" },
  { id: "11", name: "GSAT-20", norad: "58777", type: "Communication", orbit: "GEO", altitude: "35,786 km", inclination: "0.1°", period: "23h 56m", health: "nominal", signal: 99, launched: "2024-11-18", band: "Ka", status: "Active", created_at: "", updated_at: "" },
  { id: "12", name: "Chandrayaan-4", norad: "59100", type: "Lunar Probe", orbit: "HEO", altitude: "384,400 km", inclination: "28.6°", period: "—", health: "nominal", signal: 82, launched: "2026-01-15", band: "S/X", status: "In Transit", created_at: "", updated_at: "" },
];

const FALLBACK_MISSIONS: Mission[] = [
  { id: "chandrayaan-4", name: "Chandrayaan-4", type: "Lunar Sample Return", status: "active", phase: "Trans-Lunar Injection", progress: 38, launch_date: "2026-01-15", vehicle: "LVM3-M5", mission_day: 43, telemetry_altitude: "384,400 km", telemetry_velocity: "1.02 km/s", telemetry_fuel: "67%", description: "India's first lunar sample return mission. Spacecraft en route to lunar orbit for descent and sample collection.", created_at: "", updated_at: "" },
  { id: "gaganyaan-1", name: "Gaganyaan-1", type: "Human Spaceflight", status: "preparation", phase: "Crew Training Phase III", progress: 72, launch_date: "2026-08-15", vehicle: "LVM3-G1", mission_day: 0, telemetry_altitude: "—", telemetry_velocity: "—", telemetry_fuel: "—", description: "India's maiden human spaceflight program. Crew module and service module undergoing final integration.", created_at: "", updated_at: "" },
  { id: "aditya-l1", name: "Aditya-L1", type: "Solar Observatory", status: "operational", phase: "L1 Halo Orbit — Science Ops", progress: 100, launch_date: "2023-09-02", vehicle: "PSLV-C57", mission_day: 908, telemetry_altitude: "1.5M km", telemetry_velocity: "29.8 km/s", telemetry_fuel: "81%", description: "Solar observation mission at Sun-Earth L1 point. All seven payloads operational and returning science data.", created_at: "", updated_at: "" },
  { id: "spadex", name: "SPADEX", type: "Docking Experiment", status: "operational", phase: "Proximity Ops — Docked", progress: 100, launch_date: "2026-01-28", vehicle: "PSLV-C60", mission_day: 30, telemetry_altitude: "470 km", telemetry_velocity: "7.6 km/s", telemetry_fuel: "44%", description: "Space docking experiment demonstrating autonomous rendezvous and docking capability in LEO.", created_at: "", updated_at: "" },
  { id: "nisar", name: "NASA-ISRO SAR", type: "Earth Observation", status: "preparation", phase: "Launch Campaign", progress: 88, launch_date: "2026-04-12", vehicle: "GSLV-F16", mission_day: 0, telemetry_altitude: "—", telemetry_velocity: "—", telemetry_fuel: "—", description: "Joint NASA-ISRO dual-frequency SAR mission for Earth surface dynamics, ecosystem disturbances, and ice sheet collapse.", created_at: "", updated_at: "" },
  { id: "shukrayaan", name: "Shukrayaan-1", type: "Venus Orbiter", status: "concept", phase: "Phase-A Study", progress: 15, launch_date: "2028-12", vehicle: "GSLV Mk III", mission_day: 0, telemetry_altitude: "—", telemetry_velocity: "—", telemetry_fuel: "—", description: "Proposed Venus orbiter mission to study the surface and atmosphere of Venus using synthetic aperture radar.", created_at: "", updated_at: "" },
];

const FALLBACK_INTEL: IntelItem[] = [
  { id: "1", time: "14:32", date: "2026-02-27", category: "LAUNCH", priority: "high", title: "Gaganyaan-1 Crew Training Phase III Completed", body: "All three astronauts have completed high-altitude survival and zero-G parabolic training at HSFC Bengaluru. Crew module integration on track for Q3 launch window. Medical clearance pending final review.", source: "ISRO HSFC", tags: ["Gaganyaan", "Human Spaceflight", "HSFC"], created_at: "", updated_at: "" },
  { id: "2", time: "13:18", date: "2026-02-27", category: "ORBIT", priority: "high", title: "Chandrayaan-4 Orbit Insertion Burn Confirmed", body: "Propulsion module executed 42-second burn at periapsis for lunar orbit insertion. Telemetry confirms 100km × 100km circular orbit achieved. Descent module separation scheduled for T+45d.", source: "ISTRAC Bengaluru", tags: ["Chandrayaan-4", "Lunar", "Orbit Mechanics"], created_at: "", updated_at: "" },
  { id: "3", time: "12:05", date: "2026-02-27", category: "POLICY", priority: "medium", title: "IN-SPACe Approves 3 New Commercial Launch Providers", body: "Indian National Space Promotion and Authorization Centre grants operational licenses to Skyroot Aerospace (Vikram-II), Agnikul Cosmos (Agnibaan SOrTeD), and Bellatrix Aerospace (launch services). Launches expected from 2027.", source: "IN-SPACe", tags: ["Commercial", "Policy", "Licensing"], created_at: "", updated_at: "" },
  { id: "4", time: "10:44", date: "2026-02-27", category: "ORBIT", priority: "medium", title: "GSAT-24 Transponder C7 Elevated Thermal Signature", body: "Ku-band transponder C7 on GSAT-24 reporting temperatures 12°C above nominal baseline. NSIL monitoring with contingency plan to switch to backup transponder C7-R. No service disruption reported.", source: "MCF Hassan", tags: ["GSAT-24", "Thermal", "Anomaly"], created_at: "", updated_at: "" },
  { id: "5", time: "09:22", date: "2026-02-27", category: "LAUNCH", priority: "medium", title: "SSLV-D5 Vehicle Integration Started at SDSC-SHAR", body: "Stage stacking operations commenced at First Launch Pad for SSLV-D5 / EOS-10 mission. SS1 solid motor already mounted on launch platform. Payload integration in clean room FIC-01.", source: "SDSC-SHAR", tags: ["SSLV", "Integration", "EOS-10"], created_at: "", updated_at: "" },
  { id: "6", time: "08:15", date: "2026-02-27", category: "COMMERCIAL", priority: "low", title: "NSIL Signs $140M Contract for GSAT-25 Transponder Lease", body: "NewSpace India Limited signs multi-year transponder lease agreement with Tata Play for GSAT-25 Ka-band capacity. Expected launch Q1 2027 on LVM3.", source: "NSIL", tags: ["NSIL", "Commercial", "GSAT-25"], created_at: "", updated_at: "" },
  { id: "7", time: "06:30", date: "2026-02-27", category: "SCIENCE", priority: "medium", title: "Aditya-L1 VELC Captures New Coronal Mass Ejection Data", body: "Visible Emission Line Coronagraph records high-resolution imagery of CME event S2026-019. Data downlinked to ISSDC. Solar wind parameters shared with NOAA for space weather forecasting.", source: "ISSDC Bengaluru", tags: ["Aditya-L1", "Solar", "CME"], created_at: "", updated_at: "" },
  { id: "8", time: "22:10", date: "2026-02-26", category: "DEFENSE", priority: "high", title: "DRDO ASAT Deterrence Test — Debris-Free Simulation Success", body: "Defence Research Organisation completes software-defined ASAT engagement simulation with zero debris generation profile. Test validates kinetic kill vehicle tracking algorithms against LEO target signatures.", source: "DRDO", tags: ["DRDO", "ASAT", "Defense"], created_at: "", updated_at: "" },
];

// ── Public Hooks ──

export function useLaunches() {
  return useSupabaseQuery<Launch>("launches", FALLBACK_LAUNCHES, {
    orderBy: "date",
    ascending: true,
  });
}

export function useSatellites() {
  return useSupabaseQuery<Satellite>("satellites", FALLBACK_SATELLITES, {
    orderBy: "name",
    ascending: true,
  });
}

export function useMissions() {
  return useSupabaseQuery<Mission>("missions", FALLBACK_MISSIONS, {
    orderBy: "launch_date",
    ascending: true,
  });
}

export function useIntelFeed(category?: string) {
  const filter = category && category !== "ALL"
    ? { column: "category", value: category }
    : undefined;

  return useSupabaseQuery<IntelItem>("intel_feed", FALLBACK_INTEL, {
    orderBy: "date",
    ascending: false,
    filter,
  });
}

// Re-export fallback data for components that need static references (e.g. Terminal dashboard summaries)
export { FALLBACK_LAUNCHES, FALLBACK_SATELLITES, FALLBACK_MISSIONS, FALLBACK_INTEL };
