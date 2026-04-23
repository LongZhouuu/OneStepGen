<template>
  <div class="home-page">
    <!-- HERO -->
    <section class="hero" id="hero-section">
      <div class="hero-content">
        <p class="hero-eyebrow">Designed for ADHD Minds</p>
        <h1 class="hero-title"><em>One step</em> at a time</h1>
        <p class="hero-sub">
          A simple tool designed for people with ADHD to break down tasks,
          reduce overwhelm, and get started.
        </p>

        <div class="hero-ctas">
          <button class="btn-primary" @click="scrollToSection('intro-section')">
            See How It Works ↓
          </button>

          <button class="btn-ghost" @click="enterWorkspace">
            Quick Start →
          </button>
        </div>
      </div>
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
          <div class="pain-icon">⏰</div>
          <span>You feel overwhelmed by tasks</span>
        </div>

        <div class="pain-card">
          <div class="pain-icon">?</div>
          <span>You don't know where to begin</span>
        </div>

        <div class="pain-card">
          <div class="pain-icon">⌛</div>
          <span>You keep delaying even simple work</span>
        </div>

        <div class="pain-card">
          <div class="pain-icon">↻</div>
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
    </section>

    <!-- PRIVACY -->
    <section class="section-privacy">
      <div class="privacy-card">
        <div class="privacy-text">
          <p class="eyebrow privacy-eyebrow">Privacy &amp; Security</p>
          <h2 class="privacy-headline">
            Built to feel safe when your brain already has enough to carry
          </h2>
          <p class="privacy-desc">
            We don't store any of your information. Everything stays on your device,
            private and secure.
          </p>

          <div class="privacy-tags">
            <span class="privacy-tag">No stored personal information</span>
            <span class="privacy-tag">Private by default</span>
            <span class="privacy-tag">Keeps planning and reflection local</span>
          </div>
        </div>

        <div class="privacy-image">
          <div class="privacy-img-placeholder">🔒</div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-cta">
      <h2>Ready to take the first step?</h2>
      <p>Start small. Start messy. Just start.</p>

      <button class="btn-cta-big" @click="enterWorkspace">
        Enter Workspace →
      </button>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { startWorkflow } from '@/router/workflow'

const router = useRouter()

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return

  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
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
  background: #fdf6f0;
  overflow-x: hidden;
}

.home-page {
  --sand-100: #fdf6f0;
  --sand-200: #f5e8d8;
  --sand-300: #e8cdb0;
  --terracotta: #c1714f;
  --terracotta-light: #d4956e;
  --terracotta-dark: #a05840;
  --brown-dark: #2d1f14;
  --brown-mid: #5c3d28;
  --brown-text: #3d2a1a;
  --radius-btn: 50px;
  --shadow-card: 0 8px 40px rgba(193, 113, 79, 0.13);
  --shadow-float: 0 12px 48px rgba(193, 113, 79, 0.25);

  min-height: 100vh;
  font-family: 'Baloo 2', cursive;
  color: var(--brown-text);
}

/* HERO */
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #d4956e 0%, #c8856a 30%, #e8b89a 65%, #f5d8c0 100%);
  display: flex;
  align-items: center;
  padding: 120px 80px 80px;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 680px;
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(45, 31, 20, 0.65);
  text-transform: uppercase;
  margin-bottom: 20px;
}

.hero-title {
  font-family: 'Baloo 2', cursive;
  font-size: clamp(52px, 6vw, 80px);
  line-height: 1.12;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 24px;
}

.hero-title em {
  font-style: normal;
  font-weight: 700;
  color: #2d1f14;
}

.hero-sub {
  font-size: 18px;
  line-height: 1.6;
  color: rgba(45, 31, 20, 0.75);
  margin-bottom: 48px;
  max-width: 480px;
}

