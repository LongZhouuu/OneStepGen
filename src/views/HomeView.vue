<template>
  <div class="home-page">
    <!-- HERO -->
    <section class="hero-wrapper" id="hero-section">
      <HeroSection scroll-target="intro-section" />
    </section>

    <!-- INTRO -->
    <section class="section-intro" id="intro-section">
      <div class="intro-container">
        <div class="intro-visual">
          <img
            src="@/assets/work-person.png"
            alt="A person working calmly at their desk"
            class="intro-illustration"
          />
        </div>

        <div class="intro-content">
          <p class="eyebrow">When Getting Started Feels Hard</p>
          <h2>Struggling to get started?</h2>
          <p class="intro-lead">
            Feeling overwhelmed by too many tasks? We help you break them down,
            organise them, and focus on one at a time.
          </p>

          <div class="pain-cards">
            <div class="pain-card">
              <div class="pain-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4.75a7.25 7.25 0 1 0 7.25 7.25c0-.9-.16-1.75-.46-2.54"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 8.25v4.1l2.65 1.8"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>You feel overwhelmed by tasks</span>
            </div>

            <div class="pain-card">
              <div class="pain-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5.75 9.5A6.25 6.25 0 0 1 18 11.25c0 4-4.25 4.25-4.25 6"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="13.75" cy="19" r="1" fill="currentColor" />
                </svg>
              </div>
              <span>You don't know where to begin</span>
            </div>

            <div class="pain-card">
              <div class="pain-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="4.75" y="6.75" width="14.5" height="10.5" rx="3" stroke="currentColor" stroke-width="1.8" />
                  <path
                    d="M19.25 9.5 14.5 12l4.75 2.5"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>You keep delaying even simple work</span>
            </div>

            <div class="pain-card">
              <div class="pain-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 4.75c4.1 0 7.25 3.15 7.25 7.25S16.1 19.25 12 19.25 4.75 16.1 4.75 12"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path d="m9.25 9.75 5.5 5.5M14.75 9.75l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                </svg>
              </div>
              <span>You lose focus easily once you start</span>
            </div>
          </div>
        </div>
      </div>

      <p class="not-alone">
        You're not alone — We created simple tools that guide you one step at a time.
      </p>

      <button class="scroll-hint" @click="scrollToSection('flow-section')">
        ↓ Here's how we support you
      </button>
    </section>

    <!-- FLOW -->
    <section class="section-flow" id="flow-section">
      <div class="flow-container">
        <div class="flow-side">
          <div class="flow-intro">
            <p class="eyebrow">How it works</p>
            <h2 class="flow-title">
              <span>Four steps.</span>
              <span class="accent">Just begin.</span>
            </h2>
            <p class="flow-back-note">
              You can always go back to any previous step to adjust your ideas, plan, or tasks.
            </p>
          </div>

          <div class="flow-aside">
            <div class="flow-support-note">
              <p class="flow-support-title">Need a reset moment?</p>
              <p class="flow-support-text">
                Use the floating Support button on the right anytime for emotional support tools.
              </p>
            </div>

            <button class="scroll-hint flow-scroll-hint" @click="scrollToSection('security-section')">
              ↓ See how we keep it private
            </button>
          </div>
        </div>

        <ol class="flow-timeline">
          <li class="flow-row flow-row--left">
            <div class="flow-text">
              <h3>Dump Ideas</h3>
              <p>
                Write everything on your mind. AI organises your thoughts into
                a clear, prioritised list.
              </p>
              <span class="flow-pill">AI-powered</span>
            </div>
            <div class="flow-num">1</div>
          </li>

          <li class="flow-row flow-row--right">
            <div class="flow-num">2</div>
            <div class="flow-text">
              <h3>Plan</h3>
              <p>
                Review your AI-sorted tasks. Add, edit, or reorder until it
                feels right.
              </p>
            </div>
          </li>

          <li class="flow-row flow-row--left">
            <div class="flow-text">
              <h3>Focus</h3>
              <p>
                Set a timer, swipe one task at a time. Complete or skip — no
                overwhelm.
              </p>
            </div>
            <div class="flow-num">3</div>
          </li>

          <li class="flow-row flow-row--right">
            <div class="flow-num">4</div>
            <div class="flow-text">
              <h3>Complete</h3>
              <p>
                Celebrate finishing your session and earn a reward animal.
                Every small win counts.
              </p>
              <span class="flow-pill">
                <span class="pill-icon" aria-hidden="true">🐾</span>
                Rewards
              </span>
            </div>
          </li>
        </ol>
      </div>

    <!-- PRIVACY -->
    <section class="security-section" id="security-section">
      <div class="security-card">
        <div class="security-copy">
          <p class="security-kicker">Privacy &amp; security</p>
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

    <!-- CTA -->
    <section class="section-cta">
      <div class="section-cta-card">
        <h2>Ready to take your first step?</h2>
        <p>Start small. Start messy. Just start.</p>

        <button class="btn-cta-big" @click="enterWorkspace">
          Enter Workspace →
        </button>
      </div>
    </section>

    <!-- BACK TO TOP -->
    <button v-if="showBackTop" class="back-top-btn" @click="scrollToTop" title="Click to Return to Top">
      ↑
    </button>
    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { startWorkflow } from '@/router/workflow'
