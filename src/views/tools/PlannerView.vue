<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Planner</h1>
      <p class="page-subtitle">Map out your day with calm and intention, no pressure, just one gentle step at a time.</p>
    </div>

    <div class="content-area">
      <!-- Input Area -->
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
        <button class="add-btn" @click="addTask">Add Task</button>
      </div>

      <!-- Active Tasks -->
      <div class="task-list">
        <div
          v-for="task in activeTasks"
          :key="task.id"
          class="task-row"
        >
          <span class="task-dot" :class="task.status"></span>
          <div class="task-info">
            <span class="task-text">{{ task.text }}</span>
            <span class="task-status">{{ task.status }}</span>
          </div>
          <div class="task-actions">
            <span class="action-edit">Edit</span>
            <span class="action-delete">Delete</span>
          </div>
        </div>
      </div>

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
            <span class="action-edit">Move back</span>
          </div>
        </div>
      </div>

      <!-- Create Planner Button -->
      <div class="create-planner-wrapper">
        <button class="create-planner-btn">
          <span class="btn-icon">&#x1F4C5;</span> Create Planner
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newTaskText = ref('')
const inputFocused = ref(false)

const activeTasks = ref([
  { id: '1', text: 'Complete the brand design audit', status: 'doing', order: 0 },
  { id: '2', text: 'Schedule client kick-off meeting', status: 'pending', order: 1 },
  { id: '3', text: 'Refactor navigation components', status: 'pending', order: 2 }
])

const skippedTasks = ref([
  { id: '4', text: 'Update documentation for API', status: 'skipped', order: null }
])

function addTask() {
  const text = newTaskText.value.trim()
  if (!text) return
  activeTasks.value.push({
    id: Date.now().toString(),
    text,
    status: 'pending',
    order: activeTasks.value.length
  })
  newTaskText.value = ''
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

/* Create Planner button */
.create-planner-wrapper {
  display: flex;
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

.create-planner-btn:hover {
  opacity: 0.85;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.1rem;
}
</style>
