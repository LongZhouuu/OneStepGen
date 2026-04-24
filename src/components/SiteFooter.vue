<template>
  <footer class="site-footer" ref="footerEl">
    <canvas class="particles-canvas" ref="canvasEl" aria-hidden="true"></canvas>

    <div class="footer-inner">
      <div class="footer-top">
        <!-- Brand column -->
        <section class="footer-col brand-col fade-up" :style="{ '--delay': '0ms' }">
          <div class="brand-row">
            <span class="brand-dot" aria-hidden="true"></span>
            <span class="brand-name">OneStepGen</span>
          </div>
          <p class="brand-tagline">
            Helping users with ADHD reduce overwhelm, start tasks,
            and build momentum — one step at a time.
          </p>

          <div class="mood">
            <span class="mood-label">How<br />are<br />you?</span>
            <div class="mood-options" role="group" aria-label="How are you feeling?">
              <button
                v-for="mood in moods"
                :key="mood.id"
                type="button"
                class="mood-btn"
                :class="{ active: activeMood === mood.id }"
                :aria-pressed="activeMood === mood.id"
                :aria-label="mood.label"
                @click="selectMood(mood.id)"
              >
                <svg
                  class="mood-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    stroke="currentColor"
                    stroke-width="1.6"
                  />
                  <circle cx="9" cy="10.5" r="1" fill="currentColor" />
                  <circle cx="15" cy="10.5" r="1" fill="currentColor" />
                  <path
                    v-if="mood.id === 'good'"
                    d="M8.5 14.25c.9 1.2 2.1 1.85 3.5 1.85s2.6-.65 3.5-1.85"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    v-else-if="mood.id === 'meh'"
                    d="M8.5 15h7"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                  <path
                    v-else
                    d="M8.5 16.1c.9-1.2 2.1-1.85 3.5-1.85s2.6.65 3.5 1.85"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            <transition name="mood-fade" mode="out-in">
              <span v-if="moodMessage" :key="moodMessage" class="mood-message">
                {{ moodMessage }}
              </span>
            </transition>
          </div>
        </section>

        <!-- Quick links -->
        <nav class="footer-col fade-up" :style="{ '--delay': '80ms' }" aria-label="Quick links">
          <h4 class="col-title">Quick Links</h4>
          <ul class="link-list">
            <li>
              <RouterLink :to="{ name: 'Home' }" class="nav-link">
                <span class="nav-text">Home</span>
                <span class="nav-arrow" aria-hidden="true">→</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'Planner' }" class="nav-link">
                <span class="nav-text">Planner</span>
                <span class="nav-arrow" aria-hidden="true">→</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'Reward' }" class="nav-link">
                <span class="nav-text">Rewards</span>
                <span class="nav-arrow" aria-hidden="true">→</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'About' }" class="nav-link">
                <span class="nav-text">About us</span>
                <span class="nav-arrow" aria-hidden="true">→</span>
              </RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Support -->
        <section class="footer-col fade-up" :style="{ '--delay': '160ms' }">
          <h4 class="col-title">Support</h4>
          <div class="support-cards">
            <div class="support-card">
              <svg
                class="support-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="14"
                  rx="3"
                  stroke="currentColor"
                  stroke-width="1.6"
                />
                <path
                  d="M8 9h8M8 12.5h8M8 16h5"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              <span>Privacy-first design</span>
            </div>
            <div class="support-card">
              <svg
                class="support-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M12 8v4.25l2.6 1.6"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Not a medical or emergency service</span>
            </div>
          </div>
        </section>
      </div>

      <div class="footer-divider" aria-hidden="true"></div>

      <div class="footer-bottom fade-up" :style="{ '--delay': '240ms' }">
        <span class="copyright">© 2026 OneStepGen</span>
        <div class="legal-links">
          <a href="#">Privacy policy</a>
          <a href="#">Terms of use</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const footerEl = ref(null)
const canvasEl = ref(null)

const moods = [
  { id: 'good', label: 'Feeling good', message: 'Wonderful. Ride the momentum.' },
  { id: 'meh', label: 'Feeling meh', message: 'One tiny step counts. Begin there.' },
  { id: 'low', label: 'Feeling low', message: 'Take a breath. You are doing enough.' },
]

const activeMood = ref(null)
const moodMessage = ref('')

function selectMood(id) {
  activeMood.value = id
  const found = moods.find((m) => m.id === id)
  moodMessage.value = found ? found.message : ''
}