import HeroSection from '@/components/HeroSection.vue'
import { ref, onMounted, onUnmounted } from 'vue'

const showBackTop = ref(false)

function handleScroll() {
  showBackTop.value = window.scrollY > 100
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const router = useRouter()

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return

  const navOffset = 60
  const targetTop = el.getBoundingClientRect().top + window.scrollY - navOffset

  window.scrollTo({
    top: targetTop,
    behavior: 'smooth',
  })
}

function enterWorkspace() {
  startWorkflow()
  router.push({ name: 'AIDump' })
}
</script>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}

:global(body) {
  margin: 0;
  padding: 0;
  background: transparent;
  overflow-x: hidden;
}

.home-page {
  --sand-100: #fffaf6;
  --sand-200: #f8f1ea;
  --sand-300: #f3ebe3;
  --terracotta: #b46a2d;
  --terracotta-light: #c98b58;
  --terracotta-dark: #9b5f3f;
  --brown-dark: #333333;
  --brown-mid: #6a5238;
  --brown-text: #555555;
  --card-warm: linear-gradient(135deg, rgba(248, 241, 234, 0.94) 0%, rgba(255, 250, 246, 0.98) 100%);
  --card-soft: linear-gradient(135deg, rgba(246, 239, 232, 0.94) 0%, rgba(255, 250, 245, 0.98) 100%);
  --radius-btn: 50px;
  --shadow-card: 0 16px 36px rgba(97, 75, 52, 0.08);
  --shadow-float: 0 18px 40px rgba(97, 75, 52, 0.12);

  min-height: 100vh;
  color: var(--brown-text);
  background: transparent;
}

.hero-wrapper {
  min-height: 100vh;
}

.section-intro,
.section-flow,
.security-section {
  min-height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  scroll-margin-block: 72px;
}

.btn-primary {
  background: var(--brown-dark);
  color: var(--sand-100);
  border: none;
  border-radius: var(--radius-btn);
  padding: 16px 36px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-primary:hover {
  background: #4d3c2d;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(45, 31, 20, 0.25);
}

.btn-ghost {
  background: rgba(255, 250, 245, 0.78);
  color: var(--brown-dark);
  border: 1.5px solid rgba(180, 106, 45, 0.18);
  border-radius: var(--radius-btn);
  padding: 15px 32px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-ghost:hover {
  background: rgba(255, 250, 245, 0.94);
  transform: translateY(-2px);
}

/* INTRO */
.section-intro {
  padding: 60px 80px;
  background: transparent;
  text-align: left;
}

.eyebrow {
  font-size: 15px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--terracotta);
  font-weight: 600;
  margin-bottom: 16px;
}

.intro-container {
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.85fr 1.4fr;
  gap: 48px;
  align-items: center;
}

.intro-visual {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: -40px;
}

.intro-illustration {
  width: 100%;
  max-width: 460px;
  height: auto;
  display: block;
  filter: drop-shadow(0 24px 40px rgba(97, 75, 52, 0.12));
}

.intro-content {
  display: flex;
  flex-direction: column;
}

.section-intro h2 {
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 600;
  color: var(--brown-dark);
  margin: 0 0 20px;
  max-width: none;
}

.section-intro .intro-lead {
  font-size: 18px;
  line-height: 1.8;
  color: #555;
  max-width: 620px;
  margin: 0 0 24px;
}

.section-intro .eyebrow {
  font-size: 15px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--terracotta);
  font-weight: 600;
  margin-bottom: 16px;
}

.pain-cards {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 620px;
  margin: 0;
}