.hero-ctas {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-ghost,
.btn-cta-big,
.scroll-hint {
  font-family: 'Baloo 2', cursive;
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
  background: var(--brown-mid);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(45, 31, 20, 0.25);
}

.btn-ghost {
  background: rgba(253, 246, 240, 0.7);
  color: var(--brown-dark);
  border: 1.5px solid rgba(45, 31, 20, 0.25);
  border-radius: var(--radius-btn);
  padding: 15px 32px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

.btn-ghost:hover {
  background: rgba(253, 246, 240, 0.95);
  transform: translateY(-2px);
}

/* INTRO */
.section-intro {
  padding: 100px 80px;
  background: linear-gradient(180deg, #f5e8d8 0%, #fdf6f0 100%);
  text-align: center;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--terracotta);
  font-weight: 600;
  margin-bottom: 16px;
}

.section-intro h2 {
  font-family: 'Baloo 2', cursive;
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 20px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-intro p {
  font-size: 17px;
  line-height: 1.7;
  color: rgba(45, 31, 20, 0.7);
  max-width: 560px;
  margin: 0 auto 56px;
}

.section-intro .eyebrow {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--terracotta);
    font-weight: 600;
    margin-bottom: 16px;
}

.pain-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  max-width: 960px;
  margin: 0 auto 40px;
}

.pain-card {
  background: white;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 16px rgba(193, 113, 79, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.pain-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(193, 113, 79, 0.15);
}

.pain-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(193, 113, 79, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.pain-card span {
  font-size: 15px;
  font-weight: 500;
  color: var(--brown-text);
}

.not-alone {
  font-size: 16px;
  font-weight: 600;
  color: var(--brown-dark);
  margin-top: 32px;
}

.scroll-hint {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--terracotta);
  margin-top: 18px;
  cursor: pointer;
  border: 1.5px solid rgba(193, 113, 79, 0.35);
  border-radius: 50px;
  padding: 10px 20px;
  transition: all 0.2s;
  background: transparent;
  position: relative;
  top: -40px;
}

.scroll-hint:hover {
  background: rgba(193, 113, 79, 0.08);
}

/* FLOW */
.section-flow {
  padding: 100px 80px;
  background: var(--sand-100);
}

.section-flow .eyebrow {
  text-align: center;
}

.section-flow h2 {
  font-family: 'Baloo 2', cursive;
  font-size: clamp(26px, 3vw, 38px);
  text-align: center;
  color: var(--brown-dark);
  margin-bottom: 60px;
  font-weight: 700;
}

.flow-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto 60px;
}

.flow-step {
  background: white;
  border-radius: 18px;
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

.flow-step::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: var(--terracotta-light);
}

.flow-num {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(193, 113, 79, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Baloo 2', cursive;
  font-size: 18px;
  font-weight: 700;
  color: var(--terracotta);
  margin-bottom: 16px;
}

.flow-step h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 10px;
}

.flow-step p {
  font-size: 13.5px;
  line-height: 1.6;
  color: rgba(45, 31, 20, 0.6);
}

.flow-back-note {
  text-align: center;
  font-size: 13.5px;
  color: rgba(193, 113, 79, 0.75);
  font-style: italic;
  margin-top: 28px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* PRIVACY */
.section-privacy {
  padding: 60px 80px;
  background: linear-gradient(180deg, var(--sand-100) 0%, #f5e8d8 100%);
}

.privacy-card {
  max-width: 960px;
  margin: 0 auto;
  background: white;
  border-radius: 28px;
  padding: 56px 64px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  box-shadow: var(--shadow-card);
}

.privacy-eyebrow {
  text-align: left;
  margin-bottom: 14px;
}

.privacy-headline {
  font-family: 'Baloo 2', cursive;
  font-size: clamp(22px, 2.5vw, 32px);
  font-weight: 700;
  color: var(--brown-dark);
  line-height: 1.25;
  margin-bottom: 16px;
}

.privacy-desc {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(45, 31, 20, 0.6);
  margin-bottom: 24px;
}

.privacy-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.privacy-tag {
  padding: 8px 16px;
  border-radius: 50px;
  border: 1.5px solid rgba(45, 31, 20, 0.15);
  font-size: 13px;
  font-weight: 500;
  color: var(--brown-text);
  background: var(--sand-100);
}

.privacy-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.privacy-img-placeholder {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 20px;
  background: linear-gradient(135deg, #e8cdb0 0%, #f5dfc8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
}

/* CTA */
.section-cta {
  padding: 100px 80px;
  text-align: center;
  background: linear-gradient(135deg, #e8cdb0 0%, #d4956e 50%, #c1714f 100%);
  position: relative;
  overflow: hidden;
}

.section-cta h2 {
  font-family: 'Baloo 2', cursive;
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 16px;
}

.section-cta p {
  font-size: 17px;
  color: rgba(45, 31, 20, 0.7);
  margin-bottom: 40px;
}

.btn-cta-big {
  background: var(--brown-dark);
  color: var(--sand-100);
  border: none;
  border-radius: var(--radius-btn);
  padding: 20px 56px;
  font-size: 18px;
  font-weight: 700;
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
  .section-privacy,
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
}

@media (max-width: 640px) {
  .flow-steps {
    grid-template-columns: 1fr;
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