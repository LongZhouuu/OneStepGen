import { ref, readonly } from 'vue'
import { ANIMALS } from '../data/animals'

export const WORKFLOW_STEPS = [
  { id: 1, label: 'AI dump', routeName: 'AIDump' },
  { id: 2, label: 'Planner', routeName: 'Planner' },
  { id: 3, label: 'Swipper', routeName: 'TaskSwipper' },
  { id: 4, label: 'Complete', routeName: 'Complete' },
]

const maxReachedStep = ref(1)
const focusLockActive = ref(false)

export const workflowState = readonly(maxReachedStep)
export const focusLockState = readonly(focusLockActive)

export function getMaxReachedStep() {
  return maxReachedStep.value
}

export function setMaxReachedStep(step) {
  const safeStep = normalizeStep(step)

  if (safeStep <= maxReachedStep.value) return

  maxReachedStep.value = safeStep

  const session = getCurrentSession()
  if (session) {
    session.maxReachedStep = safeStep
    saveCurrentSession(session)
  }
}

export function resetWorkflow() {
  maxReachedStep.value = 1
  focusLockActive.value = false
  resetWorkflowUIState()
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
  syncWorkflowFromSession()

  if (focusLockActive.value && stepId < 3) {
    router.replace({ name: 'TaskSwipper' })
    return false
  }

  if (canAccessStep(stepId)) return true

  router.replace({ name: getHighestUnlockedRouteName() })
  return false
}

export function setFocusLockActive(value) {
  focusLockActive.value = Boolean(value)

  const session = getCurrentSession()
  if (session) {
    session.focusLockActive = focusLockActive.value
    saveCurrentSession(session)
  }
}

export function isFocusLockActive() {
  return focusLockActive.value
}

// ----------------------------------------------------------------------
// Localstorage Maintainance

