import { useState, useEffect } from "react";

export function SystemClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const utc = time.toISOString().slice(11, 19);
  const ist = new Date(time.getTime() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .slice(11, 19);
  const missionDay = Math.floor(
    (time.getTime() - new Date("2026-01-01").getTime()) / 86400000
  );

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <span className="text-sb-text-tertiary text-[0.625rem] font-medium uppercase tracking-[0.05em]">UTC</span>
        <span className="font-mono text-sb-text-data text-xs font-medium tabular-nums">{utc}</span>
      </div>
      <div className="w-px h-3 bg-sb-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-sb-text-tertiary text-[0.625rem] font-medium uppercase tracking-[0.05em]">IST</span>
        <span className="font-mono text-sb-text-primary text-xs font-medium tabular-nums">{ist}</span>
      </div>
      <div className="w-px h-3 bg-sb-border" />
      <div className="flex items-center gap-1.5">
        <span className="text-sb-text-tertiary text-[0.625rem] font-medium uppercase tracking-[0.05em]">MJD</span>
        <span className="font-mono text-sb-amber-dim text-xs font-medium tabular-nums">+{missionDay}</span>
      </div>
    </div>
  );
}
