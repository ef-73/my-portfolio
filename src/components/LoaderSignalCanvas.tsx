/**
 * LoaderSignalCanvas.tsx
 *
 * Signal stabilization loader with proper particle-to-text morphing:
 * - Extracts a point cloud of black pixels from text masks once at setup
 * - Assigns particles to stable target points based on point cloud
 * - Blends forces: noise early, target attraction scales with progress
 * - On text transition, reassigns targets from new point cloud
 * - Uses tri-state visibility to prevent flicker on mount
 * - Supports ?loader=1 URL param to force replay
 */

"use client";

import { useEffect, useRef, useState } from "react";

// Simple Perlin noise implementation
class SimpleNoise {
  private permutation: number[] = [];
  private p: number[] = [];

  constructor(seed: number = 0) {
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

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

const DEBUG = process.env.NODE_ENV !== "production";

// Extract black pixel point cloud from text mask
// Sample every N pixels to control density and performance
function extractPointCloud(
  imageData: ImageData,
  width: number,
  height: number,
  sampleRate: number = 2
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  const data = imageData.data;

  for (let y = 0; y < height; y += sampleRate) {
    for (let x = 0; x < width; x += sampleRate) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Black pixel (text)
      if (r < 50 && g < 50 && b < 50) {
        points.push([x, y]);
      }
    }
  }

  return points;
}

// Assign particles to targets from point cloud
function assignParticlesToTargets(
  particles: Particle[],
  pointCloud: Array<[number, number]>
) {
  if (pointCloud.length === 0) return;

  for (let i = 0; i < particles.length; i++) {
    const particleIdx = i % pointCloud.length;
    const [tx, ty] = pointCloud[particleIdx];
    particles[i].targetX = tx;
    particles[i].targetY = ty;
  }
}

export default function LoaderSignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // TRI-STATE: null = computing, true = show loader, false = skip loader
  // This prevents flicker where true starts, then immediately switches to false
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [opacity, setOpacity] = useState(1);

  const noiseRef = useRef<SimpleNoise | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTextRef = useRef<string | null>(null);
  const pointCloudsRef = useRef<Record<string, Array<[number, number]>>>({});

  const DURATION = 1500; // ms
  const PARTICLE_COUNT = 1000;
  const LOADER_KEY = "portfolio_loader_shown_session";

  // PHASE 1: On mount, check if we should skip loader
  // Compute state BEFORE rendering anything to prevent flicker
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const forceLoader = urlParams.get("loader") === "1";

    const hasShownLoader = sessionStorage.getItem(LOADER_KEY);
    const shouldDisplay = forceLoader || !hasShownLoader;

    console.log(
      "[LoaderSignalCanvas] Mount: forceLoader=",
      forceLoader,
      "hasShownLoader=",
      !!hasShownLoader,
      "shouldDisplay=",
      shouldDisplay
    );

    setShouldShow(shouldDisplay);

