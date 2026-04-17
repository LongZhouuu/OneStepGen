<template>
  <!-- Landing: full-height scroll-snap (hero -> problem -> tools -> privacy -> footer). Root scroller, not body. -->
  <div class="home-page">
    <section class="hero-wrapper">
      <HeroSection />
    </section>

    <!-- Problem Section -->
    <section class="problem-section">
      <div class="problem-card">
        <div class="problem-copy">
          <p class="problem-kicker">When Getting Started Feels Hard</p>
          <h2 class="problem-title">Struggling to get started?</h2>
          <ul class="problem-points">
            <li class="problem-point">
              <span class="problem-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 4.75a7.25 7.25 0 1 0 7.25 7.25c0-.9-.16-1.75-.46-2.54" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M12 8.25v4.1l2.65 1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>You feel overwhelmed by tasks</span>
            </li>
            <li class="problem-point">
              <span class="problem-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5.75 9.5A6.25 6.25 0 0 1 18 11.25c0 4-4.25 4.25-4.25 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <circle cx="13.75" cy="19" r="1" fill="currentColor" />
                </svg>
              </span>
              <span>You don't know where to begin</span>
            </li>
            <li class="problem-point">
              <span class="problem-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="4.75" y="6.75" width="14.5" height="10.5" rx="3" stroke="currentColor" stroke-width="1.8" />
                  <path d="M19.25 9.5 14.5 12l4.75 2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>You keep delaying even simple work</span>
            </li>
            <li class="problem-point">
              <span class="problem-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 4.75c4.1 0 7.25 3.15 7.25 7.25S16.1 19.25 12 19.25 4.75 16.1 4.75 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="m9.25 9.75 5.5 5.5M14.75 9.75l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </span>
              <span>You lose focus easily once you start</span>
            </li>
          </ul>
          <p class="problem-closing">You're not alone - We created simple tools that guide you one step at a time.</p>
        </div>
      </div>
      <!-- In-page jump: scrollIntoView targets #core-tools inside this same scrollable root (hash alone is unreliable). -->
      <a
        href="#core-tools"
        class="section-flow section-flow-link"
        aria-label="Scroll to our core tools"
        @click.prevent="scrollToCoreTools"
      >
        <span class="section-flow-line"></span>
        <span class="section-flow-chip">
          <svg class="section-flow-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 5v14m0 0-4.25-4.25M12 19l4.25-4.25"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Here's how we support you
        </span>
        <span class="section-flow-line"></span>
      </a>
    </section>

    <!-- Core tools: id used by problem-section CTA above. -->
    <section id="core-tools" class="core-tools-section">
      <div class="section-header">
        <p class="section-label">Our core tools</p>
        <h2 class="section-title">Tools designed to help you start and stay on track</h2>
      </div>

      <div class="core-tools-content">
        <div class="tools-illustration">
          <img src="/tools-illustration.png" alt="Core Tools Illustration" />
        </div>

        <div class="tools-list">
          <RouterLink to="/tools/planner" class="tool-item tool-item-link">
            <h3 class="tool-name">Planner</h3>
            <p class="tool-kicker">Plan your day in simple steps</p>
            <p class="tool-description">
              Break tasks into small, clear actions so you don't feel overwhelmed
            </p>
            <p class="tool-cta">Start planning <span class="tool-cta-arrow">&gt;</span></p>
            <div class="tool-divider"></div>
          </RouterLink>

          <RouterLink to="/tools/prioritizer" class="tool-item tool-item-link">
            <h3 class="tool-name">
              Prioritizer <span class="tool-status"> - Coming soon</span>
            </h3>
            <p class="tool-kicker">Decide what to do first</p>
            <p class="tool-description">
              Highlight the most important task so you can start without overthinking
            </p>
            <p class="tool-cta">Sort priorities <span class="tool-cta-arrow">&gt;</span></p>
            <div class="tool-divider"></div>
          </RouterLink>

          <RouterLink to="/tools/support" class="tool-item tool-item-link">
            <h3 class="tool-name">
              Emotional Support <span class="tool-status"> - Coming soon</span>
            </h3>
            <p class="tool-kicker">Check in and reset</p>
            <p class="tool-description">
              Take a moment to reflect and manage stress when things feel too much
            </p>
            <p class="tool-cta">Get support <span class="tool-cta-arrow">&gt;</span></p>
            <div class="tool-divider"></div>
          </RouterLink>

          <RouterLink to="/tools/tips" class="tool-item tool-item-link">
            <h3 class="tool-name">Tips & Template</h3>
            <p class="tool-kicker">Use ready-made guides</p>
            <p class="tool-description">
              Follow structured templates for common tasks like meetings or emails
            </p>
            <p class="tool-cta">Use a guide <span class="tool-cta-arrow">&gt;</span></p>
            <div class="tool-divider"></div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Privacy & Security Section -->
    <section class="security-section">
      <div class="security-card">
        <div class="security-copy">
          <p class="security-kicker">Privacy & security</p>
          <h2 class="security-title">Built to feel safe when your brain already has enough to carry</h2>
          <p class="security-text">
            We don't store any of your information. Everything stays on your device, private and secure.
          </p>
          <div class="security-points">
            <div class="security-point">No stored personal Information</div>
            <div class="security-point">Private by default</div>
            <div class="security-point">Keeps planning and reflection local</div>
          </div>
        </div>
        <div class="security-visual">
          <div class="security-image">
            <img src="/security-bg.png" alt="Privacy and Security" />
          </div>
        </div>
      </div>
    </section>
    <!-- Footer as its own snap target so the last panel can sit flush in the snap sequence. -->
    <section class="footer-snap" style="scroll-snap-align: start; scroll-snap-stop: always;">
      <SiteFooter />
    </section>
  </div>

