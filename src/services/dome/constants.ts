export const SCREEN_WIDTH = 3;
export const SCREEN_HEIGHT = 3;
export const SCREEN_APPEAR_INTERVAL = 10.0; // seconds between new screen appearances
export const SCREEN_VISIBLE_DURATION = 30.0; // each screen stays visible for 30 seconds
export const SCREEN_FADE_DURATION = 1.5; // fade in/out duration
export const INITIAL_VISIBLE_COUNT = 3; // first 3 screens are immediately visible
// Adjust these to suit your desired durations.
export const FADE_DURATION = 1.5; // screens fade in/out over 1.5s
export const VISIBLE_DURATION = 30; // each screen stays visible for 30s
export const OFFSET_INCREMENT = 5; // each subsequent screen starts 5s after the prior
export const TOTAL_SCREENS = 12; // 6 primary + 6 secondary
// We want the last screen to appear at offset= (TOTAL_SCREENS-1)*OFFSET_INCREMENT
// So cycleDuration must exceed lastOffset + VISIBLE_DURATION:
export const CYCLE_DURATION = 90; // e.g. 90 so the last screen has time to appear