    // Mark as shown in session storage (unless forced)
    if (shouldDisplay && !forceLoader) {
      sessionStorage.setItem(LOADER_KEY, "true");
    }
  }, []);

  // PHASE 2: When shouldShow is determined, setup and run the animation
  useEffect(() => {
    // null = still computing, false = skip loader
    if (shouldShow !== true) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("[LoaderSignalCanvas] Canvas ref is null!");
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      console.error("[LoaderSignalCanvas] Failed to get 2D context");
      return;
    }

    // Get proper DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect();

    if (!rect || rect.width === 0 || rect.height === 0) {
      console.error(
        `[LoaderSignalCanvas] Container zero dimensions: ${rect?.width}x${rect?.height}`
      );
      return;
    }

    // Set canvas size with DPI scaling
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    console.log(
      `[LoaderSignalCanvas] Canvas initialized: ${rect.width}x${rect.height} (DPR: ${dpr})`
    );

    // Initialize noise
    noiseRef.current = new SimpleNoise(Math.random() * 10000);

    // Create particles with random initial positions
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: rect.width / 2,
        targetY: rect.height / 2,
        life: Math.random(),
      });
    }
    particlesRef.current = particles;

    // Pre-create text masks and extract point clouds ONCE at initialization
    // This is O(width * height) but happens only once per animation
    const textMasks: Record<string, ImageData> = {};
    const createMask = (text: string) => {
      const textCanvas = document.createElement("canvas");
      textCanvas.width = rect.width;
      textCanvas.height = rect.height;
      const textCtx = textCanvas.getContext("2d");
      if (!textCtx) return;

      textCtx.fillStyle = "white";
      textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.fillStyle = "black";
      textCtx.font =
        "bold 84px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui";
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      textCtx.fillText(text, rect.width / 2, rect.height / 2);

      const imageData = textCtx.getImageData(
        0,
        0,
        textCanvas.width,
        textCanvas.height
      );
      textMasks[text] = imageData;

      // Extract point cloud from text mask (stable set of target positions)
      const pointCloud = extractPointCloud(imageData, rect.width, rect.height, 2);
      pointCloudsRef.current[text] = pointCloud;

      DEBUG &&
        console.log(
          `[LoaderSignalCanvas] Text "${text}": ${pointCloud.length} target points extracted`
        );
    };

    createMask("Signal stabilizing...");
    createMask("Ethan Fung");

    startTimeRef.current = Date.now();
    lastTextRef.current = "Signal stabilizing...";

    // Assign particles to targets for first text
    assignParticlesToTargets(
      particles,
      pointCloudsRef.current["Signal stabilizing..."] || []
    );

    const animate = () => {
      if (!canvas || !ctx || !startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      // Clear canvas with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, rect.width, rect.height);

      const noise = noiseRef.current!;

      // Determine which text to show based on progress
      let displayText = "Signal stabilizing...";
      if (progress > 0.65) {
        displayText = "Ethan Fung";
      }

      // ONCE per text change, reassign particles to new point cloud
      // This happens exactly once when transitioning between text phases
      if (displayText !== lastTextRef.current) {
        console.log(
          `[LoaderSignalCanvas] Text transition: "${lastTextRef.current}" → "${displayText}"`
        );
        lastTextRef.current = displayText;
        assignParticlesToTargets(
          particles,
          pointCloudsRef.current[displayText] || []
        );
      }

      // Update particle physics with force blending
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Perlin noise: creates smooth, flowing motion
        const noiseX = noise.noise(
          particle.x * 0.005 + elapsed * 0.0001,
          particle.y * 0.005
        );
        const noiseY = noise.noise(
          particle.x * 0.005 + 100 + elapsed * 0.0001,
          particle.y * 0.005 + 100
        );

        // Force blending:
        // - Early progress: noise dominates (particles flow chaotically)
        // - Late progress: target attraction dominates (particles converge to text)
        const noiseAmplitude = Math.pow(1 - progress, 2.2) * 5;
        const alignmentStrength = progress * progress * progress;

        // Blend noise flow and target attraction
        particle.vx =
          noiseX * noiseAmplitude +
          (particle.targetX - particle.x) * alignmentStrength * 0.08;
        particle.vy =
          noiseY * noiseAmplitude +
          (particle.targetY - particle.y) * alignmentStrength * 0.08;

        // Damping increases as progress increases (particles "stick" to targets)
        const damping = 0.85 + progress * 0.1;
        particle.x += particle.vx * damping;
        particle.y += particle.vy * damping;

        // Wrap around screen edges
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;
      }

      // Render particles as small circles
      const particleOpacity = 0.6 + progress * 0.4;
      ctx.fillStyle = `rgba(0, 0, 0, ${particleOpacity})`;
      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1.5 + progress * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) {
        // Continue animation
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete - show click prompt
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, rect.width, rect.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(
          "Click anywhere to continue",
          rect.width / 2,
          rect.height / 2 + 60
        );

        const handleClick = () => {
          let fadeProgress = 0;
          const fadeStart = Date.now();
          const fadeDuration = 300;

          const fadeOut = () => {
            fadeProgress = Math.min((Date.now() - fadeStart) / fadeDuration, 1);
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - fadeProgress})`;
            ctx.fillRect(0, 0, rect.width, rect.height);

            if (fadeProgress < 1) {
              rafRef.current = requestAnimationFrame(fadeOut);
            } else {
              setShouldShow(false);
              setOpacity(0);
              canvas.removeEventListener("click", handleClick);
              DEBUG &&
                console.log("[LoaderSignalCanvas] Fade complete - hiding loader");
            }
          };

          fadeOut();
        };

        canvas.addEventListener("click", handleClick, { once: true });
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    DEBUG && console.log("[LoaderSignalCanvas] Animation started");

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [shouldShow]);

  // Don't render anything until state is computed to prevent flicker
  if (shouldShow === null) {
    return null;
  }

  // Don't render if loader should be hidden
  if (!shouldShow) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      style={{
        opacity,
        transition: opacity < 1 ? "opacity 0.3s ease-out" : "none",
        pointerEvents: shouldShow ? "auto" : "none",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          display: "block",
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}