.pain-card {
  background: var(--card-warm);
  border: 1px solid rgba(180, 106, 45, 0.08);
  border-radius: 18px;
  padding: 14px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 10px 24px rgba(97, 75, 52, 0.05);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.pain-card:hover {
  transform: translateX(4px);
  border-color: rgba(180, 106, 45, 0.22);
  box-shadow: 0 14px 28px rgba(97, 75, 52, 0.08);
}

.pain-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(180, 106, 45, 0.12);
  box-shadow: 0 6px 16px rgba(97, 75, 52, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
  color: var(--terracotta);
}

.pain-icon svg {
  width: 20px;
  height: 20px;
}

.pain-card span {
  font-size: 17px;
  font-weight: 500;
  color: var(--brown-text);
  line-height: 1.4;
}

.not-alone {
  font-size: 19px;
  font-weight: 600;
  color: var(--brown-dark);
  max-width: none;
  width: max-content;
  margin: 24px auto 32px;
  text-align: center;
  white-space: nowrap;
  line-height: 1.55;
}

.scroll-hint {
  display: inline-flex;
  align-self: center;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--terracotta);
  margin-top: 25px;
  cursor: pointer;
  border: 1px solid rgba(180, 106, 45, 0.16);
  border-radius: 50px;
  padding: 8px 16px;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 10px 24px rgba(97, 75, 52, 0.06);
  width: fit-content;
  position: relative;
  top: -40px;
}

.scroll-hint:hover {
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 12px 26px rgba(97, 75, 52, 0.1);
}

.flow-scroll-hint {
  top: 0;
  margin-top: 28px;
}

/* FLOW */
.section-flow {
  padding: 80px 80px 60px;
  background: transparent;
  justify-content: flex-start;
}

.flow-container {
  max-width: 1120px;
  margin: 0 auto 40px;
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) 1.4fr;
  gap: 64px;
  align-items: stretch;
}

.flow-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
}

.flow-intro .eyebrow {
  text-align: left;
  margin-bottom: 18px;
}

.flow-aside {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  text-align: left;
}

.flow-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.1;
  font-weight: 800;
  color: var(--brown-dark);
  margin: 0;
  text-align: left;
}

.flow-title .accent {
  color: var(--terracotta);
}

.flow-timeline {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 44px;
}

.flow-timeline::before {
  content: '';
  position: absolute;
  top: 28px;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  width: 1.5px;
  background: rgba(180, 106, 45, 0.35);
}

.flow-row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 0;
  min-height: 72px;
}

.flow-num {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--terracotta);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(180, 106, 45, 0.25);
  z-index: 1;
}

.flow-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 320px;
}

.flow-row--left .flow-text {
  grid-column: 1;
  text-align: right;
  padding-right: 56px;
  justify-self: end;
}

.flow-row--right .flow-text {
  grid-column: 2;
  text-align: left;
  padding-left: 56px;
  justify-self: start;
}

.flow-text h3 {
  font-size: 25px;
  font-weight: 700;
  color: #1f1a14;
  margin: 0;
}

.flow-text p {
  font-size: 18px;
  line-height: 1.55;
  color: #6b5f54;
  margin: 0;
  max-width: none;
}

.flow-pill {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(180, 106, 45, 0.14);
  color: #a35b25;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 999px;
  letter-spacing: 0.01em;
  margin-top: 4px;
}

.flow-row--left .flow-pill {
  align-self: flex-end;
}

.flow-pill .pill-icon {
  font-size: 13px;
  line-height: 1;
}

.flow-back-note {
  text-align: left;
  font-size: 16px;
  color: rgba(180, 106, 45, 0.8);
  max-width: 340px;
  margin: 18px 0 0;
  line-height: 1.55;
}

.flow-aside .flow-scroll-hint {
  align-self: flex-start;
  margin-top: 0;
}

.flow-support-note {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 340px;
}

.flow-support-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--brown-dark);
  margin: 0;
}

.flow-support-text {
  font-size: 14.5px;
  line-height: 1.55;
  color: #6b5f54;
  margin: 0;
}

/* PRIVACY */
.security-section {
  min-height: auto;
  display: block;
  padding: 80px 80px 70px;
  background: transparent;
}

