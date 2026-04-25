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
//   "completedAt": null
// }

const CURRENT_SESSION_KEY = 'onestep-current-session'

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

  const newSession = {
    sessionId: generateId('session'),
    inputType,
    rawInputText,
    uploadedFileMeta,
    tasks: [],
    reward,
    startedAt: timestamp,
    completedAt: null,
  }

  saveCurrentSession(newSession)

  return newSession
}

// add task to exist session
// input: session uid, task text, priority group
export function addTaskToSession(sessionId, taskText, priorityGroup = null) {
  const session = getCurrentSession()

  if (!session || session.sessionId !== sessionId) return null

  const timestamp = Date.now()

  const newTask = {
    id: generateId('task'),
    text: taskText,
    status: 'pending',
    priorityGroup,
    order: session.tasks.length + 1,
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

  Object.assign(task, {
    ...updates,
    updatedAt: Date.now(),
  })

  saveCurrentSession(session)

  return task
}

// delete exist session
// input: session uid
export function deleteSession(sessionId) {
  const session = getCurrentSession()

  if (!session || session.sessionId !== sessionId) return null

  localStorage.removeItem(CURRENT_SESSION_KEY)

  return true
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

export const REWARD_COLLECTION_KEY = 'onestep-reward-collection'

function getRewards() {
  return JSON.parse(localStorage.getItem(REWARD_COLLECTION_KEY)) || []
}

function saveRewards(rewards) {
  localStorage.setItem(REWARD_COLLECTION_KEY, JSON.stringify(rewards))
}

// initialize new reward array(if not exist)
export function initRewardCollection() {
  if (!localStorage.getItem(REWARD_COLLECTION_KEY)) {
    localStorage.setItem(REWARD_COLLECTION_KEY, JSON.stringify([]))
  }
}

// add reward item
// input: animal name, session uid
export function addReward(name, sessionId) {
  const rewards = getRewards()

  const newReward = {
    id: generateId('reward'),
    name,
    earnedAt: Date.now(),
    sessionId,
  }

  rewards.push(newReward)
  saveRewards(rewards)

  return newReward
}