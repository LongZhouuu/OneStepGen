<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Prioritizer</h1>
      <p class="page-subtitle">Cut through the overwhelm and spot what truly needs your attention right now, so you can move forward with clarity.</p>
    </div>

    <section class="coming-soon-card">
      <p class="coming-soon-kicker">Coming soon</p>
      <h2 class="coming-soon-title">We're still shaping this tool.</h2>
      <p class="coming-soon-text">
        Prioritizer will help you sort through competing tasks, highlight what matters most, and make it easier to
        choose where to begin. It is on the way - check back soon.
      </p>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 24px 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  font-size: 3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 1.3rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.coming-soon-card {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px 36px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(248, 241, 234, 0.94) 0%, rgba(255, 250, 246, 0.98) 100%);
  box-shadow: 0 16px 36px rgba(97, 75, 52, 0.08);
  text-align: center;
}

.coming-soon-kicker {
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b46a2d;
  margin: 0 0 10px;
}

.coming-soon-title {
  font-size: 1.9rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 14px;
}

.coming-soon-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #666;
  margin: 0;
}
@media (max-width: 768px) {
  .page-container { padding: 72px 20px 96px; }
  .page-header { margin-bottom: 34px; }
  .page-title { font-size: 2.4rem; }
  .page-subtitle { font-size: 1.1rem; }
  .coming-soon-card { padding: 24px 18px; border-radius: 22px; }
  .coming-soon-title { font-size: 1.55rem; }
}
</style>