</template>

<script setup>
import { RouterLink } from 'vue-router'
import HeroSection from '@/components/HeroSection.vue'
import SiteFooter from '@/components/SiteFooter.vue';

/** Smooth-scroll the home page inner scroller to the core tools block. */
function scrollToCoreTools() {
  document.getElementById('core-tools')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
/* --- Page shell: vertical snap between major sections --- */
.home-page {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.hero-wrapper,
.problem-section,
.core-tools-section,
.security-section {
  min-height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

/* --- Problem framing (pain points + bridge CTA to tools) --- */
.problem-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 90px 24px 24px;
}

.problem-card {
  position: relative;
  overflow: hidden;
  padding: 80px;
  border-radius: 32px;
  background: linear-gradient(135deg, #f8f1ea 0%, #fffaf6 58%, #f3ebe3 100%);
  box-shadow: 0 18px 48px rgba(97, 75, 52, 0.08);
}

.problem-copy {
  position: relative;
  z-index: 1;
  max-width: 780px;
}

.problem-kicker {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #b46a2d;
  margin: 0 0 18px;
}

.problem-title {
  font-size: 3rem;
  font-weight: 500;
  line-height: 1.15;
  color: #333;
  margin: 0 0 15px;
}

.problem-points {
  display: grid;
  gap: 16px;
  padding: 0;
  list-style: none;
  margin-bottom: 20px;
}

.problem-point {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 30px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(180, 106, 45, 0.08);
  box-shadow: 0 10px 24px rgba(97, 75, 52, 0.04);
  backdrop-filter: blur(10px);
  font-size: 1.4rem;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.problem-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 238, 229, 0.92));
  border: 1px solid rgba(180, 106, 45, 0.12);
  box-shadow: 0 10px 20px rgba(97, 75, 52, 0.08);
  color: #b46a2d;
  flex-shrink: 0;
}

.problem-icon svg {
  width: 22px;
  height: 22px;
}

.problem-point:nth-child(1) .problem-icon {
  color: #b46a2d;
  background: linear-gradient(180deg, rgba(255, 248, 242, 0.98), rgba(245, 228, 209, 0.96));
}

.problem-point:nth-child(2) .problem-icon {
  color: #a6604f;
  background: linear-gradient(180deg, rgba(255, 249, 247, 0.98), rgba(243, 227, 220, 0.96));
}

.problem-point:nth-child(3) .problem-icon {
  color: #8e6944;
  background: linear-gradient(180deg, rgba(255, 251, 245, 0.98), rgba(240, 231, 215, 0.96));
}

.problem-point:nth-child(4) .problem-icon {
  color: #9b5f3f;
  background: linear-gradient(180deg, rgba(255, 247, 243, 0.98), rgba(244, 226, 216, 0.96));
}

.problem-closing {
  font-size: 1.35rem;
  font-weight: 500;
  line-height: 1.5;
  color: #333;
  margin: 0;
}

/* Divider + pill label between problem copy and core tools. */
.section-flow {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 28px auto 0;
  max-width: 760px;
}

/* Override global <a> hover tint from main.css. */
.section-flow-link {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.section-flow-link:hover {
  background-color: transparent;
}

.section-flow-link:hover .section-flow-chip {
  box-shadow: 0 10px 20px rgba(193, 144, 91, 0.489);
  border-color: rgba(180, 106, 45, 0.28);
}

.section-flow-link:focus-visible {
  outline: 2px solid #b46a2d;
  outline-offset: 4px;
  border-radius: 8px;
}

.section-flow-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(180, 106, 45, 0), rgba(180, 106, 45, 0.42), rgba(180, 106, 45, 0));
}

