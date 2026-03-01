import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  z: number; // depth layer 0-1
  r: number;
  baseOpacity: number;
  pulseSpeed: number;
  pulseOffset: number;
}

interface OrbitLine {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rotation: number;
  speed: number;
  opacity: number;
  dashOffset: number;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId: number;
    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = 0;
    let h = 0;
    const stars: Star[] = [];
    const orbits: OrbitLine[] = [];
    let mouseX = 0.5;
    let mouseY = 0.5;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      stars.length = 0;
      orbits.length = 0;

      // Stars — three depth layers
      const count = Math.min(Math.floor((w * h) / 3000), 500);
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: z < 0.3 ? Math.random() * 0.6 + 0.2 : z < 0.7 ? Math.random() * 1 + 0.4 : Math.random() * 1.5 + 0.6,
          baseOpacity: z < 0.3 ? Math.random() * 0.15 + 0.05 : z < 0.7 ? Math.random() * 0.3 + 0.1 : Math.random() * 0.5 + 0.2,
          pulseSpeed: Math.random() * 0.003 + 0.001,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }

      // Orbit lines — subtle elliptical arcs
      for (let i = 0; i < 3; i++) {
        orbits.push({
          cx: w * (0.3 + Math.random() * 0.4),
          cy: h * (0.3 + Math.random() * 0.4),
          rx: 150 + Math.random() * 250,
          ry: 60 + Math.random() * 100,
          rotation: Math.random() * Math.PI,
          speed: 0.0002 + Math.random() * 0.0003,
          opacity: 0.03 + Math.random() * 0.04,
          dashOffset: 0,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / w;
      mouseY = e.clientY / h;
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // ── Earth horizon glow at bottom ──
      const horizonY = h * 0.92;
      const horizonGrad = ctx.createRadialGradient(
        w * 0.5, h + 80, 0,
        w * 0.5, h + 80, h * 0.6
      );
      horizonGrad.addColorStop(0, "rgba(56, 189, 248, 0.08)");
      horizonGrad.addColorStop(0.3, "rgba(56, 189, 248, 0.03)");
      horizonGrad.addColorStop(0.5, "rgba(167, 139, 250, 0.015)");
      horizonGrad.addColorStop(1, "transparent");
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, 0, w, h);

      // ── Subtle horizon line ──
      const lineGrad = ctx.createLinearGradient(0, horizonY, w, horizonY);
      lineGrad.addColorStop(0, "transparent");
      lineGrad.addColorStop(0.2, "rgba(56, 189, 248, 0.06)");
      lineGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.12)");
      lineGrad.addColorStop(0.8, "rgba(56, 189, 248, 0.06)");
      lineGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.stroke();

      // ── Orbit line animations ──
      for (const orbit of orbits) {
        orbit.dashOffset += orbit.speed * 16;
        ctx.save();
        ctx.translate(orbit.cx, orbit.cy);
        ctx.rotate(orbit.rotation + time * 0.00003);
        ctx.strokeStyle = `rgba(56, 189, 248, ${orbit.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 12]);
        ctx.lineDashOffset = orbit.dashOffset;
        ctx.beginPath();
        ctx.ellipse(0, 0, orbit.rx, orbit.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // ── Light beams (slow-moving) ──
      const beamCount = 2;
      for (let i = 0; i < beamCount; i++) {
        const phase = time * 0.00005 + i * Math.PI;
        const bx = w * (0.3 + Math.sin(phase) * 0.3);
        const by = 0;
        const beamGrad = ctx.createLinearGradient(bx, by, bx + w * 0.02, h);
        beamGrad.addColorStop(0, "rgba(167, 139, 250, 0.015)");
        beamGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.008)");
        beamGrad.addColorStop(1, "transparent");
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(bx - 1, by);
        ctx.lineTo(bx + 1, by);
        ctx.lineTo(bx + w * 0.08, h);
        ctx.lineTo(bx - w * 0.04, h);
        ctx.closePath();
        ctx.fill();
      }

      // ── Stars with parallax depth ──
      const parallaxX = (mouseX - 0.5) * 12;
      const parallaxY = (mouseY - 0.5) * 8;

      for (const star of stars) {
        const pFactor = star.z * 0.8 + 0.2; // deeper stars move less
        const sx = star.x + parallaxX * pFactor;
        const sy = star.y + parallaxY * pFactor;

        const flicker = Math.sin(time * star.pulseSpeed + star.pulseOffset) * 0.3 + 0.7;
        const alpha = star.baseOpacity * flicker;

        // Color tint based on depth
        const r = star.z > 0.7 ? 200 : 180;
        const g = star.z > 0.7 ? 220 : 210;
        const b = 255;

        ctx.beginPath();
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // Glow on brighter stars
        if (star.z > 0.7 && star.r > 1) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.08})`;
          ctx.fill();
        }
      }

      // ── Ambient cosmic dust (very subtle) ──
      const dustPhase = time * 0.0001;
      const dustGrad = ctx.createRadialGradient(
        w * (0.3 + Math.sin(dustPhase) * 0.15),
        h * (0.4 + Math.cos(dustPhase) * 0.1),
        0,
        w * 0.5, h * 0.5,
        w * 0.4
      );
      dustGrad.addColorStop(0, "rgba(167, 139, 250, 0.012)");
      dustGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.006)");
      dustGrad.addColorStop(1, "transparent");
      ctx.fillStyle = dustGrad;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(render);
    };

    init();
    animationId = requestAnimationFrame(render);
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    return draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 sb-starfield"
      aria-hidden="true"
    />
  );
}
