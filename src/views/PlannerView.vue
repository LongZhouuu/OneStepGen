<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Planner</h1>
      <p class="page-subtitle">Map out your day with calm and intention, no pressure, just one gentle step at a time.</p>
    </div>

    <div class="content-area">
      <!-- Input Area -->
      <div class="input-wrapper">
        <div class="search-box" :class="{ focused: inputFocused }">
          <input
            v-model="newTaskText"
            class="task-input"
            type="text"
            placeholder="Please enter a task"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @keyup.enter="addTask"
          />
          <button
            class="add-btn"
            :disabled="newTaskOverLimit"
            :class="{ 'btn-disabled': newTaskOverLimit }"
            @click="addTask"
          >Add Task</button>
        </div>
        <p v-if="newTaskOverLimit" class="char-limit-error">Task cannot exceed 50 characters</p>
      </div>

      <!-- Active Tasks -->
      <draggable
        v-model="activeTasks"
        item-key="id"
        class="task-list"
        handle=".task-dot"
        @end="onDragEnd"
      >
        <template #item="{ element: task }">
          <div class="task-row">
            <span class="task-dot" :class="task.status" title="Drag to reorder"></span>
            <div class="task-info">
              <template v-if="editingId === task.id">
                <input
                  v-model="editingText"
                  class="task-edit-input"
                  @keyup.enter="confirmEdit(task)"
                  @blur="confirmEdit(task)"
                  @keyup.escape="cancelEdit"
                />
                <p v-if="editOverLimit" class="char-limit-error">Task cannot exceed 50 characters</p>
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
        <div
          v-for="task in skippedTasks"
          :key="task.id"
          class="task-row"
        >
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
        <button
          class="create-planner-btn"
          :disabled="activeTasks.length === 0"
          :class="{ 'btn-disabled': activeTasks.length === 0 }"
          @click="createPlanner"
        >
          Create Planner
        </button>
        <button
          v-if="activeTasks.length > 0"
          class="clear-all-btn"
          @click="clearAll"
        >Clear All</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'

const router = useRouter()

// ── UI state ──────────────────────────────────────────────────────────────────
const newTaskText = ref('')
const inputFocused = ref(false)
const editingId = ref(null)
const editingText = ref('')

const TASK_MAX_LEN = 50
const newTaskOverLimit = computed(() => newTaskText.value.length > TASK_MAX_LEN)
const editOverLimit = computed(() => editingText.value.length > TASK_MAX_LEN)

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

// ── Add task ──────────────────────────────────────────────────────────────────
function addTask() {
  const text = newTaskText.value.trim()
  if (!text || newTaskOverLimit.value) return

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
  if (editOverLimit.value) return
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
    t.status = 'pending'
    t.updatedAt = now
  })
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
  margin-bottom: 60px;
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
</style>
