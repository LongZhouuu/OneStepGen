<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Planner</h1>
      <p class="page-subtitle">Have a lot to do today? No pressure, just list your tasks here.<br>  
        We’ll guide you through them, one step at a time.
      </p>
    </div>

    <div class="how-it-works">
      <div class="how-it-works-header">
        <div class="how-it-works-heading">
          <p class="how-it-works-kicker">How it works</p>
          <h2 class="how-it-works-title">Turn a messy to-do list into one clear next step.</h2>
        </div>
        <button
          type="button"
          class="how-it-works-toggle"
          :aria-expanded="howItWorksOpen"
          @click="howItWorksOpen = !howItWorksOpen"
        >
          {{ howItWorksOpen ? 'Hide' : 'Show' }}
          <span class="how-it-works-toggle-icon" :class="{ open: howItWorksOpen }">&gt;</span>
        </button>
      </div>
      <div v-show="howItWorksOpen" class="how-it-works-steps">
        <div class="how-it-works-step">
          <span class="step-number">1</span>
          <div class="step-copy">
            <h3 class="step-title">Add your tasks</h3>
            <p class="step-text">Write down everything you need to do, even if it feels too much right now.</p>
          </div>
        </div>
        <div class="how-it-works-step">
          <span class="step-number">2</span>
          <div class="step-copy">
            <h3 class="step-title">Reorder what matters</h3>
            <p class="step-text">Drag tasks into the order that makes the most sense for today.</p>
          </div>
        </div>
        <div class="how-it-works-step">
          <span class="step-number">3</span>
          <div class="step-copy">
            <h3 class="step-title">Start one task at a time</h3>
            <p class="step-text">Create your planner and focus on the next step instead of the whole list.</p>
          </div>
        </div>
        <div class="how-it-works-step">
          <span class="step-number">4</span>
          <div class="step-copy">
            <h3 class="step-title">Adjust anytime</h3>
            <p class="step-text">Go back to add new tasks whenever you need, or move skipped tasks back into your task list.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="content-area">
      <!-- Input Area -->
      <div class="input-wrapper">
        <div class="search-box" :class="{ focused: inputFocused }">
          <input
            ref="taskInputRef"
            v-model="newTaskText"
            class="task-input"
            type="text"
            placeholder="Enter a task (e.g. reply to emails)"
            :aria-invalid="newTaskInvalid"
            aria-describedby="task-input-help"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @keyup.enter="addTask"
          />
          <button
            type="button"
            class="voice-btn"
            :class="{ listening: isListening }"
            :aria-label="isListening ? 'Stop voice input' : 'Start voice input'"
            :aria-pressed="isListening"
            :disabled="!speechSupported"
            @click="toggleVoiceInput"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 4.75a2.75 2.75 0 0 1 2.75 2.75v4.5a2.75 2.75 0 1 1-5.5 0V7.5A2.75 2.75 0 0 1 12 4.75Z"
                stroke="currentColor"
                stroke-width="1.8"
              />
              <path
                d="M7.75 11.75a4.25 4.25 0 1 0 8.5 0M12 16v3.25M9 19.25h6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <button class="add-btn" :disabled="newTaskInvalid" :class="{ 'btn-disabled': newTaskInvalid }"
            @click="addTask">Add Task</button>
        </div>
        <p id="task-input-help" class="voice-status" aria-live="polite">{{ voiceStatusMessage }}</p>
        <p v-if="newTaskOverLimit" class="char-limit-error">Task cannot exceed 50 characters</p>
        <p v-else-if="newTaskInvalidChars" class="char-limit-error">Only English characters are allowed</p>
      </div>

      <!-- Active Tasks -->
      <draggable v-model="activeTasks" item-key="id" class="task-list" handle=".task-dot" @end="onDragEnd">
        <template #item="{ element: task }">
          <div class="task-row">
            <span class="task-dot" :class="task.status" title="Drag to reorder"></span>
            <div class="task-info">
              <template v-if="editingId === task.id">
                <input v-model="editingText" class="task-edit-input" @keyup.enter="confirmEdit(task)"
                  @blur="confirmEdit(task)" @keyup.escape="cancelEdit" />
                <p v-if="editOverLimit" class="char-limit-error">Task cannot exceed 50 characters</p>
                <p v-else-if="editInvalidChars" class="char-limit-error">Only English characters are allowed</p>
              </template>
              <template v-else>
                <span class="task-text">{{ task.text }}</span>
                <span class="task-status">{{ task.status }}</span>
              </template>
            </div>
            <div class="task-actions">
              <span class="action-edit" @click="startEdit(task)">Edit</span>
              <span class="action-delete" @click="deleteTask(task.id)">Delete</span>
            </div>
          </div>
        </template>
      </draggable>

      <!-- Drag hint -->
      <p v-if="activeTasks.length > 0" class="drag-hint">· Hold and drag to reorder</p>

      <!-- Skipped Tasks -->
      <div v-if="skippedTasks.length > 0" class="skipped-section">
        <h3 class="skipped-title">Skipped Tasks</h3>
        <div v-for="task in skippedTasks" :key="task.id" class="task-row">
          <span class="task-dot skipped"></span>
          <div class="task-info">
            <span class="task-text">{{ task.text }}</span>
            <span class="task-status">{{ task.status }}</span>
          </div>
          <div class="task-actions">
            <span class="action-edit" @click="moveBack(task.id)">Move back</span>
          </div>
        </div>
      </div>

      <!-- Create Planner + Clear All -->
      <div class="create-planner-wrapper">
        <button class="create-planner-btn" :disabled="activeTasks.length === 0"
          :class="{ 'btn-disabled': activeTasks.length === 0 }" @click="createPlanner">
          Create Planner
        </button>
        <button v-if="activeTasks.length > 0" class="clear-all-btn" @click="clearAll">Clear All</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