// generate random uid
function generateId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`
}

// SESSION
// var example = {
//   "sessionId": "session-9f3a2b1c-1234-4567-890a-bcdef1234567",
//   "inputType": "text",
//   "rawInputText": "Write an essay about climate change",
//   "uploadedFileMeta": null,
//   "tasks": [
//     {
//       "id": "task-a1",
//       "text": "Write introduction",
//       "status": "completed",
//       "priorityGroup": "urgent-important",
//       "order": 1,
//       "createdAt": 1713940000000,
//       "updatedAt": 1713940500000
//     },
//     {
//       "id": "task-a2",
//       "text": "Write body paragraph 1",
//       "status": "pending",
//       "priorityGroup": "important-not-urgent",
//       "order": 2,
//       "createdAt": 1713940000000,
//       "updatedAt": 1713940000000
//     }
//   ],
//   "reward": "Fox",
//   "startedAt": 1713940000000,
//   "completedAt": null,
//   "reachedStep": null
// }

const CURRENT_SESSION_KEY = 'onestep-current-session'

const WORKFLOW_UI_STATE_KEY = 'onestep-workflow-ui-state'

const DEFAULT_WORKFLOW_UI_STATE = {
  currentStep: 1,
  AIInput: '',
  userEnergyLevel: null,
}

const VALID_ENERGY_LEVELS = new Set(['low', 'normal', 'high'])

function normalizeEnergyLevel(value) {
  if (value == null || value === '') return null
  if (typeof value === 'string' && VALID_ENERGY_LEVELS.has(value)) return value
  return null
}

function clampCognitiveLoad(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 3
  return Math.min(5, Math.max(1, Math.round(n)))
}

export function getWorkflowUIState() {
  try {
    const data = localStorage.getItem(WORKFLOW_UI_STATE_KEY)
    if (!data) return { ...DEFAULT_WORKFLOW_UI_STATE }

    const parsed = JSON.parse(data)

    return {
      currentStep: normalizeStep(parsed.currentStep ?? 1),
      AIInput: parsed.AIInput ?? '',
      userEnergyLevel: normalizeEnergyLevel(parsed.userEnergyLevel),
    }
  } catch {
    return { ...DEFAULT_WORKFLOW_UI_STATE }
  }
}

export function saveWorkflowUIState(updates = {}) {
  const current = getWorkflowUIState()

  const next = {
    ...current,
    ...updates,
  }

  next.currentStep = normalizeStep(next.currentStep)
  next.AIInput = String(next.AIInput ?? '')
  next.userEnergyLevel = normalizeEnergyLevel(next.userEnergyLevel)

  localStorage.setItem(WORKFLOW_UI_STATE_KEY, JSON.stringify(next))

  return next
}

export function setWorkflowCurrentStep(step) {
  saveWorkflowUIState({
    currentStep: normalizeStep(step),
  })
}

export function getWorkflowCurrentStep() {
  return getWorkflowUIState().currentStep
}

export function setWorkflowAIInput(value) {
  saveWorkflowUIState({
    AIInput: value ?? '',
  })
}

export function getWorkflowAIInput() {
  return getWorkflowUIState().AIInput
}

export function getUserEnergyLevel() {
  return getWorkflowUIState().userEnergyLevel
}

export function setUserEnergyLevel(level) {
  saveWorkflowUIState({
    userEnergyLevel: normalizeEnergyLevel(level),
  })
}

export function getSavedWorkflowRouteName() {
  syncWorkflowFromSession()

  const currentStep = getWorkflowCurrentStep()
  const safeStep = Math.min(currentStep, maxReachedStep.value)

  return getStepById(safeStep)?.routeName ?? 'AIDump'
}

export function resetWorkflowUIState() {
  saveWorkflowUIState({
    currentStep: 1,
    AIInput: '',
    userEnergyLevel: null,
  })
}

function normalizeStep(step) {
  const numberStep = Number(step)
  if (!Number.isFinite(numberStep)) return 1
  return Math.min(Math.max(numberStep, 1), WORKFLOW_STEPS.length)
}

// get session and parse
export function getCurrentSession() {
  const data = localStorage.getItem(CURRENT_SESSION_KEY)
  return data ? JSON.parse(data) : null
}

// parse and save session
function saveCurrentSession(session) {
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session))
}

// create new session
// input: Object
// return: Object
export function createSession({
  inputType = 'text',
  rawInputText = '',
  uploadedFileMeta = null,
  reward = null,
} = {}) {
  const timestamp = Date.now()

  resetWorkflow()
  setUserEnergyLevel(null)

  const newSession = {
    sessionId: generateId('session'),
    focusLockActive: false,
    inputType,
    rawInputText,
    uploadedFileMeta,
    tasks: [],
    completedCount: 0,
    skippedCount: 0,
    reward,
    startedAt: timestamp,
    completedAt: null,
    maxReachedStep: 1,
    sessionSource: {
      type: 'new',
      historyId: null,
      historyName: null,
    },
  }

  saveCurrentSession(newSession)

  saveWorkflowUIState({
    currentStep: 1,
    AIInput: inputType === 'text' ? rawInputText : '',
  })

  return newSession
}


export function syncWorkflowFromSession() {
  const session = getCurrentSession()

  if (!session) {
    resetWorkflow()
    return null
  }

  session.sessionSource ??= {
    type: 'new',
    historyId: null,
    historyName: null,
  }

  const storedStep = session.maxReachedStep ?? session.reachedStep ?? 1
  const safeStep = normalizeStep(storedStep)

  session.maxReachedStep = safeStep
  delete session.reachedStep

  maxReachedStep.value = safeStep
  focusLockActive.value = Boolean(session.focusLockActive)

  saveCurrentSession(session)

  return session
}


// Bulk add AI-generated tasks to an existing session
// Replaces any existing tasks in the session with the AI results
// Input:
//   sessionId: string — must match the current session
//   aiTasks: array of { text, priorityGroup, order } from backend response
// Returns: updated session object, or null if session not found
export function addAITasksToSession(sessionId, aiTasks) {
  const session = getCurrentSession()

  // Guard: ensure session exists and matches the given sessionId
  if (!session || session.sessionId !== sessionId) return null

  const timestamp = Date.now()

  // Map backend task format to our internal task format
  // Each task gets a new unique id, default status 'pending',
  // and timestamps set to now
  const newTasks = aiTasks.map(t => ({
    id: generateId('task'),
    text: t.text,
    status: 'pending',
    priorityGroup: t.priorityGroup,
    order: t.order,           // use the order provided by AI
    parent_task_cognitive_load: clampCognitiveLoad(t.parent_task_cognitive_load),
    createdAt: timestamp,
    updatedAt: timestamp,
  }))

  // Replace session tasks entirely with AI-generated tasks
  session.tasks = newTasks
  saveCurrentSession(session)

  return session
}

// Add a single task manually to an existing session
// The new task is inserted at the END of its priorityGroup
// All tasks that come after the insertion point have their order shifted up by 1
// Input:
//   sessionId: string — must match the current session
//   taskText: string — the task description
//   priorityGroup: string — one of:
//     'urgent-important' | 'not-urgent-important' |
//     'urgent-not-important' | 'not-urgent-not-important'
// Returns: the newly created task object, or null if session not found
export function addTaskToSession(sessionId, taskText, priorityGroup = null) {
  const session = getCurrentSession()

  if (!session || session.sessionId !== sessionId) return null

  const timestamp = Date.now()

  // Fixed group priority order — determines where each group sits globally
  const GROUP_ORDER = [
    'urgent-important',
    'not-urgent-important',
    'urgent-not-important',
    'not-urgent-not-important',
  ]

  // Find all tasks that belong to the same priorityGroup
  const groupTasks = session.tasks.filter(t => t.priorityGroup === priorityGroup)

  let insertOrder

  if (groupTasks.length > 0) {
    // Group already has tasks — insert after the last one in this group
    insertOrder = Math.max(...groupTasks.map(t => t.order)) + 1
  } else {
    // Group is empty — find the correct position based on group hierarchy
    // Look for the last task that belongs to a group that comes BEFORE this group
    const currentGroupIndex = GROUP_ORDER.indexOf(priorityGroup)

    // Get all tasks belonging to groups that come before the target group
    const precedingGroups = GROUP_ORDER.slice(0, currentGroupIndex)
    const precedingTasks = session.tasks.filter(t =>
      precedingGroups.includes(t.priorityGroup)
    )

    if (precedingTasks.length > 0) {
      // Insert right after the last task of the preceding groups
      insertOrder = Math.max(...precedingTasks.map(t => t.order)) + 1
    } else {
      // No tasks in any preceding group either — insert at the very beginning
      insertOrder = 1
    }
  }

  // Shift all tasks at or after the insertion point up by 1
  session.tasks = session.tasks.map(t => ({
    ...t,
    order: t.order >= insertOrder ? t.order + 1 : t.order,
    updatedAt: timestamp,
  }))

  // Build the new task object
  const newTask = {
    id: generateId('task'),
    text: taskText,
    status: 'pending',
    priorityGroup,
    order: insertOrder,
    parent_task_cognitive_load: 3,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  session.tasks.push(newTask)
  saveCurrentSession(session)

  return newTask
}

// delete exist task within exist session
// input: session uid, task uid
export function deleteTaskFromSession(sessionId, taskId) {
  const session = getCurrentSession()

  if (!session || session.sessionId !== sessionId) return null

  session.tasks = session.tasks
    .filter(task => task.id !== taskId)
    .map((task, index) => ({
      ...task,
      order: index + 1,
      updatedAt: Date.now(),
    }))

  saveCurrentSession(session)

  return session
}

// update exist task within exist session
// input: session uid, task uid, new content(partial object)
// example: updateTaskInSession(sessionId, taskId, {
//            status: 'completed'
//          })
export function updateTaskInSession(sessionId, taskId, updates) {
  const session = getCurrentSession()

  if (!session || session.sessionId !== sessionId) return null

  const task = session.tasks.find(t => t.id === taskId)

  if (!task) return null

  const wasCompleted = task.status === 'completed'
  const wasSkipped = task.status == 'skipped'

  Object.assign(task, {
    ...updates,
    updatedAt: Date.now(),
  })

  const isNowCompleted = task.status === 'completed'
  const isNowSkipped = task.status == 'skipped'

  if (!wasCompleted && isNowCompleted) {
    session.completedCount += 1
  }

  if (!wasSkipped && isNowSkipped) {
    session.skippedCount += 1
  }

  saveCurrentSession(session)

  return task
}

// delete exist session
// input: session uid
export function deleteSession(sessionId) {
  const session = getCurrentSession()

  if (!session || session.sessionId !== sessionId) return null

  localStorage.removeItem(CURRENT_SESSION_KEY)
  resetWorkflow()

  return true
}

// Reorder all tasks after drag-and-drop
// Input: sessionId, reorderedTasks — full tasks array in new order
//   - active tasks (pending/doing): order reassigned 1-N based on array position
//   - skipped tasks: order set to null
// Note: priorityGroup should be updated by the caller before passing in
export function reorderTasksInSession(sessionId, reorderedTasks) {
  const session = getCurrentSession()

  if (!session || session.sessionId !== sessionId) return null

  const timestamp = Date.now()
  let activeCounter = 0

  session.tasks = reorderedTasks.map(task => {
    const isSkipped = task.status === 'skipped'
    return {
      ...task,
      order: isSkipped ? null : ++activeCounter,
      updatedAt: timestamp,
    }
  })

  saveCurrentSession(session)

  return session
}

// mark specific session as completed by update completedAt field
// input: session uid
export function completeCurrentSession(sessionId) {
  const session = getCurrentSession()

  if (!session || session.sessionId !== sessionId) return null

  session.completedAt = Date.now()

  saveCurrentSession(session)

  return session
}


// ----------------------------------------------------------------------
// Task history (localStorage key separate from current session)

/** Saved task lists from Plan / Dump workflow (separate from current session). Max 10 entries, no auto-eviction. */
const TASK_HISTORY_KEY = 'taskHistory'
const MAX_TASK_HISTORY_ITEMS = 10

/** Deep clone plain JSON-serializable values (e.g. task arrays). */
function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

function saveTaskHistory(items) {
  localStorage.setItem(TASK_HISTORY_KEY, JSON.stringify(items))
}

/** Return all saved history entries (newest appended last). */
export function getTaskHistory() {
  try {
    const data = localStorage.getItem(TASK_HISTORY_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** True when history already holds MAX_TASK_HISTORY_ITEMS entries. */
export function isHistoryFull() {
  return getTaskHistory().length >= MAX_TASK_HISTORY_ITEMS
}

/**
 * Append one history row. Tasks are deep-cloned so later session edits do not mutate stored data.
 * @returns {string} New history row id
 */
export function addHistoryItem({ label, inputType, input, pdfFileName, tasks }) {
  if (isHistoryFull()) {
    throw new Error('History is full')
  }

  const list = getTaskHistory()
  const id = generateId('history')
  const row = {
    id,
    label,
    createdAt: new Date().toISOString(),
    inputType,
    input: input ?? '',
    pdfFileName: pdfFileName ?? null,
    tasks: deepCloneJson(tasks ?? []),
  }
  list.push(row)
  saveTaskHistory(list)
  return id
}

/**
 * Replace fields on an existing history row (preserves id and createdAt).
 */
export function updateHistoryItem(historyId, { label, tasks, inputType, input, pdfFileName }) {
  const list = getTaskHistory()
  const idx = list.findIndex(h => h.id === historyId)
  if (idx === -1) {
    throw new Error('History item not found')
  }

  const prev = list[idx]
  list[idx] = {
    ...prev,
    label,
    inputType,
    input: input ?? '',
    pdfFileName: pdfFileName ?? null,
    tasks: deepCloneJson(tasks ?? []),
  }
  saveTaskHistory(list)
}

/** Remove one history row by id. */
export function deleteHistoryItem(historyId) {
  const list = getTaskHistory().filter(h => h.id !== historyId)
  saveTaskHistory(list)
}

/**
 * Replace current session from a history snapshot (does not use createSession — avoids resetting workflow progress).
 * Aligns startedAt with createSession (Unix ms), not ISO string.
 */
export function loadSessionFromHistory(historyItem) {
  if (!historyItem?.id) {
    throw new Error('Invalid history item')
  }

  const tasks = deepCloneJson(historyItem.tasks ?? [])
  const completedCount = tasks.filter(t => t.status === 'completed').length
  const skippedCount = tasks.filter(t => t.status === 'skipped').length
  const pdfName = historyItem.pdfFileName ?? null
  const timestamp = Date.now()

  const newSession = {
    sessionId: generateId('session'),
    focusLockActive: false,
    inputType: historyItem.inputType === 'pdf' ? 'pdf' : 'text',
    rawInputText: historyItem.input ?? '',
    uploadedFileMeta: pdfName ? { name: pdfName } : null,
    tasks,
    completedCount,
    skippedCount,
    reward: null,
    startedAt: timestamp,
    completedAt: null,
    maxReachedStep: 3,
    sessionSource: {
      type: 'history',
      historyId: historyItem.id,
      historyName: historyItem.label,
    },
  }

  saveCurrentSession(newSession)
  syncWorkflowFromSession()
  return getCurrentSession()
}

/**
 * Persist current tasks + input metadata into taskHistory (append or overwrite by sessionSource.historyId).
 * UI should catch errors for full history on first save.
 */
export function saveOrUpdateHistory(name) {
  const session = getCurrentSession()
  if (!session) {
    throw new Error('No active session')
  }

  session.sessionSource ??= {
    type: 'new',
    historyId: null,
    historyName: null,
  }

  const source = session.sessionSource
  const currentTasks = session.tasks ?? []

  if (!source.historyId && isHistoryFull()) {
    throw new Error('History is full')
  }

  if (source.historyId) {
    updateHistoryItem(source.historyId, {
      label: name,
      tasks: deepCloneJson(currentTasks),
      inputType: session.inputType,
      input: session.rawInputText ?? null,
      pdfFileName: session.uploadedFileMeta?.name ?? null,
    })
  } else {
    const newId = addHistoryItem({
      label: name,
      inputType: session.inputType,
      input: session.rawInputText ?? null,
      pdfFileName: session.uploadedFileMeta?.name ?? null,
      tasks: deepCloneJson(currentTasks),
    })
    session.sessionSource.historyId = newId
  }

  session.sessionSource.historyName = name
  saveCurrentSession(session)
}

// REWARDS
// var example = [
//   {
//     "id": "reward-1a2b3c",
//     "name": "Fox",
//     "earnedAt": 1713941000000,
//     "sessionId": "session-9f3a2b1c-1234-4567-890a-bcdef1234567"
//   },
//   {
//     "id": "reward-4d5e6f",
//     "name": "Cat",
//     "earnedAt": 1713950000000,
//     "sessionId": "session-2222-xxxx"
//   }
// ]

// REWARDS ===========================================================
export const ANIMAL_COLLECTION_KEY = 'onestep-animal-collection'

export function getRewards() {
  return JSON.parse(localStorage.getItem(ANIMAL_COLLECTION_KEY)) || []
}

export const REWARDS_UPDATED_EVENT = 'rewards-updated'

function saveRewards(animals) {
  localStorage.setItem(ANIMAL_COLLECTION_KEY, JSON.stringify(animals))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(REWARDS_UPDATED_EVENT))
  }
}

// initialize new animal array if it does not exist
export function initRewardCollection() {
  if (!localStorage.getItem(ANIMAL_COLLECTION_KEY)) {
    localStorage.setItem(ANIMAL_COLLECTION_KEY, JSON.stringify([]))
  }
}

// get one random animal from animals.js
export function getRandomAnimal() {
  const randomIndex = Math.floor(Math.random() * ANIMALS.length)
  return ANIMALS[randomIndex]
}

// add one random animal to localStorage collection
// each collected animal item contains at least:
// name, image, region, earnedAt, sessionId
export function addRandomAnimal(sessionId) {
  const current_animals_list = getRewards()
  const randomAnimal = getRandomAnimal()

  const newAnimalItem = {
    id: generateId(randomAnimal.id),
    name: randomAnimal.name,
    image: randomAnimal.image,
    region: randomAnimal.region,
    earnedAt: Date.now(),
    // The sessionID is used to make sure that a user can only get 
    //  one animal within the same session.
    // See getAnimalBySessionId()
    sessionId,
  }

  current_animals_list.push(newAnimalItem)
  saveRewards(current_animals_list)

  return newAnimalItem
}

// find animal item by sessionId
export function getAnimalBySessionId(sessionId) {
  const animals = getRewards()

  return animals.find(animal => animal.sessionId === sessionId) || null
}