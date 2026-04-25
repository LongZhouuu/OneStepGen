<template>
  <section class="hero-section">
    <div class="hero-content">
      <p class="hero-eyebrow">Designed for ADHD minds</p>
      <h1 class="hero-title">
        <span class="title-bold">One step</span> at a time
      </h1>
      <p class="hero-subtitle">
        A simple tool designed for people with ADHD to break down tasks,<br /> reduce overwhelm, and get started.
      </p>

      <div class="hero-cta">
        <button class="btn-primary" @click="scrollToTarget">
          See How It Works ↓
        </button>

        <button class="btn-ghost" @click="enterWorkspace">
          Quick Start →
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { startWorkflow } from '@/router/workflow'

const props = defineProps({
  scrollTarget: {
    type: String,
    default: 'intro-section',
  },
})

const router = useRouter()

function scrollToTarget() {
  const el = document.getElementById(props.scrollTarget)
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
.hero-section {
  min-height: 100svh;
  background-image: url('/hero-bg.JPG');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 8%;
  position: relative;
}

.hero-content {
  color: #333;
  max-width: 1200px;
}

.hero-eyebrow {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #e2dedb;
  margin: 0 0 1.25rem;
}

.hero-title {
  font-size: clamp(2.8rem, 9vw, 6rem);
  font-weight: 400;
  margin-bottom: 3rem;
  line-height: 1.2;
}

.title-bold {
  font-weight: 700;
}

.hero-subtitle {
  font-size: clamp(1.05rem, 2.7vw, 1.7rem);
  line-height: 1.7;
  color: #333;
  font-weight: 400;
  margin-bottom: 48px;
  max-width: none;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-ghost {
  font-size: 20px;
  cursor: pointer;
  border-radius: 999px;
  transition: all 0.25s ease;
}

.btn-primary {
  background: #333;
  color: #fffaf6;
  border: none;
  padding: 16px 36px;
  font-weight: 600;
}

.btn-primary:hover {
  background: #4d3c2d;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(45, 31, 20, 0.25);
}

.btn-ghost {
  background: rgba(255, 250, 245, 0.78);
  color: #333;
  border: 1.5px solid rgba(180, 106, 45, 0.18);
  padding: 15px 32px;
  font-weight: 500;
}

.btn-ghost:hover {
  background: rgba(255, 250, 245, 0.94);
  transform: translateY(-2px);
}

@media (max-height: 720px) {
  .hero-section {
    min-height: 0;
    height: auto;
    padding: clamp(48px, 8vh, 80px) 8%;
    justify-content: flex-start;
  }

  .hero-title {
    margin-bottom: clamp(0.8rem, 2vh, 1.4rem);
    line-height: 1.1;
  }

  .hero-subtitle {
    margin-bottom: clamp(16px, 3vh, 28px);
    line-height: 1.5;
  }

  .hero-eyebrow {
    margin-bottom: clamp(0.5rem, 1.2vh, 1rem);
  }
}

@media (max-height: 520px) {
  .hero-title {
    font-size: clamp(2rem, 6vh, 3rem);
  }

  .hero-subtitle {
    font-size: clamp(0.95rem, 2.4vh, 1.15rem);
  }

  .hero-subtitle br {
    display: none;
  }

  .btn-primary,
  .btn-ghost {
    padding: 10px 22px;
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: calc(100svh - 68px);
    padding: 20px 20px 28px;
    justify-content: space-between;
  }

  .hero-content {
    margin-top: 20px;
  }

  .hero-eyebrow {
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    margin-bottom: 0.8rem;
  }

  .hero-title {
    margin-bottom: 1.2rem;
    line-height: 1.12;
  }

  .hero-subtitle br {
    display: none;
  }

  .hero-cta {
    width: 100%;
    margin-top: 20px;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }

  .btn-primary,
  .btn-ghost {
    width: 100%;
  }
}
</style>