const router = useRouter()

// ── UI state ──────────────────────────────────────────────────────────────────
const newTaskText = ref('')
const inputFocused = ref(false)
const editingId = ref(null)
const editingText = ref('')
const taskInputRef = ref(null)
const speechRecognition = ref(null)
const speechSupported = ref(false)
const isListening = ref(false)
const voiceStatusMessage = ref('Checking voice input support...')
const voiceStopRequested = ref(false)
const howItWorksOpen = ref(true)

const TASK_MAX_LEN = 50
const ALLOWED_CHARS = /^[a-zA-Z0-9\s.,!?;:'"()\-_@#$%&*+=/<>]*$/

const newTaskOverLimit = computed(() => newTaskText.value.length > TASK_MAX_LEN)
const newTaskInvalidChars = computed(() => !newTaskOverLimit.value && !ALLOWED_CHARS.test(newTaskText.value))
const newTaskInvalid = computed(() => newTaskOverLimit.value || newTaskInvalidChars.value)

const editOverLimit = computed(() => editingText.value.length > TASK_MAX_LEN)
const editInvalidChars = computed(() => !editOverLimit.value && !ALLOWED_CHARS.test(editingText.value))
const editInvalid = computed(() => editOverLimit.value || editInvalidChars.value)

function updateVoiceStatus(message) {
  voiceStatusMessage.value = message
}

function initSpeechRecognition() {
  if (typeof window === 'undefined') return

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    speechSupported.value = false
    updateVoiceStatus('Voice input is not supported in this browser.')
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = navigator.language?.startsWith('en') ? navigator.language : 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
    isListening.value = true
    voiceStopRequested.value = false
    updateVoiceStatus('Listening... Speak your task now.')
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .slice(event.resultIndex)
      .map(result => result[0]?.transcript ?? '')
      .join(' ')
      .trim()

    if (!transcript) return

    newTaskText.value = [newTaskText.value.trim(), transcript].filter(Boolean).join(' ')
    updateVoiceStatus('Voice input added to the task field.')
    taskInputRef.value?.focus()
  }

  recognition.onerror = (event) => {
    isListening.value = false

    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      updateVoiceStatus('Microphone access was blocked. Please allow microphone access and try again.')
      return
    }

    if (event.error === 'no-speech') {
      updateVoiceStatus('No speech detected. Try again when you are ready.')
      return
    }

    updateVoiceStatus('Voice input could not be completed. Please try again.')
  }

  recognition.onend = () => {
    isListening.value = false
    if (voiceStopRequested.value) {
      voiceStopRequested.value = false
      updateVoiceStatus('Voice input stopped.')
    }
  }

  speechRecognition.value = recognition
  speechSupported.value = true
  updateVoiceStatus('Use the microphone to speak a task into the input field.')
}

function stopVoiceInput() {
  if (!speechRecognition.value || !isListening.value) return
  voiceStopRequested.value = true
  speechRecognition.value.stop()
}

function toggleVoiceInput() {
  if (!speechSupported.value || !speechRecognition.value) return

  if (isListening.value) {
    stopVoiceInput()
    return
  }

  speechRecognition.value.start()
}

