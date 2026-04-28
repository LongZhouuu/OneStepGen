<template>
  <div class="panel">
    <button class="back-btn" @click="$emit('back')">← Back</button>

    <h2>Box Breathing</h2>
    <p class="sub">Inhale • Hold • Exhale • Hold</p>

    <!-- Box animation container -->
    <div
      ref="boxWrapRef"
      class="box-wrap"
      :class="{
        'reduced-motion': prefersReducedMotion,
        'is-running': isRunning,
      }"
      aria-live="polite"
    >
      <!--
        dot is a direct child of box-wrap (NOT inside box-track)
        so position:absolute origin = box-wrap top-left corner,
        unaffected by box-track's border offset
      -->
      <span class="box-dot" :style="dotStyle" />

      <!-- The square track border -->
      <div class="box-track" aria-hidden="true" />

      <!-- Centre ring + phase label -->
      <div class="center">
        <div class="center-ring" aria-hidden="true" />
        <div class="center-content">
          <div class="phase">{{ phaseLabel }}</div>
          <div v-if="isRunning" class="countdown">{{ secondsLeft }}</div>
        </div>
      </div>
    </div>

    <!-- Controls area -->
    <div class="controls">
      <!-- Instruction text shown only when stopped -->
      <p v-if="!isRunning" class="start-hint">Press start and follow the square</p>

      <!--
        Encouragement slot: only rendered while running so it doesn't
        push the Start button down when stopped
      -->
      <div v-show="isRunning" class="encouragement-slot">
        <Transition name="encouragement">
          <p v-if="encouragementText" class="encouragement">{{ encouragementText }}</p>
        </Transition>
      </div>

      <button
        v-if="!isRunning"
        type="button"
        class="primary-btn"
        @click="handleStart"
      >
        Start
      </button>

      <button
        v-else
        type="button"
        class="secondary-btn"
        @click="handlePauseToStart"
      >
        Pause
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineEmits(['back'])

// ── Constants ────────────────────────────────────────────────────────────────

const PHASES = Object.freeze([
  { key: 'inhale',  label: 'Inhale' },
  { key: 'hold1',   label: 'Hold'   },
  { key: 'exhale',  label: 'Exhale' },
  { key: 'hold2',   label: 'Hold'   },
])

const PHASE_SECONDS  = 4                          // seconds per phase
const CYCLE_SECONDS  = PHASES.length * PHASE_SECONDS  // 16s per full cycle
const CYCLES_PER_SET = 4                          // show encouragement every 4 cycles

// Encouragement messages shown after every CYCLES_PER_SET cycles
const ENCOURAGEMENTS = [
  "Well done! You're feeling more calm.",
  "Great job! Your breath is steady.",
  "You did it! Take a moment to notice the stillness.",
  "Nicely done. Your nervous system thanks you.",
  "Four rounds complete — you should feel proud.",
  "Beautiful. Keep going, you're doing great.",
  "Your mind is clearer now. Well done.",
  "Breathe easy. You're doing wonderfully.",
]

// ── Reactive state ───────────────────────────────────────────────────────────

const phaseIndex           = ref(0)
const secondsLeft          = ref(PHASE_SECONDS)
const prefersReducedMotion = ref(false)
const isRunning            = ref(false)
const encouragementText    = ref('')

// Current phase label derived from phaseIndex
const phaseLabel = computed(() => PHASES[phaseIndex.value]?.label ?? 'Hold')

// Dot position — updated every rAF frame via setDotProgress()
const boxWrapRef = ref(null)
const dotX = ref(0)
const dotY = ref(0)

const dotStyle = computed(() => ({
  transform: `translate3d(${dotX.value}px, ${dotY.value}px, 0)`,
}))

// ── Timing state (non-reactive, no need to trigger re-renders) ───────────────

let rafId            = null   // requestAnimationFrame handle
let startMs          = 0      // timestamp when Start was pressed
let pausedAccumMs    = 0      // total milliseconds spent paused
let lastCompletedSet = -1     // last cycle count that triggered encouragement
let encouragementTimer = null // setTimeout handle for fade-out

// ── Box metrics (read from CSS variables, updated on mount/resize) ───────────

let boxSize     = 0   // element width in px (square, so width === height)
let strokeW     = 6   // --stroke value in px
let radiusOuter = 26  // --radius value in px (outer edge of border)
let dotDiam     = 16  // --dot value in px

let cleanupResizeObserver = null

