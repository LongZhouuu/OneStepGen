/** @typedef {'low' | 'normal' | 'high'} CognitiveTier */

export const COGNITIVE_TIERS = [
  { id: 'low', label: 'Low energy', short: 'Low' },
  { id: 'normal', label: 'Normal', short: 'Normal' },
  { id: 'high', label: 'High energy', short: 'High' },
]

const VALID_LEVELS = new Set(['low', 'normal', 'high'])

/**
 * Map AI parent_task_cognitive_load (1-5) to display tier.
 * 1-2 = Low, 3 = Normal, 4-5 = High
 * @param {number | undefined | null} load
 * @returns {CognitiveTier}
 */
export function cognitiveLoadToTier(load) {
  const n = Number(load)
  if (!Number.isFinite(n)) return 'normal'
  const clamped = Math.min(5, Math.max(1, Math.round(n)))
  if (clamped <= 2) return 'low'
  if (clamped >= 4) return 'high'
  return 'normal'
}

/**
 * @param {{ parent_task_cognitive_load?: number | null }} task
 * @returns {CognitiveTier}
 */
export function getTaskCognitiveTier(task) {
  return cognitiveLoadToTier(task?.parent_task_cognitive_load)
}

/**
 * @param {{ parent_task_cognitive_load?: number | null }} task
 * @returns {string}
 */
export function getTaskCognitiveLabel(task) {
  const tier = getTaskCognitiveTier(task)
  const found = COGNITIVE_TIERS.find(t => t.id === tier)
  return found?.short ?? 'Normal'
}

/**
 * @param {unknown} value
 * @returns {CognitiveTier | null}
 */
export function normalizeUserEnergyLevel(value) {
  if (value == null || value === '') return null
  if (typeof value === 'string' && VALID_LEVELS.has(value)) return value
  return null
}

/**
 * Show label only when user has picked a level and task AI tier matches.
 * @param {{ parent_task_cognitive_load?: number | null }} task
 * @param {CognitiveTier | null} userEnergyLevel
 */
export function taskMatchesUserEnergy(task, userEnergyLevel) {
  if (!userEnergyLevel) return false
  return getTaskCognitiveTier(task) === userEnergyLevel
}
