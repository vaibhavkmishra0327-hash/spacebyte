/**
 * SpaceByte — Supabase Database Types
 * Auto-generated type definitions matching supabase/schema.sql
 */

export interface Database {
  public: {
    Tables: {
      launches: {
        Row: {
          id: string;
          vehicle: string;
          mission: string;
          date: string;
          time: string;
          site: string;
          pad: string;
          orbit: string;
          payload: string;
          payload_mass: string;
          status: "upcoming" | "go" | "hold" | "success" | "scrubbed";
          description: string;
          countdown: string | null;
          window: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["launches"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["launches"]["Insert"]>;
      };
      satellites: {
        Row: {
          id: string;
          name: string;
          norad: string;
          type: string;
          orbit: "LEO" | "GEO" | "MEO" | "SSO" | "HEO" | "L1";
          altitude: string;
          inclination: string;
          period: string;
          health: "nominal" | "warning" | "critical";
          signal: number;
          launched: string;
          band: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["satellites"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["satellites"]["Insert"]>;
      };
      missions: {
        Row: {
          id: string;
          name: string;
          type: string;
          status: "active" | "operational" | "preparation" | "concept" | "completed";
          phase: string;
          progress: number;
          launch_date: string;
          vehicle: string;
          mission_day: number;
          telemetry_altitude: string;
          telemetry_velocity: string;
          telemetry_fuel: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["missions"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["missions"]["Insert"]>;
      };
      intel_feed: {
        Row: {
          id: string;
          time: string;
          date: string;
          category: "LAUNCH" | "ORBIT" | "POLICY" | "COMMERCIAL" | "DEFENSE" | "SCIENCE";
          priority: "high" | "medium" | "low";
          title: string;
          body: string;
          source: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["intel_feed"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["intel_feed"]["Insert"]>;
      };
    };
  };
}

/** Convenience row types */
export type Launch = Database["public"]["Tables"]["launches"]["Row"];
export type Satellite = Database["public"]["Tables"]["satellites"]["Row"];
export type Mission = Database["public"]["Tables"]["missions"]["Row"];
export type IntelItem = Database["public"]["Tables"]["intel_feed"]["Row"];