// Read CSS variable values and element size into JS variables.
// Called once on mount and again whenever the element resizes.
function syncBoxMetrics() {
  const el = boxWrapRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  boxSize = rect.width

  const css = window.getComputedStyle(el)
  strokeW     = parseFloat(css.getPropertyValue('--stroke'))  || 6
  radiusOuter = parseFloat(css.getPropertyValue('--radius'))  || 26
  dotDiam     = parseFloat(css.getPropertyValue('--dot'))     || 16
}

// ── Dot path calculation ─────────────────────────────────────────────────────
/*
 * Coordinate system
 * -----------------
 * .box-dot is a direct child of .box-wrap, so position:absolute
 * origin (0,0) = .box-wrap top-left corner.
 *
 * The CSS border is drawn centred on the element edge.
 * The border MIDLINE positions are therefore:
 *   left   x  =  strokeW / 2
 *   right  x  =  boxSize - strokeW / 2
 *   top    y  =  strokeW / 2
 *   bottom y  =  boxSize - strokeW / 2
 *
 * Corner arc radius on the midline:
 *   r = radiusOuter - strokeW / 2
 *   (CSS border-radius is measured from the outer edge)
 *
 * Dot centre is placed on the midline:
 *   dotX.value = midX - dotDiam / 2
 *   dotY.value = midY - dotDiam / 2
 *
 * Clockwise traversal starting at the top-right corner:
 *   1. Right side    — down
 *   2. Bottom-right arc  0° → 90°
 *   3. Bottom side   — left
 *   4. Bottom-left arc  90° → 180°
 *   5. Left side     — up
 *   6. Top-left arc 180° → 270°
 *   7. Top side      — right
 *   8. Top-right arc 270° → 360°
 */
function setDotProgress(progress01) {
  if (!boxSize) return

  const half   = strokeW / 2
  const r      = Math.max(0, radiusOuter - half)   // midline corner radius

  // Midline bounding coordinates
  const left   = half
  const right  = boxSize - half
  const top    = half
  const bottom = boxSize - half

  // Straight segment lengths
  const sideH  = Math.max(0, (bottom - top)  - 2 * r)   // vertical straights
  const sideW  = Math.max(0, (right  - left) - 2 * r)   // horizontal straights
  const arc    = (Math.PI / 2) * r                       // quarter-circle arc length

  const perim  = 2 * (sideH + sideW) + 4 * arc
  if (perim <= 0) return

  // Map progress to a distance along the perimeter
  let s = ((progress01 % 1) + 1) % 1 * perim

  // Place dot centre at (mx, my)
  const place = (mx, my) => {
    dotX.value = mx - dotDiam / 2
    dotY.value = my - dotDiam / 2
  }

  // 1) Right side — going DOWN
  if (s < sideH) { place(right, top + r + s); return }
  s -= sideH

  // 2) Bottom-right arc — 0° → 90° (east → south)
  if (s < arc) {
    const a = (s / arc) * (Math.PI / 2)
    place(right - r + Math.cos(a) * r, bottom - r + Math.sin(a) * r)
    return
  }
  s -= arc

  // 3) Bottom side — going LEFT
  if (s < sideW) { place(right - r - s, bottom); return }
  s -= sideW

  // 4) Bottom-left arc — 90° → 180° (south → west)
  if (s < arc) {
    const a = Math.PI / 2 + (s / arc) * (Math.PI / 2)
    place(left + r + Math.cos(a) * r, bottom - r + Math.sin(a) * r)
    return
  }
  s -= arc

  // 5) Left side — going UP
  if (s < sideH) { place(left, bottom - r - s); return }
  s -= sideH

  // 6) Top-left arc — 180° → 270° (west → north)
  if (s < arc) {
    const a = Math.PI + (s / arc) * (Math.PI / 2)
    place(left + r + Math.cos(a) * r, top + r + Math.sin(a) * r)
    return
  }
  s -= arc

  // 7) Top side — going RIGHT
  if (s < sideW) { place(left + r + s, top); return }
  s -= sideW

  // 8) Top-right arc — 270° → 360° (north → east)
  {
    const t = arc > 0 ? Math.min(s / arc, 1) : 0
    const a = (3 * Math.PI / 2) + t * (Math.PI / 2)
    place(right - r + Math.cos(a) * r, top + r + Math.sin(a) * r)
  }
}

// ── Encouragement logic ──────────────────────────────────────────────────────

// Pick a random encouragement message, show it, then fade it out after 3s
function showEncouragement() {
  if (encouragementTimer) clearTimeout(encouragementTimer)
  const idx = Math.floor(Math.random() * ENCOURAGEMENTS.length)
  encouragementText.value = ENCOURAGEMENTS[idx]
  // After 3s visible, clear the text (CSS transition handles the 1s fade-out)
  encouragementTimer = setTimeout(() => {
    encouragementText.value = ''
  }, 3000)
}

