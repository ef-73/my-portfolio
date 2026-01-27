# Loader Fix - Manual Verification Guide

## Test Environment Setup

**Local Dev:** http://localhost:3000 (npm run dev)
**Local Prod:** http://localhost:3000 (npm start after npm run build)
**Deployed:** https://ethanf.ca

## Test Scenarios

### Scenario 1: First Load (Fresh Session)
1. Clear browser cache and sessionStorage
2. Navigate to http://localhost:3000
3. **Expected:**
   - Loader appears immediately (no white flash)
   - Particles in random positions, flowing (Perlin noise)
   - Particles slowly move toward center
   - Around 60% progress: text becomes readable
   - Around 100% progress: "Ethan Fung" clearly visible
   - No visual flicker
4. **DevTools Console:**
   - "[LoaderSignalCanvas] Mount: forceLoader=false, hasShownLoader=false, shouldDisplay=true"
   - "[LoaderSignalCanvas] Canvas initialized: XXXxYYY (DPR: N)"
   - "[LoaderSignalCanvas] Text "Signal stabilizing...": 1234 target points extracted"
   - "[LoaderSignalCanvas] Text "Ethan Fung": 5678 target points extracted"
5. **Click to continue** → smooth fade-out

---

### Scenario 2: Reload Same Tab
1. Page fully loaded, loader dismissed
2. Hit F5 or Cmd+R to reload
3. **Expected:**
   - Page loads directly, NO loader appears
   - Normal page content visible immediately
4. **DevTools Console:**
   - "[LoaderSignalCanvas] Mount: forceLoader=false, hasShownLoader=true, shouldDisplay=false"
   - (No canvas setup logs - animation skipped)

---

### Scenario 3: Force Replay via URL
1. In address bar: navigate to http://localhost:3000/?loader=1
2. **Expected:**
   - Loader appears again (overrides sessionStorage)
   - Animation runs exactly as Scenario 1
   - Text morphing works
3. **DevTools Console:**
   - "[LoaderSignalCanvas] Mount: forceLoader=true, hasShownLoader=true, shouldDisplay=true"
   - Canvas setup logs appear (forced despite sessionStorage)
4. **Follow-up:** Reload again (F5)
   - Loader shows again (URL param still active)
5. **Follow-up:** Navigate to http://localhost:3000 (remove param)
   - Loader skipped (sessionStorage now says "shown")

---

### Scenario 4: Visual Quality Check
During animation, verify:

**Early phase (0-40% progress):**
- [ ] Particles moving in flowing, chaotic patterns (Perlin noise dominating)
- [ ] Particles spread across entire screen
- [ ] Text not yet visible

**Mid phase (40-70% progress):**
- [ ] Particles starting to accumulate in text areas
- [ ] "Signal stabilizing..." beginning to form
- [ ] Some text readability

**Late phase (70-100% progress):**
- [ ] Clear convergence to text shape
- [ ] "Ethan Fung" fully readable
- [ ] Particles snapped to text (minimal drift)
- [ ] Smooth fade-out on click

---

### Scenario 5: Responsive Design
Test on different viewport sizes:

- [ ] **Desktop (1920x1080):** Text properly centered and sized
- [ ] **Tablet (768x1024):** Text readable, particles scale appropriately
- [ ] **Mobile (375x667):** Text adapts, no layout breakage

---

## Debugging Checklist

If text doesn't appear:

1. **Console Logs:**
   - Check for "target points extracted" count
   - 0 points = text rendering issue
   - High count (>1000) = working

2. **Canvas Element:**
   - In DevTools Elements tab: find `<canvas>`
   - It should be visible, full-screen, white background initially

3. **Particle Positions:**
   - Early frame: particles scattered (100s of them)
   - Mid frame: particles clustering
   - Late frame: particles at text positions

4. **URL Params:**
   - `?loader=1` = force show
   - No param = respect sessionStorage
   - Works across page reloads

---

## Success Criteria (All Must Pass)

✅ Scenario 1: First load shows animated text morphing
✅ Scenario 2: Reload skips loader
✅ Scenario 3: ?loader=1 force replay works
✅ Scenario 4: Visual quality acceptable by 100% progress
✅ Scenario 5: Responsive across devices
✅ No console errors during animation
✅ No visual flicker on initial render
✅ Fade-out smooth on click

---

## Known Behavior

- **sessionStorage** persists across reloads but clears on browser close
- **?loader=1** always shows loader, doesn't modify sessionStorage
- **First tab** shows loader, **new tab** shows loader, **same tab refresh** skips loader
- **Private mode** always shows loader (new session each time)

---

## Performance Notes

- **Point cloud extraction:** O(width * height / sampleRate²) = one-time O(n²) at mount
- **Particle update:** O(1000 * 2) per frame = constant time
- **Target reassignment:** O(1000) once per text change = negligible
- **Overall:** ~60fps on modern hardware

---

## Deployment Checklist

Before pushing to production:

- [ ] Commit includes LoaderSignalCanvas.tsx with new algorithm
- [ ] No console.log statements in production build (covered by DEBUG flag)
- [ ] ?loader=1 param works in deployed version
- [ ] sessionStorage works across tabs in deployed version
- [ ] DevTools confirms no errors or warnings
- [ ] Text renders at correct size (test on desktop + mobile)
- [ ] Fade-out animation smooth

