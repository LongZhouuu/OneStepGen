<template>
  <div class="page-container terms-page">
    <RouterLink :to="{ name: 'Home' }" class="back-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
      Back to Home
    </RouterLink>

    <div class="page-header">
      <!-- <p class="eyebrow">Guidelines & Usage</p> -->
      <h1 class="page-title">Terms of Use</h1>
      <p class="lead">
        These terms explain how OneStepGen should be used and the boundaries of the platform.
      </p>
      <p class="updated">Last updated: April 2026</p>
    </div>

    <section class="content-grid">
      <aside class="toc">
        <h2>Contents</h2>
        <a href="#acceptance">Acceptance</a>
        <a href="#purpose">Platform Purpose</a>
        <a href="#responsibility">User Responsibility</a>
        <a href="#support">Support Disclaimer</a>
        <a href="#availability">Availability</a>
        <a href="#changes">Changes</a>
        <a href="#contact">Contact</a>
      </aside>

      <div class="content">
        <section id="acceptance" class="card">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using OneStepGen, you agree to these Terms of Use.
            If you do not agree, please discontinue use of the platform.
          </p>
        </section>

        <section id="purpose" class="card">
          <h3>2. Platform Purpose</h3>
          <p>
            OneStepGen is a productivity support platform designed to help users manage tasks,
            reduce overwhelm, and build momentum through structured tools.
          </p>
          <div class="badges">
            <span>AI supported Planner Tools</span>
            <span>Tips & Templates</span>
            <span>Support Resources</span>
            <span>Rewards System</span>
          </div>
        </section>

        <section id="responsibility" class="card">
          <h3>3. User Responsibility</h3>
          <ul>
            <li>Use the platform in a lawful and respectful manner</li>
            <li>Review generated templates before sending or using them</li>
            <li>Protect your own device and browser access</li>
            <li>Avoid submitting highly sensitive information</li>
          </ul>
        </section>

        <section id="support" class="card highlight">
          <h3>4. Support Disclaimer</h3>
          <p>
            Emotional support tools such as breathing or grounding exercises are intended for wellbeing support only.
            OneStepGen is not a medical, counselling, psychological, or emergency service.
          </p>
        </section>

        <section id="availability" class="card">
          <h3>5. Service Availability</h3>
          <p>
            We aim to keep the platform available and functional, but uninterrupted access cannot be guaranteed.
            Features may be updated, modified, or removed during development.
          </p>
        </section>

        <section id="changes" class="card">
          <h3>6. Changes to Terms</h3>
          <p>
            These terms may be updated from time to time. Continued use of the platform means you accept revised terms.
          </p>
        </section>

        <section id="contact" class="card">
          <h3>7. Contact</h3>
          <p>If you have questions regarding these terms, please contact the project team.</p>
          <p class="email">support@onestepgen.demo</p>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 24px 120px;
  color: #2d1f14;
  background: transparent;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px 8px 10px;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(180, 106, 45, 0.16);
  border-radius: 999px;
  color: #6a5238;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.92);
  color: #b46a2d;
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(97, 75, 52, 0.08);
}

.back-btn svg {
  flex-shrink: 0;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 600;
  color: #333;
  margin: 8px 0 16px;
}

/* .eyebrow {
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #b46a2d;
  font-weight: 700;
  margin: 0;
} */

.lead {
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.7;
  color: #5d4a3b;
}

.updated {
  color: #7a6656;
  font-size: 14px;
  margin-top: 12px;
}

.content-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 28px;
  align-items: start;
}

.toc {
  position: sticky;
  top: 80px;
  align-self: start;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(180, 106, 45, 0.12);
  border-radius: 20px;
  padding: 22px;
  backdrop-filter: blur(8px);
}

.toc h2 {
  font-size: 18px;
  margin: 0 0 14px;
  color: #333;
}

.toc a {
  display: block;
  text-decoration: none;
  color: #5d4a3b;
  padding: 8px 0;
  transition: color 0.2s ease;
}

.toc a:hover {
  color: #b46a2d;
}

.content {
  display: grid;
  gap: 18px;
}

.card {
  background: #ffffff;
  border: 1px solid rgba(180, 106, 45, 0.12);
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(45, 31, 20, 0.06);
  scroll-margin-top: 80px;
}

.card h3 {
  margin-top: 0;
  font-weight: 600;
  color: #333;
}

.card p,
.card li {
  line-height: 1.7;
  color: #4c3c30;
}

.card ul {
  padding-left: 20px;
}

.badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.badges span {
  background: #f6e7d8;
  color: #8a5428;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.highlight {
  background: linear-gradient(135deg, #fff7ef, #f7ede4);
}

.email {
  font-weight: 700;
  color: #b46a2d;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .toc {
    position: static;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 72px 20px 96px;
  }
  .page-title {
    font-size: 2.4rem;
  }
}

@media (max-width: 640px) {
  .card {
    padding: 22px;
    border-radius: 12px;
  }
}
</style>