// ── Animation loop ───────────────────────────────────────────────────────────

// Called every animation frame while running.
// Updates phase label, countdown, dot position, and encouragement trigger.
function tick() {
  if (!isRunning.value) return

  const nowMs       = Date.now()
  const elapsedMs   = Math.max(0, nowMs - startMs - pausedAccumMs)
  const cycleMs     = CYCLE_SECONDS * 1000
  const totalCycles = Math.floor(elapsedMs / cycleMs)
  const inCycleMs   = elapsedMs % cycleMs

  // Trigger encouragement at every CYCLES_PER_SET boundary
  if (
    totalCycles > 0 &&
    totalCycles % CYCLES_PER_SET === 0 &&
    totalCycles !== lastCompletedSet
  ) {
    lastCompletedSet = totalCycles
    showEncouragement()
  }

  // Update phase index (0–3)
  const newPhaseIndex = Math.floor(inCycleMs / (PHASE_SECONDS * 1000))
  phaseIndex.value    = Math.min(PHASES.length - 1, Math.max(0, newPhaseIndex))

  // Update countdown (counts down from PHASE_SECONDS to 1)
  const inPhaseMs   = inCycleMs % (PHASE_SECONDS * 1000)
  secondsLeft.value = Math.min(
    PHASE_SECONDS,
    Math.max(1, PHASE_SECONDS - Math.floor(inPhaseMs / 1000))
  )

  // Move the dot
  setDotProgress(inCycleMs / cycleMs)

  // Schedule next frame
  rafId = requestAnimationFrame(tick)
}

// ── Controls ─────────────────────────────────────────────────────────────────

function handleStart() {
  isRunning.value         = true
  phaseIndex.value        = 0
  secondsLeft.value       = PHASE_SECONDS
  pausedAccumMs           = 0
  startMs                 = Date.now()
  lastCompletedSet        = -1
  encouragementText.value = ''
  syncBoxMetrics()          // read latest element size and CSS vars
  setDotProgress(0)         // place dot at start position immediately
  rafId = requestAnimationFrame(tick)
}

// Pause resets back to the start screen
function handlePauseToStart() {
  if (!isRunning.value) return
  if (rafId) cancelAnimationFrame(rafId)
  rafId             = null
  isRunning.value   = false
  pausedAccumMs     = 0
  phaseIndex.value  = 0
  secondsLeft.value = PHASE_SECONDS
}

// ── Reduced motion ───────────────────────────────────────────────────────────

// Watches prefers-reduced-motion and disables CSS animations accordingly
function setupReducedMotionFlag() {
  if (typeof window === 'undefined' || !window.matchMedia) return
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = mq.matches
  const onChange = (e) => { prefersReducedMotion.value = !!e?.matches }
  if (mq.addEventListener) mq.addEventListener('change', onChange)
  else mq.addListener(onChange)
  return () => {
    if (mq.removeEventListener) mq.removeEventListener('change', onChange)
    else mq.removeListener(onChange)
  }
}

let cleanupReducedMotion = null

// ── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  cleanupReducedMotion = setupReducedMotionFlag() ?? null

  // Watch for element resize so dot stays accurate if layout shifts
  if (typeof window !== 'undefined' && window.ResizeObserver) {
    cleanupResizeObserver = (() => {
      const ro = new ResizeObserver(() => {
        syncBoxMetrics()
        if (!isRunning.value) setDotProgress(0)
      })
      if (boxWrapRef.value) ro.observe(boxWrapRef.value)
      return () => ro.disconnect()
    })()
  }

  // Initial dot placement at rest position
  if (typeof window !== 'undefined') {
    syncBoxMetrics()
    setDotProgress(0)
  }
})

onBeforeUnmount(() => {
  // Clean up all async resources to avoid memory leaks
  if (rafId) cancelAnimationFrame(rafId)
  rafId = null
  if (encouragementTimer) clearTimeout(encouragementTimer)
  encouragementTimer = null
  cleanupReducedMotion?.()
  cleanupResizeObserver?.()
})
</script>

<style scoped>
.panel {
  padding-top: 10px;
}

.back-btn {
  border: none;
  background: none;
  cursor: pointer;
  margin-bottom: 18px;
  font-size: 15px;
}

.sub {
  color: #7b6a5c;
}

