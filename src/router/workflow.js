import { ref, readonly } from 'vue'

export const WORKFLOW_STEPS = [
  { id: 1, label: 'AI dump', routeName: 'AIDump' },
  { id: 2, label: 'Planner', routeName: 'Planner' },
  { id: 3, label: 'Swipper', routeName: 'TaskSwipper' },
  { id: 4, label: 'Complete', routeName: 'Complete' },
]

const maxReachedStep = ref(1)

export const workflowState = readonly(maxReachedStep)

export function getMaxReachedStep() {
  return maxReachedStep.value
}

export function setMaxReachedStep(step) {
  const safeStep = Math.min(Math.max(step, 1), WORKFLOW_STEPS.length)
  if (safeStep > maxReachedStep.value) {
    maxReachedStep.value = safeStep
  }
}

export function resetWorkflow() {
  maxReachedStep.value = 1
}

export function startWorkflow() {
  resetWorkflow()
}

export function getStepByRouteName(routeName) {
  return WORKFLOW_STEPS.find(step => step.routeName === routeName) ?? null
}

export function getStepById(stepId) {
  return WORKFLOW_STEPS.find(step => step.id === stepId) ?? null
}

export function canAccessStep(stepId) {
  return stepId <= maxReachedStep.value
}

export function unlockStep(stepId) {
  setMaxReachedStep(stepId)
}

export function unlockNextStep(currentStepId) {
  setMaxReachedStep(currentStepId + 1)
}

export function getHighestUnlockedRouteName() {
  return getStepById(maxReachedStep.value)?.routeName ?? 'AIDump'
}

export function guardWorkflowStep(stepId, router) {
  if (canAccessStep(stepId)) return true

  router.replace({ name: getHighestUnlockedRouteName() })
  return false
}