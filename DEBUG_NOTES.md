# Debug Testing - January 27, 2025

## Issues to Test:

### 1. Loader Animation (LoaderSignalCanvas.tsx)
**Expected**: Page loads with 1000 particles that organize into text "Signal stabilizing..." then "Ethan Fung"
**Current Issue**: User reports particles just jitter, text doesn't form
**Likely Causes**:
- Text detection threshold (checking RGB < 128) might not match actual rendered text
- Text mask generation might be producing unexpected pixel values
- Particle search radius (150px) might be too small or search logic flawed
- Animation damping (0.92) might prevent particles from settling
- Alignment strength might be insufficient

**Test Steps**:
1. Clear localStorage: `localStorage.removeItem('portfolio_loader_seen')`
2. Reload page
3. Observe: Do particles form the word "Signal stabilizing..." in the first 1 second?
4. Observe: Do particles then form "Ethan Fung" at 1 second mark?
5. Expected: Smooth organization, then stable text at end
6. Expected: "Click anywhere to continue" message appears at 100%

### 2. Wavelength Visualization (ContactSignal.tsx)
**Expected**: Red noise visible in contact form waveform when dragging filter slider
**Current Issue**: User reports wavelength "not showing"
**Likely Causes**:
- Red color (rgba(200, 80, 80, 0.8)) might have insufficient opacity/saturation
- Noise calculation might be producing small values
- Canvas context might not be rendering the red stroke properly
- Background (white) might be obscuring the red noise

**Test Steps**:
1. Scroll to Contact section
2. Drag the filter slider from left to right
3. Observe: Is there RED NOISE visible (jagged red waves)?
4. Expected: Red noise decreases as you move slider right
5. Expected: At 100%, noise disappears and only blue signal remains
6. If not visible: Check browser DevTools canvas rendering

### 3. Email Sending (api/send-email/route.ts)
**Expected**: Email sends when form isVerified and Send button clicked
**Current Issue**: Gmail 535-5.7.8 EAUTH error
**Root Cause**: Using account password instead of 16-char App Password
**Solution Required**: User must visit https://myaccount.google.com/apppasswords

**Test Steps**:
1. Get Gmail App Password (user action required)
2. Update .env.local with 16-char App Password
3. Restart dev server
4. Fill contact form and verify (drag slider to 0.3-0.5 range)
5. Send email - should succeed with 200 response

## Browser Console Checks:
- Check for JavaScript errors related to canvas rendering
- Verify localStorage is working correctly
- Check fetch response status for email endpoint

## Code Version:
- LoaderSignalCanvas: Text detection using RGB < 128, alignment strength = progress²
- ContactSignal: Noise wavelength = 80 + (1-coherence)*120, opacity 0.8
- Email: Nodemailer with Gmail SMTP, currently using account password (WRONG)