/* ---------- Particle network ---------- */
let rafId = null
let resizeObs = null
let io = null
let running = false

onMounted(() => {
  const canvas = canvasEl.value
  const host = footerEl.value
  if (!canvas || !host) return

  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  const state = {
    width: 0,
    height: 0,
    particles: [],
  }

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function resize() {
    const rect = host.getBoundingClientRect()
    state.width = rect.width
    state.height = rect.height
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    seed()
  }

  function seed() {
    const area = state.width * state.height
    const count = Math.max(18, Math.min(48, Math.round(area / 22000)))
    state.particles = new Array(count).fill(0).map(() => ({
      x: Math.random() * state.width,
      y: Math.random() * state.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: 0.8 + Math.random() * 1.1,
      a: 0.35 + Math.random() * 0.4,
    }))
  }

  function step() {
    if (!running) return
    ctx.clearRect(0, 0, state.width, state.height)

    const ps = state.particles
    const linkDist = 120
    const linkDistSq = linkDist * linkDist

    for (let i = 0; i < ps.length; i++) {
      const p = ps[i]
      p.x += p.vx
      p.y += p.vy
      if (p.x < -10) p.x = state.width + 10
      else if (p.x > state.width + 10) p.x = -10
      if (p.y < -10) p.y = state.height + 10
      else if (p.y > state.height + 10) p.y = -10

      ctx.beginPath()
      ctx.fillStyle = `rgba(253, 236, 216, ${p.a})`
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }

    for (let i = 0; i < ps.length; i++) {
      const a = ps[i]
      for (let j = i + 1; j < ps.length; j++) {
        const b = ps[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const d2 = dx * dx + dy * dy
        if (d2 < linkDistSq) {
          const alpha = (1 - d2 / linkDistSq) * 0.18
          ctx.strokeStyle = `rgba(212, 149, 110, ${alpha})`
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }

    rafId = requestAnimationFrame(step)
  }

  function start() {
    if (running || reduceMotion) {
      if (reduceMotion) {
        ctx.clearRect(0, 0, state.width, state.height)
        for (const p of state.particles) {
          ctx.beginPath()
          ctx.fillStyle = `rgba(253, 236, 216, ${p.a})`
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      return
    }
    running = true
    rafId = requestAnimationFrame(step)
  }

  function stop() {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
  }

  resize()

  resizeObs = new ResizeObserver(() => resize())
  resizeObs.observe(host)

  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) start()
        else stop()
      }
    },
    { threshold: 0.01 }
  )
  io.observe(host)
})

onBeforeUnmount(() => {
  running = false
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeObs) resizeObs.disconnect()
  if (io) io.disconnect()
})
</script>

<style scoped>
.site-footer {
  position: relative;
  margin-top: auto;
  background: linear-gradient(
  to bottom,
  rgba(45,31,20,.97),
  rgba(35,24,16,.98)
  );
  color: #fdf6f0;
  overflow: hidden;
  isolation: isolate;
}

.particles-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.9;
}

.footer-inner {
  position: relative;
  z-index: 1;
  max-width: 1240px;
  margin: 0 auto;
  padding: 56px 48px 28px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr;
  gap: 56px;
  align-items: flex-start;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

/* Brand */
.brand-col {
  max-width: 420px;
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #fdf6f0;
}

.brand-dot {
  position: relative;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #b46a2d;
  box-shadow: 0 0 0 0 rgba(180, 106, 45, 0.55);
  animation: brand-pulse 2.6s ease-in-out infinite;
}

.brand-dot::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(212, 149, 110, 0.55) 0%, rgba(212, 149, 110, 0) 70%);
  animation: brand-halo 2.6s ease-in-out infinite;
}

@keyframes brand-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(180, 106, 45, 0.55);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 0 8px rgba(180, 106, 45, 0);
  }
}

@keyframes brand-halo {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.15; transform: scale(1.6); }
}

.brand-tagline {
  font-size: 15px;
  line-height: 1.65;
  color: rgba(253, 246, 240, 0.72);
  margin: 0;
}

/* Mood widget */
.mood {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  border: 1px solid rgba(253, 246, 240, 0.1);
  border-radius: 18px;
  background: rgba(253, 246, 240, 0.03);
  width: fit-content;
  max-width: 100%;
  flex-wrap: nowrap;
}

