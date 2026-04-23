<template>
    <div class="workflow-page">
        <div class="panel">
            <p class="eyebrow">Step 2 of 4</p>
            <h1>Plan your tasks</h1>
            <p class="desc">
                This can temporarily reuse your prototype style. Later you can replace it with real AI output.
            </p>

            <div class="mock-columns">
                <div class="mock-box">
                    <h3>Do first</h3>
                    <p>Urgent + important tasks</p>
                </div>
                <div class="mock-box">
                    <h3>Schedule</h3>
                    <p>Important but not urgent</p>
                </div>
                <div class="mock-box">
                    <h3>Delegate</h3>
                    <p>Urgent but less important</p>
                </div>
                <div class="mock-box">
                    <h3>Maybe later</h3>
                    <p>Can wait for now</p>
                </div>
            </div>

            <div class="actions">
                <button class="ghost-btn" @click="goBack">← Back</button>
                <button class="primary-btn" @click="continueToPlanner">Continue →</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  guardWorkflowStep,
  unlockStep,
} from '../router/workflow'

const router = useRouter()

onMounted(() => {
  guardWorkflowStep(2, router)
})

function goBack() {
  router.push({ name: 'AIDump' })
}

function continueToPlanner() {
  unlockStep(3)
  router.push({ name: 'Planner' })
}
</script>

<style scoped>
.workflow-page {
    max-width: 960px;
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
}

.desc {
    color: #666;
    line-height: 1.7;
    margin-bottom: 24px;
}

.mock-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

.mock-box {
    background: #fff;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 8px 24px rgba(97, 75, 52, 0.06);
}

.actions {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

.primary-btn,
.ghost-btn {
    border-radius: 999px;
    padding: 14px 24px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
}

.primary-btn {
    border: none;
    background: #2d1f14;
    color: white;
}

.ghost-btn {
    border: 1px solid rgba(45, 31, 20, 0.2);
    background: transparent;
}
</style>