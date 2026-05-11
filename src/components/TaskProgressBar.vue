<template>
  <section class="progressCard">
    <div class="progressHeader">
      <div>
        <h3>Task Progress</h3>
        <p>
          {{ completedCount }} of {{ totalCount }} tasks completed
          <span v-if="skippedCount > 0">
            · {{ skippedCount }} skipped
          </span>
        </p>
      </div>

      <strong>{{ progressPercent }}%</strong>
    </div>

    <div class="progressTrack">
      <div
        class="progressFill"
        :style="{ width: progressPercent + '%' }"
      ></div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})

const totalCount = computed(() => props.tasks.length)

const completedCount = computed(() => {
  return props.tasks.filter(task => task.status === 'completed').length
})

const skippedCount = computed(() => {
  return props.tasks.filter(task => task.status === 'skipped').length
})

const progressPercent = computed(() => {
  if (totalCount.value === 0) return 0

  return Math.round((completedCount.value / (totalCount.value - skippedCount.value)) * 100)
})
</script>

<style scoped>
.progressCard {
  grid-column: 1 / -1;
  width: 103.2%;
  margin-bottom: 2vh;
  /* max-width: 954px; */
  background: rgba(255, 255, 255, 0.78);
  border: 1.5px solid rgba(193, 113, 79, 0.14);
  border-radius: 22px;
  position: relative;
  left: -1.6%;
  padding: 1.6vh 1.6vw;
  box-shadow: 0 12px 28px rgba(65, 39, 24, 0.08);
}

.progressHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.progressHeader h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #2f2f2f;
}

.progressHeader p {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #8b7a6a;
}

.progressHeader strong {
  font-size: 22px;
  font-weight: 900;
  color: #c1714f;
}

.progressTrack {
  width: 100%;
  height: 12px;
  background: #f0e4d7;
  border-radius: 999px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, #9bcfbd, #c1714f);
  border-radius: 999px;
  transition: width 0.35s ease;
}
</style>