<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Reward</h1>
      <p class="page-subtitle">Celebrate your progress and stay motivated with meaningful rewards for your achievements.</p>
    </div>

    <section class="map-card">
      <RewardMap />
    </section>
  </div>
</template>

<script setup>
import RewardMap from '@/components/RewardMap.vue'
</script>

<style scoped>
.page-container {
  max-width: 1200px;
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

.map-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(248, 241, 234, 0.94) 0%, rgba(255, 250, 246, 0.98) 100%);
  box-shadow: 0 16px 36px rgba(97, 75, 52, 0.08);
  overflow: hidden; /* ensure inner map corners clip nicely */
}

.map-card :deep(.map-wrapper) {
  max-width: 100%;
  padding: 20px;
  box-shadow: none;
  background: rgba(253, 245, 230, 0.9);
}

@media (max-width: 768px) {
  .page-container { padding: 72px 20px 96px; }
  .page-header { margin-bottom: 34px; }
  .page-title { font-size: 2.4rem; }
  .page-subtitle { font-size: 1.1rem; }
  .map-card { border-radius: 22px; }
}
</style>
