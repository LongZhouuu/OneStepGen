<template>
  <div class="reward-page">
    <div class="reward-main">
    <!-- HEADER -->
    <section class="page-header">
      <p class="eyebrow">Your Collection</p>
      <h1 class="page-title">
        <span>Reward</span>
        <span class="accent">Atlas</span>
      </h1>
      <p class="page-subtitle">
        Celebrate your progress and stay motivated. Every focus session unlocks
        an Australian animal pinned on your collection map.
      </p>
    </section>

    <!-- PROGRESS STATS -->
    <section class="stats-section">
      <div class="stats-card">
        <div class="stat-block">
          <p class="stat-label">Animals discovered</p>
          <p class="stat-value">
            {{ uniqueUnlockedCount }}
            <span class="stat-divider">/</span>
            <span class="stat-total">{{ totalAnimals }}</span>
          </p>
          <p class="stat-meta">{{ remainingToUnlock }} still hiding in the wild</p>
        </div>

        <div class="stat-block">
          <p class="stat-label">Sessions completed</p>
          <p class="stat-value">{{ totalRewardsEarned }}</p>
          <p class="stat-meta">Every reward is one finished session</p>
        </div>

        <div class="stat-block">
          <p class="stat-label">Regions explored</p>
          <p class="stat-value">
            {{ uniqueRegionsCount }}
            <span class="stat-divider">/</span>
            <span class="stat-total">{{ totalRegions }}</span>
          </p>
          <p class="stat-meta">Across the Australian continent</p>
        </div>

        <div class="progress-block">
          <div class="progress-meta">
            <span class="progress-label">Collection progress</span>
            <span class="progress-percent">{{ progressPercent }}%</span>
          </div>
          <div class="progress-track" role="progressbar"
            :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-section">
      <div class="how-intro">
        <p class="eyebrow">How rewards work</p>
        <h2 class="how-title">Tiny wins, real momentum.</h2>
        <p class="how-lead">
          Each session you complete reveals one more animal on the map. The
          more you finish, the richer your collection grows.
        </p>
      </div>

      <div class="how-cards">
        <div class="how-card">
          <div class="how-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="6.25" stroke="currentColor" stroke-width="1.8" />
              <path d="m15.75 15.75 3.5 3.5" stroke="currentColor"
                stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
          <h3>Discover</h3>
          <p>Tap any pin on the map to read a clue or learn fun facts about each animal.</p>
        </div>

        <div class="how-card">
          <div class="how-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="5.75" y="10.75" width="12.5" height="8.5" rx="2"
                stroke="currentColor" stroke-width="1.8" />
              <path d="M8.5 10.75V8a3.5 3.5 0 1 1 7 0v.5"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </div>
          <h3>Unlock</h3>
          <p>Finish a focus session to earn a reward animal and reveal its full profile.</p>
        </div>

        <div class="how-card">
          <div class="how-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 3.5c-3 4-4.5 6.5-4.5 9a4.5 4.5 0 1 0 9 0c0-2.5-1.5-5-4.5-9Z"
                stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
            </svg>
          </div>
          <h3>Explore</h3>
          <p>Travel across regions — from Tasmania to the Northern Territory — one session at a time.</p>
        </div>
      </div>
    </section>

    <!-- MAP (unchanged) -->
    <section class="map-card">
      <RewardMap :key="mapRefreshKey" />
    </section>
    </div>

    <!-- CTA (full-width, matches HomeView) -->
    <section class="section-cta">
      <div class="section-cta-card">
        <h2>Ready to unlock another friend?</h2>
        <p>Start a new session — one small step, one new animal.</p>
        <button class="btn-cta-big" @click="enterWorkspace">
          Enter Workspace →
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onActivated, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import RewardMap from '@/components/RewardMap.vue'
import { ANIMALS } from '@/data/animals.js'
import {
  getRewards,
  startWorkflow,
  REWARDS_UPDATED_EVENT,
} from '@/router/workflow.js'

const router = useRouter()

const rewards = ref(getRewards())
const mapRefreshKey = ref(0)

const totalAnimals = ANIMALS.length

function syncRewardsFromStorage() {
  rewards.value = getRewards()
  mapRefreshKey.value += 1
}

const uniqueUnlockedCount = computed(() => {
  const unlockedNames = new Set(rewards.value.map(r => r.name))
  return ANIMALS.filter(a => unlockedNames.has(a.name)).length
})

const totalRewardsEarned = computed(() => rewards.value.length)

const remainingToUnlock = computed(() => Math.max(totalAnimals - uniqueUnlockedCount.value, 0))

const totalRegions = computed(() => {
  return new Set(ANIMALS.map(a => a.region)).size
})

const uniqueRegionsCount = computed(() => {
  const unlockedNames = new Set(rewards.value.map(r => r.name))
  const regions = new Set(
    ANIMALS.filter(a => unlockedNames.has(a.name)).map(a => a.region),
  )
  return regions.size
})

const progressPercent = computed(() => {
  if (totalAnimals === 0) return 0
  return Math.round((uniqueUnlockedCount.value / totalAnimals) * 100)
})

onMounted(() => {
  syncRewardsFromStorage()
  window.addEventListener(REWARDS_UPDATED_EVENT, syncRewardsFromStorage)
})

onActivated(syncRewardsFromStorage)

onUnmounted(() => {
  window.removeEventListener(REWARDS_UPDATED_EVENT, syncRewardsFromStorage)
})

function enterWorkspace() {
  startWorkflow()
  router.push({ name: 'AIDump' })
}
</script>