.section-flow-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 999px;
  background: rgba(255, 250, 245, 0.96);
  border: 1px solid rgba(180, 106, 45, 0.16);
  box-shadow: 0 10px 24px rgba(97, 75, 52, 0.06);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b46a2d;
}

.section-flow-icon {
  width: 16px;
  height: 16px;
}

/* --- Core tools: illustration + stacked tool links --- */
.core-tools-section {
  padding: 80px 24px 80px;
  max-width: 1200px;
  height: 120vh;
  margin: 0 auto;
}

.section-header {
  max-width: 1200px;
  margin-bottom: 15px;
}

.section-label {
  font-size: 1.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #b46a2d;
  margin-bottom: 1px;
}

.section-title {
  font-size: 3.2rem;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
  max-width: 1200px;
  margin: 0;
}

.core-tools-content {
  display: flex;
  gap: 72px;
  align-items: flex-start;
}

.tools-illustration {
  flex: 1;
  max-width: 420px;
  margin-top: 60px;
}

.tools-illustration img {
  width: 120%;
  height: auto;
  object-fit: contain;
  transform: translateX(-10%);
}

.tools-list {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-left: -30px;
  padding: 12px 40px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(246, 240, 235, 0.9) 0%, rgba(255, 250, 245, 0.5) 100%);
  box-shadow: 0 14px 36px rgba(97, 75, 52, 0.1);
}

.tool-item {
  padding-right: 20px;
  position: relative;
}

.tool-item-link {
  display: block;
  text-decoration: none;
  cursor: pointer;
}

/* Soft spotlight behind row on hover (z-index keeps it under text). */
.tool-item::before {
  content: '';
  position: absolute;
  top: -40px;
  left: -24px;
  right: -24px;
  bottom: -20px;
  border-radius: 12px;
  background: radial-gradient(ellipse at 50% 50%,
      rgba(233, 146, 54, 1) 0%,
      rgba(240, 226, 210, 0.43) 40%,
      rgba(255, 255, 255, 0) 70%);
  opacity: 0;
  transition: opacity 300ms ease-out;
  z-index: -1;
}

.tool-item:hover::before {
  opacity: 1;
}

.tool-name {
  font-size: clamp(1.35rem, 2.8vw, 1.8rem);
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
}

.tool-status {
  display: inline-block;
  margin-left: 8px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b46a2d;
  vertical-align: middle;
}

.tool-kicker {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: #b46a2d;
  margin: 0 0 10px;
}

.tool-description {
  font-size: 1.15rem;
  line-height: 1.2;
  color: #555;
  margin-bottom: 10px;
}

.tool-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #b46a2d;
  margin: 0 0 10px;
}

