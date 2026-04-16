<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Emotional Support</h1>
      <p class="page-subtitle">A judgment-free space to check in with how you're feeling and take care of your mental well-being, anytime you need it.</p>
    </div>

    <section class="coming-soon-card">
      <p class="coming-soon-kicker">Coming soon</p>
      <h2 class="coming-soon-title">A calmer support space is on the way.</h2>
      <p class="coming-soon-text">
        This page will become a gentle place to pause, reflect, and feel supported when work or life starts to feel
        too heavy. We are still building it - see you here soon.
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
</style>