// ── Task lists ────────────────────────────────────────────────────────────────
const activeTasks = ref([])
const skippedTasks = ref([])
const completedTasks = ref([])

// ── Helpers ───────────────────────────────────────────────────────────────────
function reorderTasks() {
  activeTasks.value.forEach((t, i) => { t.order = i })
  skippedTasks.value.forEach(t => { t.order = null })
  completedTasks.value.forEach(t => { t.order = null })

  console.log('=== reorderTasks ===')
  console.log('activeTasks:', activeTasks.value.map(t => ({ text: t.text, status: t.status, order: t.order })))
  console.log('skippedTasks:', skippedTasks.value.map(t => ({ text: t.text, status: t.status, order: t.order })))
}

function saveTasks() {
  const allTasks = [...activeTasks.value, ...skippedTasks.value, ...completedTasks.value]
  localStorage.setItem('tasks', JSON.stringify(allTasks))
}

// ── Load from localStorage ────────────────────────────────────────────────────
function loadTasks() {
  const raw = localStorage.getItem('tasks')
  if (!raw) return

  const all = JSON.parse(raw)
  activeTasks.value = all
    .filter(t => t.status === 'pending' || t.status === 'doing')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  skippedTasks.value = all.filter(t => t.status === 'skipped')
  completedTasks.value = all.filter(t => t.status === 'completed')
}

loadTasks()
reorderTasks()
saveTasks()

onMounted(() => {
  initSpeechRecognition()
})

onBeforeUnmount(() => {
  if (!speechRecognition.value) return
  speechRecognition.value.onstart = null
  speechRecognition.value.onresult = null
  speechRecognition.value.onerror = null
  speechRecognition.value.onend = null
  speechRecognition.value.abort()
})

// ── Add task ──────────────────────────────────────────────────────────────────
function addTask() {
  const text = newTaskText.value.trim()
  if (!text || newTaskInvalid.value) return

  activeTasks.value.push({
    id: crypto.randomUUID(),
    text,
    status: 'pending',
    order: activeTasks.value.length,
    createdAt: Date.now(),
    updatedAt: Date.now()
  })
  newTaskText.value = ''
  reorderTasks()
  saveTasks()
}

// ── Edit task ─────────────────────────────────────────────────────────────────
function startEdit(task) {
  editingId.value = task.id
  editingText.value = task.text
}

function confirmEdit(task) {
  if (editingId.value !== task.id) return
  if (editInvalid.value) return
  const text = editingText.value.trim()
  if (text && text !== task.text) {
    task.text = text
    task.updatedAt = Date.now()
    saveTasks()
  }
  cancelEdit()
}

function cancelEdit() {
  editingId.value = null
  editingText.value = ''
}

// ── Delete task ───────────────────────────────────────────────────────────────
function deleteTask(id) {
  activeTasks.value = activeTasks.value.filter(t => t.id !== id)
  reorderTasks()
  saveTasks()
}

// ── Drag end ──────────────────────────────────────────────────────────────────
function onDragEnd() {
  reorderTasks()
  saveTasks()
}

// ── Move back ─────────────────────────────────────────────────────────────────
function moveBack(id) {
  const idx = skippedTasks.value.findIndex(t => t.id === id)
  if (idx === -1) return
  const [task] = skippedTasks.value.splice(idx, 1)
  task.status = 'pending'
  task.updatedAt = Date.now()
  activeTasks.value.push(task)
  reorderTasks()
  saveTasks()
}

// ── Clear All ─────────────────────────────────────────────────────────────────
function clearAll() {
  activeTasks.value = []
  skippedTasks.value = []
  completedTasks.value = []
  saveTasks()
  console.log('=== After Clear All ===', localStorage.getItem('tasks'))
}

// ── Create Planner ────────────────────────────────────────────────────────────
function createPlanner() {
  if (activeTasks.value.length === 0) return
  const now = Date.now()
  activeTasks.value.forEach(t => {
    t.status = (t.order === 0) ? 'doing' : 'pending'
    t.updatedAt = now
  })
  console.log(activeTasks.value);

  saveTasks()
  router.push({ name: 'TaskSwipper' })
}
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 24px 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
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

/* How it works section */
.how-it-works {
  max-width: 600px;
  margin: 0 auto 44px;
  padding: 28px 32px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(248, 241, 234, 0.94) 0%, rgba(255, 250, 246, 0.98) 100%);
  box-shadow: 0 16px 36px rgba(97, 75, 52, 0.08);
}

.how-it-works-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.how-it-works-heading {
  flex: 1;
}

.how-it-works-kicker {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #b46a2d;
  margin: 0 0 10px;
}