.tool-cta-arrow {
  font-size: 0.95rem;
  transition: transform 0.25s ease;
}

.tool-item:hover .tool-cta-arrow {
  transform: translateX(4px);
}

.tool-divider {
  height: 1px;
  background: linear-gradient(to right, #ccc, transparent);
}

/* --- Privacy & security --- */
.security-section {
  padding: 160px 24px 180px;
  max-width: 1200px;
  margin: 0 auto;
}

.security-card {
  display: flex;
  align-items: center;
  gap: 56px;
  padding: 56px;
  border-radius: 32px;
  background: linear-gradient(135deg, #f6efe8 0%, #fffaf5 55%, #f3ede7 100%);
  box-shadow: 0 18px 48px rgba(97, 75, 52, 0.08);
}

.security-copy {
  flex: 1;
  max-width: 460px;
}

.security-kicker {
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #b46a2d;
  margin: 0 0 18px;
}

.security-title {
  font-size: clamp(2rem, 4.5vw, 2.9rem);
  font-weight: 500;
  line-height: 1.15;
  color: #333;
  margin: 0 0 22px;
}

.security-text {
  font-size: 1.2rem;
  font-weight: 400;
  color: #555;
  line-height: 1.7;
  max-width: 420px;
  margin: 0 0 28px;
}

.security-points {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.security-point {
  padding: 12px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(180, 106, 45, 0.16);
  font-size: 0.95rem;
  font-weight: 500;
  color: #6a5238;
}

.security-visual {
  flex: 1;
}

.security-image {
  border-radius: 28px;
  overflow: hidden;
  min-height: 420px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.08));
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
}

.security-image img {
  width: 100%;
  height: 100%;
  display: block;
  min-height: 420px;
  object-fit: cover;
}

/* --- Breakpoint: drop side-by-side layouts, relax snap min-heights --- */
@media (max-width: 768px) {
  .home-page {
  scroll-snap-type: y proximity;
}

.hero-wrapper,
.problem-section,
.core-tools-section,
.security-section {
  min-height: auto;
  scroll-snap-stop: normal;
}

.tools-illustration {
  margin-top: 0;
}

.tools-illustration img {
  width: 100%;
  transform: none;
}
  .problem-section {
    padding: 80px 20px 20px;
    min-height: auto;
  }

  .problem-card {
    padding: 32px 24px;
    border-radius: 24px;
  }

  .problem-title {
    font-size: 2.1rem;
  }

  .problem-point {
    font-size: 1.05rem;
    gap: 12px;
    padding: 14px 14px 14px 12px;
    border-radius: 18px;
  }

  .problem-icon {
    width: 40px;
    height: 40px;
    border-radius: 14px;
  }

  .problem-icon svg {
    width: 18px;
    height: 18px;
  }

  .problem-closing {
    font-size: 1.1rem;
  }

  .section-flow {
    gap: 12px;
    margin-top: 24px;
  }

  .section-flow-chip {
    padding: 9px 14px;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
  }

  .core-tools-section {
    min-height: 100vh;
    padding: 28px 20px 64px;
  }

  .section-label {
    font-size: 0.8rem;
    letter-spacing: 0.14em;
  }

  .core-tools-content {
    flex-direction: column;
    gap: 40px;
  }

  .tools-illustration {
    max-width: 100%;
  }

  .tools-list {
    margin-left: 0;
    width: 100%;
    padding: 24px 20px;
    border-radius: 22px;
  }

  .section-title {
    font-size: clamp(2rem, 5vw, 3.2rem);
    max-width: none;
  }

  .security-section {
    padding: 80px 20px 120px;
  }

  .security-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    padding: 32px 24px;
    border-radius: 24px;
  }

  .security-copy {
    max-width: none;
  }

  .security-title {
    font-size: 2rem;
  }

  .security-text {
    font-size: 1.05rem;
    max-width: none;
  }

  .security-visual {
    width: 100%;
  }

  .security-image {
    min-height: 280px;
    border-radius: 20px;
  }

  .security-image img {
    min-height: 280px;
  }
}
</style>
