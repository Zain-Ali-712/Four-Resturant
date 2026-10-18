"use client";

import { useEffect, useRef } from "react";

type Puff = { x: number; y: number; r: number; vx: number; vy: number; life: number; max: number; spin: number };

/**
 * Soft steam rising off a dish. Draws on a canvas only while it's on screen,
 * and stays still for people who prefer reduced motion.
 */
export function Smoke({
  className = "",
  density = 1,
  tint = "255, 244, 230",
  intensity = 1,
}: {
  className?: string;
  density?: number;
  tint?: string;
  /** 0–1, can be changed every frame through the `data-intensity` attribute too. */
  intensity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, visible = false;
    const puffs: Puff[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = () => {
      const max = 220 + Math.random() * 160;
      puffs.push({
        x: w * (0.3 + Math.random() * 0.4), y: h * (0.78 + Math.random() * 0.12),
        r: 18 + Math.random() * 26, vx: (Math.random() - 0.5) * 0.35, vy: -(0.45 + Math.random() * 0.6),
        life: 0, max, spin: (Math.random() - 0.5) * 0.02,
      });
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const k = Number(canvas.dataset.intensity ?? intensity);
      if (k > 0.02 && Math.random() < 0.55 * density * k) spawn();
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life++; p.x += p.vx + Math.sin((p.life + i * 13) * 0.025) * 0.35; p.y += p.vy; p.r += 0.32; p.vx += p.spin;
        const t = p.life / p.max;
        if (t >= 1) { puffs.splice(i, 1); continue; }
        const a = Math.sin(Math.PI * t) * 0.16 * Math.max(k, 0.25);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(${tint}, ${a})`);
        g.addColorStop(1, `rgba(${tint}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [density, tint, intensity]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none ${className}`} data-intensity={intensity} />;
}
