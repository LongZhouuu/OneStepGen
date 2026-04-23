<template>
  <div class="workflow-page">
    <div class="panel">
      <p class="eyebrow">Step 1 of 4</p>
      <h1>Dump your ideas</h1>
      <p class="desc">
        Write everything on your mind. No filtering — just get it all out.
      </p>

      <textarea
        v-model="brainDump"
        class="dump-input"
        placeholder="e.g. finish report, call dentist, buy groceries..."
      />

      <div class="actions">
        <button class="primary-btn" @click="continueToPlan">
          Create Tasks with AI →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  guardWorkflowStep,
  unlockStep,
} from '../router/workflow'

const router = useRouter()

onMounted(() => {
  guardWorkflowStep(1, router)
})

function continueToPlan() {
  unlockStep(2)
  router.push({ name: 'Planner' })
}
</script>

<style scoped>
.workflow-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 90px 24px 40px;
}

.panel {
  background: rgba(255, 250, 246, 0.95);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 0 16px 36px rgba(97, 75, 52, 0.08);
}

.eyebrow {
  color: #b46a2d;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  font-size: 0.85rem;
}

h1 {
  margin: 8px 0 12px;
  font-size: 2.4rem;
  color: #2d2d2d;
}

.desc {
  color: #666;
  line-height: 1.7;
  margin-bottom: 20px;
}

.dump-input {
  width: 100%;
  min-height: 220px;
  border: 2px dashed rgba(180, 106, 45, 0.28);
  border-radius: 18px;
  padding: 18px;
  font: inherit;
  resize: vertical;
  background: #fffdfb;
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.primary-btn {
  border: none;
  border-radius: 999px;
  padding: 14px 24px;
  background: #2d1f14;
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}
</style>