/* No gap — each child controls its own spacing via margin */
.controls {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Shown only when stopped */
.start-hint {
  color: #7b6a5c;
  font-size: 14px;
  margin: 0 0 20px;
  text-align: center;
}

/*
  Fixed-height slot reserves space for the encouragement text
  so the Pause button never shifts when text appears/disappears.
  Hidden entirely when stopped so it doesn't push Start button down.
*/
.encouragement-slot {
  height: 22px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.encouragement {
  color: #7b6a5c;
  font-size: 14px;
  margin: 0;
  text-align: center;
  font-style: italic;
  white-space: nowrap;
}

/* Vue <Transition> classes for encouragement fade */
.encouragement-enter-active { transition: opacity 0.5s ease; }
.encouragement-leave-active  { transition: opacity 1s ease;  }
.encouragement-enter-from,
.encouragement-leave-to      { opacity: 0; }

.primary-btn,
.secondary-btn {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, opacity 0.18s ease,
              box-shadow 0.18s ease, background 0.18s ease;
}

.primary-btn {
  background: #b66a48;
  color: #fff;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.14);
}
.primary-btn:hover {
  transform: translateY(-1px);
  opacity: 0.96;
}

.secondary-btn {
  background: rgba(180, 106, 45, 0.12);
  color: #6a5238;
  box-shadow: 0 10px 24px rgba(97, 75, 52, 0.1);
}
.secondary-btn:hover {
  transform: translateY(-1px);
  background: rgba(180, 106, 45, 0.18);
}

/* ── Box wrap ────────────────────────────────────────────────────────────── */

.box-wrap {
  --size:       280px;
  --stroke:     6px;
  --radius:     26px;
  --dot:        16px;
  --track:      rgba(125, 61, 35, 0.72);
  --track-soft: rgba(125, 61, 35, 0.22);
  --bg:         rgba(253, 245, 241, 0.9);

  position: relative;
  width:  var(--size);
  height: var(--size);
  margin: 18px auto 14px;
  opacity: 0.9;
  transition: opacity 0.22s ease;
}

.box-wrap.is-running { opacity: 1; }

/* The square border track — z-index 0 so dot renders above it */
.box-track {
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  border: var(--stroke) solid var(--track);
  box-shadow: 0 14px 34px rgba(97, 75, 52, 0.12);
  background: linear-gradient(135deg,
    rgba(255,255,255,0.55),
    rgba(253,245,241,0.78));
  z-index: 0;
}

/* Subtle outer glow ring */
.box-track::after {
  content: "";
  position: absolute;
  inset: calc(var(--stroke) * -1);
  border-radius: calc(var(--radius) + var(--stroke));
  border: 1px solid var(--track-soft);
  pointer-events: none;
}

/*
  Dot is a direct child of .box-wrap so its absolute position
  is relative to box-wrap's top-left, not box-track's inner edge.
  z-index 1 ensures it renders above the track border.
*/
.box-dot {
  position: absolute;
  width:  var(--dot);
  height: var(--dot);
  border-radius: 999px;
  background: #fff;
  border: 3px solid #b66a48;
  box-shadow: 0 4px 12px rgba(97, 75, 52, 0.25);
  z-index: 1;
  will-change: transform;
}

/* Disable pulse animation when not running */
.box-wrap:not(.is-running) .center-ring {
  animation: none !important;
}

.center {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  z-index: 0;
}

.center-ring {
  position: absolute;
  width: 176px;
  height: 176px;
  border-radius: 999px;
  background: radial-gradient(circle at 40% 30%,
    rgba(255,255,255,0.86),
    rgba(246,231,222,0.92));
  box-shadow:
    0 18px 42px rgba(97, 75, 52, 0.14),
    inset 0 0 0 10px rgba(182, 106, 72, 0.12);
  animation: calm-pulse 8s ease-in-out infinite;
}

.center-content {
  position: relative;
  text-align: center;
}

.phase {
  font-size: 26px;
  font-weight: 700;
  color: #2a180f;
  letter-spacing: 0.02em;
  text-transform: lowercase;
}

.countdown {
  margin-top: 6px;
  font-size: 18px;
  font-weight: 700;
  color: #6a5238;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid rgba(180, 106, 45, 0.18);
  box-shadow: 0 10px 24px rgba(97, 75, 52, 0.08);
}

@keyframes calm-pulse {
  0%   { transform: scale(0.82); filter: saturate(1);    }
  50%  { transform: scale(1.2);  filter: saturate(1.05); }
  100% { transform: scale(0.82); filter: saturate(1);    }
}

/* Respect user's reduced motion preference */
.reduced-motion .center-ring {
  animation: none !important;
}

@media (max-width: 768px) {
  .box-wrap {
    --size:   250px;
    --radius: 24px;
  }
  .center-ring {
    width:  160px;
    height: 160px;
  }
  .phase { font-size: 24px; }
}
</style>