.mood-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.2;
  color: rgba(253, 246, 240, 0.55);
  text-transform: none;
}

.mood-options {
  display: flex;
  gap: 6px;
}

.mood-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(253, 246, 240, 0.1);
  background: rgba(253, 246, 240, 0.04);
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  font-family: inherit;
}

.mood-icon {
  width: 20px;
  height: 20px;
  color: rgba(253, 246, 240, 0.7);
  transition: color 0.2s ease;
}

.mood-btn:hover .mood-icon {
  color: #d4956e;
}

.mood-btn.active .mood-icon {
  color: #d4956e;
}

.mood-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(180, 106, 45, 0.5);
  background: rgba(180, 106, 45, 0.12);
}

.mood-btn.active {
  border-color: #b46a2d;
  background: rgba(180, 106, 45, 0.22);
  box-shadow: 0 0 0 3px rgba(180, 106, 45, 0.18);
}

.mood-message {
  font-size: 13.5px;
  font-weight: 600;
  color: #d4956e;
  letter-spacing: 0.01em;
  white-space: nowrap;
  flex-shrink: 0;
}

.mood-fade-enter-active,
.mood-fade-leave-active {
  transition: opacity 0.2s ease;
}
.mood-fade-enter-from,
.mood-fade-leave-to {
  opacity: 0;
}

/* Columns */
.col-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(253, 246, 240, 0.55);
  margin: 0 0 4px;
}

.link-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Nav links with sweep underline + arrow reveal */
.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  color: #fdf6f0;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  width: fit-content;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px;
  height: 1.5px;
  width: 100%;
  background: #b46a2d;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-arrow {
  display: inline-block;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.25s ease, transform 0.25s ease;
  color: #d4956e;
  font-weight: 600;
}

.nav-link:hover,
.nav-link:focus-visible,
.nav-link.router-link-active {
  color: #fdf6f0;
  outline: none;
}

.nav-link:hover::after,
.nav-link:focus-visible::after {
  transform: scaleX(1);
}

.nav-link:hover .nav-arrow,
.nav-link:focus-visible .nav-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Support cards */
.support-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.support-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(253, 246, 240, 0.1);
  border-radius: 14px;
  background: rgba(253, 246, 240, 0.03);
  font-size: 14px;
  color: rgba(253, 246, 240, 0.88);
  line-height: 1.35;
  transition: border-color 0.2s ease, background 0.2s ease;
}

/* .support-card:hover {
  border-color: rgba(180, 106, 45, 0.4);
  background: rgba(180, 106, 45, 0.08);
} */

.support-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #d4956e;
}

/* Divider with shimmer sweep */
.footer-divider {
  position: relative;
  height: 1px;
  width: 100%;
  background: rgba(253, 246, 240, 0.1);
  overflow: hidden;
}

.footer-divider::before {
  content: '';
  position: absolute;
  top: 0;
  left: -30%;
  height: 100%;
  width: 30%;
  background: linear-gradient(
    90deg,
    rgba(180, 106, 45, 0) 0%,
    rgba(212, 149, 110, 0.7) 50%,
    rgba(180, 106, 45, 0) 100%
  );
  animation: divider-shimmer 6s linear infinite;
}

@keyframes divider-shimmer {
  0% { left: -30%; }
  100% { left: 130%; }
}

/* Bottom row */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: rgba(253, 246, 240, 0.55);
}

.legal-links {
  display: flex;
  gap: 28px;
}

.legal-links a {
  color: rgba(253, 246, 240, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-links a:hover {
  color: #d4956e;
}

/* Mount fade-up */
.fade-up {
  opacity: 0;
  transform: translateY(12px);
  animation: fade-up-in 0.7s cubic-bezier(0.2, 0.6, 0.2, 1) forwards;
  animation-delay: var(--delay, 0ms);
}

@keyframes fade-up-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-up,
  .brand-dot,
  .brand-dot::after,
  .footer-divider::before {
    animation: none !important;
  }
  .fade-up {
    opacity: 1;
    transform: none;
  }
}

/* Responsive */
@media (max-width: 900px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .brand-col {
    grid-column: 1 / -1;
    max-width: none;
  }
}

@media (max-width: 600px) {
  .footer-inner {
    padding: 40px 22px 22px;
    gap: 28px;
  }
  .footer-top {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .legal-links {
    gap: 20px;
  }
}
</style>
