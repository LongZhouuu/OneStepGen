<template>
  <div class="home-page">
    <section class="hero-wrapper">
      <HeroSection />
    </section>

    <!-- Explore Our Core Tools Section -->
    <section class="core-tools-section">
      <div class="core-tools-container">
        <h2 class="section-title">Explore Our Core Tools</h2>

        <div class="core-tools-content">
          <div class="tools-illustration">
            <img src="/tools-illustration.png" alt="Core Tools Illustration" />
          </div>

          <div class="tools-list">
            <RouterLink to="/tools/planner" class="tool-item tool-item-link">
              <h3 class="tool-name">Planner</h3>
              <p class="tool-description">
                Map out your day with calm and intention, no pressure, just one gentle step at a time.
              </p>
              <div class="tool-divider"></div>
            </RouterLink>

            <RouterLink to="/tools/prioritizer" class="tool-item tool-item-link">
              <h3 class="tool-name">Prioritizer</h3>
              <p class="tool-description">
                Cut through the overwhelm and spot what truly needs your attention right now, so you can move forward
                with clarity.
              </p>
              <div class="tool-divider"></div>
            </RouterLink>

            <RouterLink to="/tools/support" class="tool-item tool-item-link">
              <h3 class="tool-name">Support</h3>
              <p class="tool-description">
                A judgment-free space to check in with how you're feeling and take care of your mental well-being,
                anytime you need it.
              </p>
              <div class="tool-divider"></div>
            </RouterLink>

            <RouterLink to="/tools/tips" class="tool-item tool-item-link">
              <h3 class="tool-name">Tips & Template</h3>
              <p class="tool-description">
                Ready-to-use templates and daily tips to help you stay on track and keep moving, even on the harder
                days.
              </p>
              <div class="tool-divider"></div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Privacy & Security Section -->
    <section class="security-section">
      <div class="security-container">
        <div class="security-image">
          <img src="/security-bg.png" alt="Privacy and Security" />
          <div class="security-overlay">
            <p class="security-text">
              We don't store any of your information. Everything stays on your device, private and secure.
            </p>
          </div>
        </div>
      </div>

    </section>
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
.home-page {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.hero-wrapper,
.core-tools-section,
.security-section {
  min-height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

.hero-wrapper {
  position: relative;
}

/* Core Tools Section */
.core-tools-section {
  padding: 80px 24px 80px;
  max-width: 1200px;
  height: 100vh;
  margin: 0 auto;
}

.section-title {
  font-size: 3rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
}

.core-tools-content {
  display: flex;
  gap: 60px;
  align-items: flex-start;
}

.tools-illustration {
  flex: 1;
  max-width: 800px;
}

.tools-illustration img {
  width: 130%;
  height: auto;
  object-fit: contain;
  transform: translateX(-15%);
}

.tools-list {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.tool-item::before {
  content: '';
  position: absolute;
  top: -40px;
  left: -24px;
  right: -24px;
  bottom: -20px;
  border-radius: 12px;
  background: radial-gradient(ellipse at 50% 50%,
      rgba(233, 146, 54, 0.6) 0%,
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
  font-size: 2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.tool-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
}

.tool-divider {
  height: 1px;
  background: linear-gradient(to right, #ccc, transparent);
}

/* Security Section */
.security-section {
  padding: 140px 24px 180px;
  max-width: 100vh;
  margin: 0 auto;
}

.security-container {
  width: 100%;
}

.security-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.security-image img {
  width: 100%;
  height: auto;
  display: block;
  min-height: 300px;
  object-fit: cover;
}

.security-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 80px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0));
}

.security-text {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  line-height: 1.5;
  max-width: 500px;
}

/* Responsive */
@media (max-width: 768px) {
  .core-tools-content {
    flex-direction: column;
  }

  .tools-illustration {
    max-width: 100%;
    order: -1;
  }

  .section-title {
    font-size: 2rem;
  }

  .security-text {
    font-size: 1.2rem;
  }
}
</style>