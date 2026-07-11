import React, { useEffect, useRef } from "react";

export interface FluidBackgroundProps {
  preset: "cosmic" | "solar" | "cyberpunk" | "emerald";
  density: "low" | "medium" | "high";
  showLines: boolean;
  speedMultiplier: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  angle: number;
  speed: number;
  glow: boolean;
}

export default function FluidParticlesBackground({
  preset = "cosmic",
  density = "medium",
  showLines = true,
  speedMultiplier = 1.0,
}: FluidBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, px: -1000, py: -1000, vx: 0, vy: 0, active: false });

  // Keep latest parameters in refs to avoid restarting the animation loop entirely,
  // which would wipe out active particles. Instead, update smoothly on the fly.
  const paramsRef = useRef({ preset, density, showLines, speedMultiplier });
  
  useEffect(() => {
    paramsRef.current = { preset, density, showLines, speedMultiplier };
  }, [preset, density, showLines, speedMultiplier]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const fluidParticles: Particle[] = [];
    const maxFluidParticles = 150;

    // Get color arrays based on preset
    const getColors = (selectedPreset: string) => {
      switch (selectedPreset) {
        case "solar":
          return [
            "rgba(245, 158, 11, ",   // Amber 500
            "rgba(249, 115, 22, ",   // Orange 500
            "rgba(239, 68, 68, ",    // Red 500
            "rgba(253, 224, 71, ",   // Yellow 300
            "rgba(244, 63, 94, ",    // Rose 500
          ];
        case "cyberpunk":
          return [
            "rgba(236, 72, 153, ",   // Pink 500
            "rgba(168, 85, 247, ",   // Purple 500
            "rgba(34, 211, 238, ",   // Cyan 400
            "rgba(217, 70, 239, ",   // Fuchsia 500
            "rgba(59, 130, 246, ",   // Blue 500
          ];
        case "emerald":
          return [
            "rgba(16, 185, 129, ",   // Emerald 500
            "rgba(52, 211, 153, ",   // Emerald 400
            "rgba(14, 165, 233, ",   // Sky 500
            "rgba(20, 184, 166, ",   // Teal 500
            "rgba(132, 204, 22, ",   // Lime 500
          ];
        case "cosmic":
        default:
          return [
            "rgba(30, 127, 224, ",   // Blue 500
            "rgba(59, 155, 240, ",   // Blue 400
            "rgba(99, 183, 255, ",   // Blue 300
            "rgba(14, 165, 233, ",   // Sky 500
            "rgba(168, 85, 247, ",   // Purple 500
          ];
      }
    };

    const getGlowColor = (selectedPreset: string) => {
      switch (selectedPreset) {
        case "solar":
          return "rgba(245, 158, 11, 0.4)";
        case "cyberpunk":
          return "rgba(236, 72, 153, 0.4)";
        case "emerald":
          return "rgba(16, 185, 129, 0.4)";
        case "cosmic":
        default:
          return "rgba(99, 183, 255, 0.4)";
      }
    };

    const getMaxParticles = (d: string) => {
      switch (d) {
        case "low":
          return 60;
        case "high":
          return 260;
        case "medium":
        default:
          return 140;
      }
    };

    const initParticles = () => {
      particles = [];
      const currentPreset = paramsRef.current.preset;
      const currentDensity = paramsRef.current.density;
      const colors = getColors(currentPreset);
      const limit = getMaxParticles(currentDensity);
      
      const count = Math.min(limit, Math.floor((canvas.width * canvas.height) / 8500) * (currentDensity === "low" ? 0.5 : currentDensity === "high" ? 1.6 : 1.0));
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 2.8 + 0.6;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.4 + 0.1,
          baseAlpha: Math.random() * 0.35 + 0.08,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.025 + 0.005,
          glow: Math.random() > 0.75,
        });
      }
    };

    // Set dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (mouse.px !== -1000) {
        mouse.vx = currentX - mouse.px;
        mouse.vy = currentY - mouse.py;
      }
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.px = currentX;
      mouse.py = currentY;
      mouse.active = true;

      // Inject fluid particles when mouse moves fast
      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      const currentPreset = paramsRef.current.preset;
      const colors = getColors(currentPreset);

      if (speed > 2.5 && fluidParticles.length < maxFluidParticles) {
        const pCount = Math.min(4, Math.floor(speed / 3));
        for (let i = 0; i < pCount; i++) {
          fluidParticles.push({
            x: currentX + (Math.random() - 0.5) * 12,
            y: currentY + (Math.random() - 0.5) * 12,
            vx: -mouse.vx * 0.12 + (Math.random() - 0.5) * 1.8,
            vy: -mouse.vy * 0.12 + (Math.random() - 0.5) * 1.8,
            size: Math.random() * 3.8 + 1.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.95,
            baseAlpha: 0.95,
            angle: Math.random() * Math.PI * 2,
            speed: 0,
            glow: true,
          });
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      mouseRef.current.px = -1000;
      mouseRef.current.py = -1000;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();

    // Trigger recreation when density or preset shifts to make it instant for the user
    let lastPreset = preset;
    let lastDensity = density;

    const animate = (time: number) => {
      const currentParams = paramsRef.current;
      
      // Dynamic recreation check inside the loop to avoid complete teardown of listeners
      if (lastPreset !== currentParams.preset || lastDensity !== currentParams.density) {
        lastPreset = currentParams.preset;
        lastDensity = currentParams.density;
        initParticles();
      }

      // Slightly translucent clear to leave sleek glowing trails
      ctx.fillStyle = "rgba(6, 9, 25, 0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const glowColor = getGlowColor(currentParams.preset);

      // Draw gorgeous, responsive radial background spotlight
      if (mouse.active) {
        const radGradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 220
        );
        // Map glow color
        const baseColor = glowColor.replace("0.4", "0.06");
        radGradient.addColorStop(0, baseColor);
        radGradient.addColorStop(0.6, "rgba(6, 9, 25, 0)");
        radGradient.addColorStop(1, "transparent");
        ctx.fillStyle = radGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Render standard floating particles
      particles.forEach((p) => {
        p.angle += p.speed * currentParams.speedMultiplier;
        
        // Mathematical fluid drift
        const driftX = Math.cos(p.angle + p.y * 0.006) * 0.14 * currentParams.speedMultiplier;
        const driftY = Math.sin(p.angle + p.x * 0.006) * 0.14 * currentParams.speedMultiplier;

        p.x += p.vx * currentParams.speedMultiplier + driftX;
        p.y += p.vy * currentParams.speedMultiplier + driftY;

        // Interaction with mouse cursor
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = 150;

          if (dist < limit) {
            const force = (limit - dist) / limit;
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * force * 1.8;
            const pushY = Math.sin(angle) * force * 1.8;

            p.x += pushX;
            p.y += pushY;
            p.alpha = Math.min(1.0, p.baseAlpha + force * 0.45);
          } else {
            p.alpha = Math.max(p.baseAlpha, p.alpha - 0.015);
          }
        } else {
          p.alpha = Math.max(p.baseAlpha, p.alpha - 0.015);
        }

        // Boundary wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Render particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;

        if (p.glow) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = glowColor;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      // Render custom fluid particles (injected upon speedy mouse gestures)
      for (let i = fluidParticles.length - 1; i >= 0; i--) {
        const fp = fluidParticles[i];

        fp.x += fp.vx * currentParams.speedMultiplier;
        fp.y += fp.vy * currentParams.speedMultiplier;
        fp.vx *= 0.94;
        fp.vy *= 0.94;

        fp.alpha -= 0.014;
        fp.size = Math.max(0.1, fp.size - 0.015);

        if (fp.alpha <= 0) {
          fluidParticles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
        ctx.fillStyle = `${fp.color}${fp.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = glowColor;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Draw connecting filaments/lines if requested
      if (currentParams.showLines) {
        const maxDist = currentParams.density === "low" ? 75 : currentParams.density === "high" ? 115 : 95;
        ctx.strokeStyle = currentParams.preset === "solar" 
          ? "rgba(245, 158, 11, 0.06)" 
          : currentParams.preset === "cyberpunk"
          ? "rgba(236, 72, 153, 0.06)"
          : currentParams.preset === "emerald"
          ? "rgba(16, 185, 129, 0.06)"
          : "rgba(30, 127, 224, 0.06)";
        ctx.lineWidth = 0.5;

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const pi = particles[i];
            const pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [preset, density]); // Simple dependency on density / preset change directly resets parameters

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none block bg-[#060919]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