.how-it-works-title {
  font-size: 1.8rem;
  font-weight: 500;
  line-height: 1.25;
  color: #333;
  margin: 0;
}

.how-it-works-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.72);
  color: #6a5238;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  flex-shrink: 0;
}

.how-it-works-toggle-icon {
  font-size: 0.9rem;
  transform: rotate(90deg);
  transition: transform 0.2s ease;
}

.how-it-works-toggle-icon.open {
  transform: rotate(270deg);
}

.how-it-works-steps {
  display: grid;
  gap: 14px;
}

.how-it-works-step {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(180, 106, 45, 0.08);
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #b46a2d;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.step-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* Content area centred at 600px */
.content-area {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Input row */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 12px 16px;
  gap: 12px;
  transition: all 0.3s ease;
}

.search-box.focused {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.task-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  outline: none;
}

.task-input::placeholder {
  color: #aaa;
}

.voice-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 999px;
  background: rgba(180, 106, 45, 0.12);
  color: #8d5b2b;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
}

.voice-btn:hover:not(:disabled) {
  background: rgba(180, 106, 45, 0.2);
  transform: translateY(-1px);
}

.voice-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.voice-btn.listening {
  background: #b46a2d;
  color: #fff;
}

.voice-btn svg {
  width: 18px;
  height: 18px;
}

.voice-status {
  font-size: 0.82rem;
  color: #7a6757;
  margin: 8px 4px 0;
  min-height: 1.3em;
}

.add-btn {
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  background: #c8e1f5;
  color: #2f2f2f;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.add-btn:hover {
  opacity: 0.85;
}

/* Task list */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 14px 16px;
  gap: 12px;
  transition: background 0.2s ease;
}

.task-row:hover {
  background: rgba(255, 255, 255, 0.9);
}

.task-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-dot.doing {
  background: #e57373;
}

.task-dot.pending {
  background: #66bb6a;
}

.task-dot.skipped {
  background: #bdbdbd;
}

.task-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.task-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.task-status {
  font-size: 0.78rem;
  color: #999;
}

.task-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-edit {
  font-size: 0.85rem;
  color: #888;
  cursor: pointer;
}

.action-edit:hover {
  color: #555;
}

.action-delete {
  font-size: 0.85rem;
  color: #e57373;
  cursor: pointer;
}

.action-delete:hover {
  color: #c62828;
}

/* Skipped section */
.skipped-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.skipped-title {
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  margin: 0 0 4px 4px;
}

/* Character limit error */
.char-limit-error {
  font-size: 0.78rem;
  color: #e57373;
  margin: 4px 4px 0;
}

/* Input wrapper (allows error text below search-box) */
.input-wrapper {
  display: flex;
  flex-direction: column;
}

/* Drag hint */
.drag-hint {
  font-size: 0.78rem;
  color: #666;
  text-align: center;
  margin: 0;
}

/* Create Planner button */
.create-planner-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
}

.create-planner-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 999px;
  padding: 14px 32px;
  background: #c8e1f5;
  color: #2f2f2f;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
}

.create-planner-btn:hover:not(:disabled) {
  opacity: 0.85;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.create-planner-btn.btn-disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
}

/* Clear All button */
.clear-all-btn {
  position: absolute;
  right: 16px;
  border: none;
  border-radius: 999px;
  padding: 10px 20px;
  background: #ffcccc;
  color: #2f2f2f;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.clear-all-btn:hover {
  opacity: 0.85;
}

/* disabled style for add-btn */
.add-btn.btn-disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
}

.add-btn.btn-disabled:hover {
  opacity: 1;
}

/* Inline edit input inside task row */
.task-edit-input {
  width: 100%;
  border: none;
  border-bottom: 1.5px solid #c8e1f5;
  background: transparent;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  outline: none;
  padding: 2px 0;
}

/* Drag handle cursor on dot */
.task-dot {
  cursor: grab;
}

.task-dot:active {
  cursor: grabbing;
}

@media (max-width: 768px) {
  .page-container {
    padding: 72px 20px 96px;
  }

  .page-title {
    font-size: 2.4rem;
  }

  .page-subtitle {
    font-size: 1.1rem;
  }

  .how-it-works {
    margin-bottom: 32px;
    padding: 22px 18px;
    border-radius: 22px;
  }

  .how-it-works-title {
    font-size: 1.45rem;
  }

  .how-it-works-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .how-it-works-step {
    padding: 14px 14px;
    border-radius: 16px;
  }

  .voice-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
