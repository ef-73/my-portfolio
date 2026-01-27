# LoaderSignalCanvas Fix - Summary

## Problem Analysis

### A) Particle-to-Text Morphing Never Worked
**Root Cause:** The old implementation tried to find text pixels every frame via random sampling within a search radius. This approach had fundamental issues:
- Random search might miss text entirely  
- No guaranteed particle-to-target mapping
- Particles would randomly jump between targets each frame
- Result: Chaotic blob instead of coherent text shape
- No convergence possible

**Solution:** Pre-sample text mask once to build a stable point cloud
- On setup, extract all black pixels from rendered text (sampled every 2 pixels for efficiency)
- At initialization, assign particles to targets from point cloud using modulo index mapping
- When text changes (65% progress), reassign all particles to new point cloud
- Result: Stable target mapping → predictable convergence

### B) Reload Behavior + Flicker
**Root Cause:** `shouldShow` state started as `true`, causing:
- Initial render shows loader
- Mount effect checks sessionStorage
- State switches to `false` for returning visitors
- Visual flicker as component unmounts mid-render

**Solution:** Tri-state visibility (`null | true | false`)
- `null`: Computing - don't render anything yet
- `true`: Show loader - render animation
- `false`: Skip loader - return null
- On mount, compute decision synchronously before setting state
- Added `?loader=1` URL param to force replay (bypasses sessionStorage)

## Implementation Details

### Point Cloud Extraction Algorithm
```
for each text phrase:
  render text to temporary canvas
  extract ImageData
  sample every 2 pixels (e.g., 300x300 viewport → ~22,500 points from text)
  store point cloud in ref
```

### Particle Assignment
```
for each particle (0 to 999):
  index = particle_num % point_cloud.length
  particle.target = point_cloud[index]
  → ensures even distribution without collision
```

### Force Blending (Animation Core)
```
early phase (0-40%):   noise_force >> target_force
mid phase  (40-70%):   noise_force ~= target_force  
late phase (70-100%):  noise_force << target_force + increased damping
```

This creates:
- Chaotic initial motion (Perlin noise)
- Smooth convergence (target attraction)
- Final "snap" and lock to text shape

## Key Changes Made

1. **extractPointCloud()** - New function to sample text masks once
2. **assignParticlesToTargets()** - Assign stable targets via modulo indexing
3. **Tri-state visibility** - null/true/false pattern prevents render flicker
4. **URL param override** - `?loader=1` forces replay regardless of sessionStorage
5. **Text transition logic** - Reassign targets ONCE when text changes, not every frame
6. **Force blending** - noise_amplitude now follows cubic ease-out curve, damping increases with progress

## Testing Checklist

- [x] **Local Dev** (npm run dev)
  - First load: Shows loader with text morphing
  - Progress 0% → ~60%: Particles in chaotic flow
  - Progress 60% → 100%: Particles converge to text shape
  - By 100%: Text clearly readable (both phrases)
  - No visual flicker on initial render

- [x] **Local Prod** (npm run build && npm start)
  - Same behavior as dev
  - No hydration issues

- [ ] **Deployed** (ethanf.ca)
  - (Will verify after commit and deploy)

## Reload & Force Replay

### Session-Only Display
- First load in new session: Shows loader
- Reload same tab: Skips loader (sessionStorage key set)
- New tab/window: Shows loader
- Private/Incognito: Shows loader (new session)

### Force Replay (Dev/Testing)
```
http://localhost:3000/?loader=1    # Force show
http://localhost:3000               # Normal behavior
```

URL param ?loader=1 temporarily overrides sessionStorage for testing without clearing cache.

## Acceptance Criteria Met

✅ By ~60% progress, text becomes readable
✅ By 100% progress, text clearly formed (not vague blob)
✅ No flicker on initial render (tri-state approach)
✅ Works in local dev
✅ Works in local prod
✅ Force replay via URL param

## Files Modified

- `src/components/LoaderSignalCanvas.tsx` - Complete rewrite with proper algorithm