.security-card {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 56px;
  padding: 50px;
  border-radius: 32px;
  background: linear-gradient(135deg, #f6efe8 0%, #fffaf5 55%, #f3ede7 100%);
  box-shadow: 0 18px 48px rgba(97, 75, 52, 0.08);
}

.security-copy {
  flex: 1;
  max-width: 460px;
}

.security-kicker {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #b46a2d;
  margin: 0 0 18px;
}

.security-title {
  font-size: clamp(1.5rem, 4.5vw, 2.5rem);
  font-weight: 600;
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

/* CTA */
.section-cta {
  padding: 60px 80px 100px;
  /* min-height: auto; */
  /* display: block; */
  text-align: center;
  background: linear-gradient(135deg, #d59a72 0%, #e7c2a2 45%, #f1dfcf 100%);
  position: relative;
  overflow: hidden;
}

.section-cta-card {
  max-width: 980px;
  margin: 0 auto;
  padding: 0;
}

.section-cta h2 {
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 600;
  color: #2d1f14;
  margin-bottom: 16px;
}

.section-cta p {
  font-size: 17px;
  color: rgba(14, 8, 5, 0.78);
  margin-bottom: 40px;
}

.btn-cta-big {
  background: #2d1f14;
  color: var(--sand-100);
  border: none;
  border-radius: var(--radius-btn);
  padding: 25px 56px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-cta-big:hover {
  background: var(--brown-mid);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(45, 31, 20, 0.3);
}

/* RESPONSIVE */
@media (max-width: 960px) {
  .flow-container {
    grid-template-columns: 1fr;
    grid-template-areas:
      'side-top'
      'timeline'
      'side-bottom';
    gap: 40px;
  }

  .flow-side {
    display: contents;
  }

  .flow-intro {
    grid-area: side-top;
    text-align: center;
  }

  .flow-timeline {
    grid-area: timeline;
  }

  .flow-aside {
    grid-area: side-bottom;
    align-items: center;
    text-align: center;
  }

  .flow-aside .flow-back-note,
  .flow-aside .flow-support-note {
    text-align: center;
    max-width: none;
    align-items: center;
  }

  .flow-aside .flow-scroll-hint {
    align-self: center;
  }

  .flow-intro .eyebrow,
  .flow-title {
    text-align: center;
  }

  .flow-title {
    align-items: center;
  }

  .flow-timeline::before {
    left: 28px;
    transform: none;
  }

  .flow-row {
    grid-template-columns: 56px 1fr;
    gap: 18px;
    min-height: 0;
  }

  .flow-num {
    position: static;
    transform: none;
    grid-column: 1;
  }

  .flow-row--left .flow-text,
  .flow-row--right .flow-text {
    grid-column: 2;
    text-align: left;
    padding: 0;
    justify-self: stretch;
    max-width: none;
  }

  .flow-row--left .flow-pill,
  .flow-row--right .flow-pill {
    align-self: flex-start;
  }

  .privacy-card {
    grid-template-columns: 1fr;
    padding: 40px 28px;
  }
}

@media (max-width: 960px) {
  .intro-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .intro-visual {
    order: -1;
    justify-content: center;
    margin-left: 0;
  }

  .intro-illustration {
    max-width: 320px;
  }

  .section-intro {
    text-align: center;
  }

  .intro-content {
    align-items: center;
  }

  .section-intro .intro-lead,
  .pain-cards {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 24px 60px;
  }

  .section-intro,
  .section-flow,
  .security-section,
  .section-cta {
    padding-left: 24px;
    padding-right: 24px;
  }

  .section-intro,
  .section-flow,
  .section-cta {
    padding-top: 70px;
    padding-bottom: 70px;
  }

  .section-cta-card {
    padding: 0;
  }
}

@media (max-width: 640px) {
  .pain-card {
    padding: 16px 18px;
  }

  .pain-card span {
    font-size: 15px;
  }

  .flow-num {
    width: 48px;
    height: 48px;
    font-size: 19px;
  }

  .flow-text h3 {
    font-size: 18px;
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

  .hero-title {
    font-size: clamp(40px, 12vw, 60px);
  }

  .hero-sub,
  .section-intro p,
  .section-cta p {
    font-size: 16px;
  }

  .hero-ctas {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary,
  .btn-ghost,
  .btn-cta-big {
    width: 100%;
  }
}

.back-top-btn {
  position: fixed;
  /* right: 32px; */
  bottom: 110px;
  right: 26px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background-color: #11182700;
  color: #b66a48;
  border: 1.2px #b66a48 solid;
  font-size: 24px;
  cursor: pointer;
  z-index: 999;
  transition: all .3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-top-btn:hover {
  background-color: #b66a48;
  color: white;
}
</style>
