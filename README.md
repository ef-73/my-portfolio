# Portfolio — SIGNAL → STRUCTURE → CONTROL

Personal portfolio built with Next.js 16, React 19, and custom canvas animations.

## Features

- **LoaderSignalCanvas**: One-time landing animation with particle system organizing into text
  - 1000 particles driven by Perlin noise
  - Smooth transition from chaos to signal (1.5s duration)
  - Session-based "first load only" detection
  - Proper DPI scaling and responsive sizing
  - Dev-only console diagnostics

- **ContactSignal**: Signal verification form with waveform visualization
  - Red noise + blue signal waveform rendering
  - Alpha threshold-based human verification (0.3 ≤ α ≤ 0.5)
  - Real-time amplitude modulation based on filter slider
  - Responsive canvas sizing with devicePixelRatio

- **Responsive Design**: Works across all device sizes with dark mode support

## Getting Started

### Development

```bash
npm run dev
# Open http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

## Configuration

### LoaderSignalCanvas (`src/components/LoaderSignalCanvas.tsx`)

Adjust these constants in the component:

```typescript
const DURATION = 1500;      // Animation duration in milliseconds
const PARTICLE_COUNT = 1000; // Number of particles in system
```

**Key parameters:**
- `noiseAmplitude`: Particle motion chaos level (line ~250)
- `alignmentStrength`: Pull toward text targets (line ~251)
- `damping` (0.85): Particle friction/settling (line ~264)
- `searchRadius` (150): Distance for particles to find text (line ~227)

### ContactSignal (`src/components/ContactSignal.tsx`)

Adjust these to customize the waveform:

```typescript
const amplitude = (displayHeight / 2.5) * (filterValue / 100 * 0.6 + 0.5);  // Line ~65
// At filterValue=0: amplitude ≈ displayHeight * 0.2
// At filterValue=100: amplitude ≈ displayHeight * 0.44

const noiseMultiplier = 2.2;  // Noise prominence (line ~92)
const coherence = filterValue / 100;  // Blue signal strength (line ~67)
```

**Verification range:** α ∈ [0.3, 0.5] (configurable on line ~37)

## Technical Details

### Canvas Rendering

Both components use proper DPI scaling:

```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
ctx.scale(dpr, dpr);
```

This ensures crisp rendering on high-DPI displays (Retina, etc.).

### Session Storage

LoaderSignalCanvas uses sessionStorage (not localStorage) for "first load only":

```typescript
const LOADER_KEY = "portfolio_loader_shown_session";
const hasShownLoader = sessionStorage.getItem(LOADER_KEY);
```

This expires when the tab/browser is closed, allowing the loader to replay on each new session.

### Development Diagnostics

Set `NODE_ENV=development` to see console logs:

```
[LoaderSignalCanvas] First load - showing loader
[LoaderSignalCanvas] Canvas initialized: 1920x1080 (DPR: 2)
[LoaderSignalCanvas] Animation started
```

Remove for production builds (no logs in build output).

## Architecture

- **`src/components/LoaderSignalCanvas.tsx`**: Client-only loader animation
- **`src/components/ContactSignal.tsx`**: Client-only contact form with waveform
- **`src/data/resume.ts`**: Single source of truth for portfolio data
- **`src/components/Reveal.tsx`**: Scroll-based content reveal animation
- **`src/app/layout.tsx`**: Root layout with theme provider

## Deployed at

https://ethanf.ca

Built with [Next.js](https://nextjs.org) and deployed on [Vercel](https://vercel.com).
