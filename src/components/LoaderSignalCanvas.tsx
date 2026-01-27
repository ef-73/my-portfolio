/**
 * LoaderSignalCanvas.tsx
 *
 * Signal stabilization loader:
 * - Particles with noise-driven motion
 * - Over ~1.5s, noise amplitude decreases
 * - Text "Signal stabilizing..." → "Ethan Fung" emerges
 * - Fires once on first load only (localStorage flag)
 * - Seamless fade into homepage
 * - Respects prefers-reduced-motion
 */

"use client";

import { useEffect, useRef, useState } from "react";

// Simple Perlin noise implementation (simplex-like)
class SimpleNoise {
  private permutation: number[] = [];
  private p: number[] = [];

  constructor(seed: number = 0) {
    // Initialize permutation table
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

    // Shuffle with seed
    let random = this.seededRandom(seed);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [
        this.permutation[j],
        this.permutation[i],
      ];
    }

    this.p = [...this.permutation, ...this.permutation];
  }

  private seededRandom(seed: number) {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.p[this.p[xi] + yi];
    const ab = this.p[this.p[xi] + yi + 1];
    const ba = this.p[this.p[xi + 1] + yi];
    const bb = this.p[this.p[xi + 1] + yi + 1];

    const x1 = this.lerp(
      u,
      this.grad(aa, xf, yf),
      this.grad(ba, xf - 1, yf)
    );
    const x2 = this.lerp(
      u,
      this.grad(ab, xf, yf - 1),
      this.grad(bb, xf - 1, yf - 1)
    );

    return this.lerp(v, x1, x2);
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  life: number;
}

export default function LoaderSignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const noiseRef = useRef<SimpleNoise | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const DURATION = prefersReducedMotion ? 400 : 1500; // ms
  const PARTICLE_COUNT = 1000;

  // Initialize on client only
  useEffect(() => {
    setIsMounted(true);
    
    // Check if loader has been shown
    const hasSeenLoader = localStorage.getItem("portfolio_loader_seen");

    if (hasSeenLoader) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !isVisible) return;

    // Mark as seen
    localStorage.setItem("portfolio_loader_seen", "true");

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize noise
    noiseRef.current = new SimpleNoise(Math.random() * 1000);

    // Create particles distributed across screen
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: 0,
        targetY: 0,
        life: Math.random(),
      });
    }
    particlesRef.current = particles;

    // Pre-create text masks
    const textMasks: Record<string, ImageData> = {};
    const createMask = (text: string) => {
      const textCanvas = document.createElement("canvas");
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      const textCtx = textCanvas.getContext("2d");
      if (!textCtx) return;

      textCtx.fillStyle = "white";
      textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.fillStyle = "black";
      textCtx.font = "bold 84px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui";
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      textCtx.fillText(text, canvas.width / 2, canvas.height / 2);
      
      const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
      textMasks[text] = imageData;
    };

    createMask("Signal stabilizing...");
    createMask("Ethan Fung");

    startTimeRef.current = Date.now();

    const animate = () => {
      if (!canvas || !ctx || !startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      // Clear with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const noise = noiseRef.current!;

      // Determine which text to show
      let displayText = "Signal stabilizing…";
      if (progress > 0.65) {
        displayText = "Ethan Fung";
      }

      // Get pre-created text mask
      const textMask = textMasks[displayText];
      if (!textMask) return;

      const data = textMask.data;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Find nearby black pixel (text) using more efficient search
        const searchRadius = 150;
        let foundPixel = false;

        // Try to find a black pixel near the particle
        for (let attempt = 0; attempt < 20 && !foundPixel; attempt++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * searchRadius;
          const sampleX = particle.x + Math.cos(angle) * dist;
          const sampleY = particle.y + Math.sin(angle) * dist;

          if (
            sampleX >= 0 &&
            sampleX < canvas.width &&
            sampleY >= 0 &&
            sampleY < canvas.height
          ) {
            const idx =
              (Math.floor(sampleY) * canvas.width + Math.floor(sampleX)) * 4;
            // Check if pixel is black (RGB all very dark - true black is 0,0,0)
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            
            // Black text pixels should have RGB values close to 0
            if (r < 50 && g < 50 && b < 50) {
              particle.targetX = sampleX;
              particle.targetY = sampleY;
              foundPixel = true;
            }
          }
        }

        // Noise-driven motion that progressively aligns to target
        const noiseX = noise.noise(particle.x * 0.005 + elapsed * 0.00015, particle.y * 0.005);
        const noiseY = noise.noise(
          particle.x * 0.005 + 100 + elapsed * 0.00015,
          particle.y * 0.005 + 100
        );

        // Amplitude decreases with progress (signal stabilizes)
        const noiseAmplitude = Math.pow(1 - progress, 2.2) * 5;
        const alignmentStrength = progress * progress * progress; // Stronger pull as time progresses

        particle.vx =
          noiseX * noiseAmplitude +
          (particle.targetX - particle.x) * alignmentStrength * 0.08;
        particle.vy =
          noiseY * noiseAmplitude +
          (particle.targetY - particle.y) * alignmentStrength * 0.08;

        // Apply velocity with damping
        particle.x += particle.vx * 0.85;
        particle.y += particle.vy * 0.85;

        // Bounds with wrap
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      }

      // Render particles with increasing opacity
      const particleOpacity = 0.6 + progress * 0.4;
      ctx.fillStyle = `rgba(0, 0, 0, ${particleOpacity})`;
      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1.5 + progress * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Continue animation or wait for click
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete - show "Click to continue" and wait for interaction
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw completion text
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Click anywhere to continue", canvas.width / 2, canvas.height / 2 + 60);

        // Add click listener to close loader
        const handleClick = () => {
          let fadeProgress = 0;
          const fadeStart = Date.now();
          const fadeDuration = 300;

          const fadeOut = () => {
            fadeProgress = Math.min(
              (Date.now() - fadeStart) / fadeDuration,
              1
            );
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - fadeProgress})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (fadeProgress < 1) {
              requestAnimationFrame(fadeOut);
            } else {
              setIsVisible(false);
              canvas.removeEventListener("click", handleClick);
            }
          };

          fadeOut();
        };

        canvas.addEventListener("click", handleClick, { once: true });
      }
    };

    animate();
  }, [isMounted, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{
          background: "white",
        }}
      />
    </div>
  );
}