<style scoped>
.reward-page {
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
  --shadow-card: 0 16px 36px rgba(97, 75, 52, 0.08);
  --radius-btn: 50px;

  min-height: 100vh;
  color: var(--brown-text);
  background: transparent;
}

.reward-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px 0;
}

/* HEADER */
.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.eyebrow {
  font-size: 15px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--terracotta);
  font-weight: 600;
  margin: 0 0 14px;
}

.page-title {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 14px;
  flex-wrap: wrap;
  font-size: clamp(2.2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--brown-dark);
  margin: 0 0 18px;
  line-height: 1.1;
}

.page-title .accent {
  color: var(--terracotta);
}

.page-subtitle {
  font-size: 1.15rem;
  color: #666;
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.65;
}

/* STATS */
.stats-section {
  margin: 0 auto 48px;
  max-width: 1120px;
}

.stats-card {
  background: var(--card-warm);
  border: 1px solid rgba(180, 106, 45, 0.1);
  border-radius: 24px;
  padding: 28px 32px;
  box-shadow: var(--shadow-card);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px 36px;
  align-items: start;
}

.stat-block {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  padding-right: 24px;
}

.stat-block:not(:last-of-type)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 8%;
  bottom: 8%;
  width: 1px;
  background: rgba(180, 106, 45, 0.18);
}

.stat-label {
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--terracotta);
  font-weight: 600;
  margin: 0;
}

.stat-value {
  font-size: clamp(2rem, 3.4vw, 2.6rem);
  font-weight: 700;
  color: var(--brown-dark);
  margin: 0;
  line-height: 1.05;
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.stat-divider {
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(106, 82, 56, 0.55);
}

.stat-total {
  font-size: 1.3rem;
  font-weight: 600;
  color: rgba(106, 82, 56, 0.7);
}

.stat-meta {
  font-size: 13.5px;
  color: var(--brown-mid);
  margin: 4px 0 0;
  line-height: 1.4;
}

.progress-block {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 18px;
  border-top: 1px dashed rgba(180, 106, 45, 0.22);
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 14px;
}

.progress-label {
  font-weight: 600;
  color: var(--brown-mid);
  letter-spacing: 0.04em;
}

.progress-percent {
  font-weight: 700;
  color: var(--terracotta);
  font-size: 16px;
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(180, 106, 45, 0.12);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--terracotta-light), var(--terracotta));
  border-radius: 999px;
  transition: width 0.6s ease;
}

/* MAP (unchanged visually) */
.map-card {
  max-width: 1200px;
  margin: 0 auto clamp(48px, 7vh, 60px);
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(248, 241, 234, 0.94) 0%, rgba(255, 250, 246, 0.98) 100%);
  box-shadow: 0 16px 36px rgba(97, 75, 52, 0.08);
  overflow: hidden;
}

.map-card :deep(.map-wrapper) {
  max-width: 100%;
  padding: 20px;
  box-shadow: none;
  background: rgba(253, 245, 230, 0.9);
}

/* HOW IT WORKS */
.how-section {
  max-width: 1120px;
  margin: 0 auto 48px;
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) 1.6fr;
  gap: clamp(32px, 5vw, 64px);
  align-items: start;
}

.how-intro .eyebrow {
  text-align: left;
}

.how-title {
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  font-weight: 700;
  color: var(--brown-dark);
  margin: 0 0 14px;
  line-height: 1.15;
}

.how-lead {
  font-size: 16.5px;
  line-height: 1.7;
  color: var(--brown-text);
  margin: 0;
  max-width: 320px;
}

.how-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.how-card {
  background: var(--card-warm);
  border: 1px solid rgba(180, 106, 45, 0.08);
  border-radius: 18px;
  padding: 22px 20px 20px;
  box-shadow: 0 10px 24px rgba(97, 75, 52, 0.05);
  transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.how-card:hover {
  transform: translateY(-3px);
  border-color: rgba(180, 106, 45, 0.22);
  box-shadow: 0 16px 30px rgba(97, 75, 52, 0.1);
}

.how-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(180, 106, 45, 0.14);
  box-shadow: 0 6px 16px rgba(97, 75, 52, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--terracotta);
}

.how-icon svg {
  width: 22px;
  height: 22px;
}

.how-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--brown-dark);
  margin: 4px 0 0;
}

.how-card p {
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--brown-mid);
  margin: 0;
}

/* CTA (aligned with HomeView) */
.section-cta {
  padding: clamp(48px, 7vh, 60px) clamp(20px, 6vw, 80px) clamp(60px, 10vh, 100px);
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
@media (max-width: 960px) {
  .stats-card {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-block:nth-of-type(2)::after {
    display: none;
  }

  .stat-block:nth-of-type(3) {
    grid-column: 1 / -1;
    padding-right: 0;
  }

  .stat-block:nth-of-type(3)::after {
    display: none;
  }

  .how-section {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .how-intro .eyebrow {
    text-align: center;
  }

  .how-lead {
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .reward-main {
    padding: 72px 20px 0;
  }

  .section-cta {
    padding-left: 24px;
    padding-right: 24px;
    padding-top: 70px;
    padding-bottom: 70px;
  }

  .section-cta-card {
    padding: 0;
  }

  .page-header {
    margin-bottom: 30px;
  }

  .stats-card {
    grid-template-columns: 1fr;
    padding: 24px 22px;
    gap: 22px;
  }

  .stat-block {
    padding-right: 0;
  }

  .stat-block::after {
    display: none !important;
  }

  .map-card {
    border-radius: 22px;
  }

  .how-section {
    margin-bottom: 36px;
    gap: 24px;
  }

  .how-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .section-cta p {
    font-size: 16px;
  }

  .btn-cta-big {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    gap: 8px;
  }
}
</style>
