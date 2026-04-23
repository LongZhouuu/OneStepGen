<template>
  <nav v-if="currentStep" class="bottomNav" aria-label="Workflow steps">
    <template v-for="(step, index) in steps" :key="step.id">
      <button
        class="stepItem"
        :class="getStepClass(step)"
        :disabled="isStepLocked(step)"
        @click="goToStep(step)"
      >
        <span class="index">{{ step.id }}</span>
        <span class="label">{{ step.label }}</span>
        <span class="sublabel">{{ step.sublabel }}</span>
      </button>

      <div
        v-if="index < steps.length - 1"
        class="connector"
        :class="{ done: isConnectorDone(step.id) }"
        aria-hidden="true"
      />
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  WORKFLOW_STEPS,
  workflowState,
  getStepByRouteName,
} from '../router/workflow'

const route = useRoute()
const router = useRouter()

const STEP_META = {
  1: { label: 'Dump', sublabel: 'Write ideas' },
  2: { label: 'Plan', sublabel: 'Organise' },
  3: { label: 'Focus', sublabel: 'Swipe & do' },
  4: { label: 'Complete', sublabel: 'Done' },
}

const steps = WORKFLOW_STEPS.map((step) => ({
  ...step,
  label: STEP_META[step.id]?.label ?? step.label ?? `Step ${step.id}`,
  sublabel: STEP_META[step.id]?.sublabel ?? '',
}))

const currentStep = computed(() => getStepByRouteName(route.name))
const maxReachedStep = computed(() => workflowState.value)

function isStepLocked(step) {
  return step.id > maxReachedStep.value
}

function isStepDone(step) {
  return step.id < currentStep.value?.id
}

function isStepActive(step) {
  return step.id === currentStep.value?.id
}

function isStepAvailable(step) {
  return !isStepActive(step) && !isStepDone(step) && !isStepLocked(step)
}

function getStepClass(step) {
  return {
    active: isStepActive(step),
    done: isStepDone(step),
    available: isStepAvailable(step),
    locked: isStepLocked(step),
  }
}

function isConnectorDone(stepId) {
  return stepId < currentStep.value?.id
}

function goToStep(step) {
  if (isStepLocked(step)) return
  if (step.routeName === route.name) return
  router.push({ name: step.routeName })
}
</script>

<style scoped>
.bottomNav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 8px 12px;
  background: rgba(45, 31, 20, 0.96);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.stepItem {
  flex: 1;
  min-width: 0;
  padding: 8px 4px 6px;
  border: none;
  background: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-family: inherit;
}

.index {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: rgba(253, 246, 240, 0.35);
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  transition: all 0.25s ease;
}

.label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: rgba(253, 246, 240, 0.35);
  transition: color 0.25s ease;
  line-height: 1.2;
}

.sublabel {
  font-size: 9.5px;
  font-weight: 400;
  color: rgba(253, 246, 240, 0.2);
  transition: color 0.25s ease;
  line-height: 1.2;
}

.connector {
  width: 28px;
  height: 2px;
  flex-shrink: 0;
  margin-bottom: 22px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  transition: background 0.3s ease;
}

.connector.done {
  background: rgba(107, 184, 158, 0.35);
}

/* active */
.stepItem.active .index {
  background: #c1714f;
  color: #ffffff;
  border-color: #c1714f;
  box-shadow: 0 0 0 4px rgba(193, 113, 79, 0.25);
}

.stepItem.active .label {
  color: #d4956e;
}

.stepItem.active .sublabel {
  color: rgba(212, 149, 110, 0.65);
}

/* done */
.stepItem.done .index {
  background: rgba(107, 184, 158, 0.2);
  color: #6bb89e;
  border-color: rgba(107, 184, 158, 0.4);
}

.stepItem.done .label {
  color: rgba(107, 184, 158, 0.8);
}

.stepItem.done .sublabel {
  color: rgba(107, 184, 158, 0.45);
}

/* available but not active */
.stepItem.available .index {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(253, 246, 240, 0.45);
  border-color: rgba(255, 255, 255, 0.08);
}

.stepItem.available .label {
  color: rgba(253, 246, 240, 0.42);
}

.stepItem.available .sublabel {
  color: rgba(253, 246, 240, 0.22);
}

/* locked */
.stepItem.locked {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.stepItem.locked .index {
  color: rgba(253, 246, 240, 0.18);
}

.stepItem.locked .label {
  color: rgba(253, 246, 240, 0.16);
}

.stepItem.locked .sublabel {
  color: rgba(253, 246, 240, 0.1);
}

/* hover */
.stepItem:not(.active):not(.locked):hover .index {
  background: rgba(255, 255, 255, 0.13);
  color: rgba(253, 246, 240, 0.65);
}

.stepItem:not(.active):not(.locked):hover .label {
  color: rgba(253, 246, 240, 0.65);
}

.stepItem:not(.active):not(.locked):hover .sublabel {
  color: rgba(253, 246, 240, 0.42);
}

@media (max-width: 640px) {
  .bottomNav {
    padding: 10px 4px 12px;
  }

  .stepItem {
    padding: 8px 2px 6px;
  }

  .connector {
    width: 20px;
  }

  .label {
    font-size: 10px;
  }

  .sublabel {
    font-size: 8.5px;
  }
}
</style>