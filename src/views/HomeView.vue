<template>
  <div class="home-page">
    <!-- HERO -->
    <section class="hero-wrapper" id="hero-section">
      <HeroSection scroll-target="intro-section" />
    </section>

    <!-- INTRO -->
    <section class="section-intro" id="intro-section">
      <p class="eyebrow">When Getting Started Feels Hard</p>
      <h2>Struggling to get started?</h2>
      <p>
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

      <p class="not-alone">
        You're not alone — We created simple tools that guide you one step at a time.
      </p>

      <button class="scroll-hint" @click="scrollToSection('flow-section')">
        ↓ Here's how we support you
      </button>
    </section>

    <!-- FLOW -->
    <section class="section-flow" id="flow-section">
      <p class="eyebrow">Guided Flow Overview</p>
      <h2>Four simple steps to get things done</h2>

      <div class="flow-steps">
        <div class="flow-step">
          <div class="flow-num">1</div>
          <h3>Dump Ideas</h3>
          <p>
            Write everything on your mind or upload a document. Our AI instantly
            organises your thoughts into a clear, prioritised task list.
          </p>
        </div>

        <div class="flow-step">
          <div class="flow-num">2</div>
          <h3>Plan</h3>
          <p>
            Review your AI-sorted tasks across four priority categories. Add, edit,
            reorder or remove tasks until your list feels right.
          </p>
        </div>

        <div class="flow-step">
          <div class="flow-num">3</div>
          <h3>Focus</h3>
          <p>
            Set a session timer, then swipe through one task at a time. Complete or
            skip — no overwhelm, just one card at a time.
          </p>
        </div>

        <div class="flow-step">
          <div class="flow-num">4</div>
          <h3>Complete</h3>
          <p>
            Celebrate finishing your session and earn a reward animal. Collect them
            all — every small win counts.
          </p>
        </div>
      </div>

      <p class="flow-back-note">
        You can always go back to any previous step to adjust your ideas, plan, or tasks.
      </p>

      <button class="scroll-hint flow-scroll-hint" @click="scrollToSection('security-section')">
        ↓ See how we keep it private
      </button>
    </section>

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
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { startWorkflow } from '@/router/workflow'
import HeroSection from '@/components/HeroSection.vue'

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
  padding: 100px 80px;
  background: transparent;
  text-align: center;
}

.eyebrow {
  font-size: 15px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--terracotta);
  font-weight: 600;
  margin-bottom: 16px;
}

.section-intro h2 {
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 600;
  color: var(--brown-dark);
  margin-bottom: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-intro p {
  font-size: 18px;
  line-height: 1.7;
  color: #555;
  max-width: 560px;
  margin: 0 auto 56px;
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  max-width: 980px;
  margin: 0 auto 40px;
}

.pain-card {
  background: var(--card-warm);
  border: 1px solid rgba(180, 106, 45, 0.08);
  border-radius: 22px;
  padding: 22px 30px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 12px 28px rgba(97, 75, 52, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.pain-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 32px rgba(97, 75, 52, 0.1);
}

.pain-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(180, 106, 45, 0.12);
  box-shadow: 0 8px 18px rgba(97, 75, 52, 0.06);
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
  font-size: 20px;
  font-weight: 500;
  color: var(--brown-text);
  white-space: nowrap;
}

.not-alone {
  font-size: 20px;
  font-weight: 600;
  color: var(--brown-dark);
  max-width: none;
  width: max-content;
  margin: 32px auto 0;
  white-space: nowrap;
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
  margin-top: 18px;
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

.section-flow .eyebrow {
  text-align: center;
}

.section-flow h2 {
  font-size: clamp(28px, 3vw, 38px);
  text-align: center;
  color: var(--brown-dark);
  margin-bottom: 48px;
  font-weight: 600;
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto 40px;
}

.flow-step {
  background: var(--card-warm);
  border: 1px solid rgba(180, 106, 45, 0.08);
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: var(--shadow-card);
  position: relative;
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;
}

.flow-step:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-float);
}

.flow-num {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(180, 106, 45, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: var(--terracotta);
  margin-bottom: 16px;
}

.flow-step h3 {
  font-size: 22px;
  font-weight: 600;
  color: var(--brown-dark);
  margin-bottom: 10px;
}

.flow-step p {
  font-size: 18px;
  line-height: 1.6;
  color: #555;
}

.flow-back-note {
  text-align: center;
  font-size: 20px;
  color: rgba(180, 106, 45, 0.8);
  /* margin-top: 0px; */
  max-width: none;
  width: max-content;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  white-space: nowrap;
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
@media (max-width: 900px) {
  .flow-steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .privacy-card {
    grid-template-columns: 1fr;
    padding: 40px 28px;
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
  .pain-cards {
    grid-template-columns: 1fr;
  }

  .flow-steps {
    grid-template-columns: 1fr;
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
</style>
