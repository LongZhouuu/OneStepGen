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
    </div>
    <div class="hero-cta">
      <RouterLink to="/tools/planner" class="cta-button">
        Start Your First Step <span class="cta-arrow">&gt;</span>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
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
  font-size: 6rem;
  font-weight: 400;
  margin-bottom: 3rem;
  line-height: 1.2;
}

.title-bold {
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.7rem;
  line-height: 2;
  color: #333;
  font-weight: 400;
}

.hero-cta {
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 1.7rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.75rem 1.4rem;
  border: 2px solid rgba(76, 74, 74, 0);
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.cta-button:hover {
  color: #b46a2d;
  border-color: #33333300;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.cta-arrow {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .cta-arrow {
  transform: translateX(4px);
}
</style>
