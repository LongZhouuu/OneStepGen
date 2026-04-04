<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">
        <span class="title-bold">One step</span> at a time
      </h1>
      <p class="hero-subtitle">
        A simple tool designed for focus, for a calmer<br />
        and more organized day.
      </p>
    </div>
    <div class="hero-cta">
      <RouterLink to="/tools/planner" class="cta-button">
        Start Your First Task <span class="cta-arrow">›</span>
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

.hero-title {
  font-size: 6.5rem;
  font-weight: 400;
  margin-bottom: 3rem;
  line-height: 1.2;
}

.title-bold {
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.6rem;
  line-height: 1.6;
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
  font-size: 2rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.cta-button:hover {
  color: #000;
  background-color: rgba(255, 255, 255, 0.3);
}

.cta-arrow {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .cta-arrow {
  transform: translateX(4px);
}
</style>
