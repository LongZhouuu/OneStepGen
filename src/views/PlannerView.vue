<template>
  <div class="planner-page">
    <div class="workspace-panel" id="panel-2">
      <div class="panel-header-band band-2">
        <div class="phb-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6h13M8 12h13M8 18h13" />
            <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
          </svg>
        </div>
        <div>
          <div class="phb-title">Plan your tasks</div>
          <div class="phb-desc">Review, edit and reorder. Tasks are sorted by priority.</div>
        </div>
      </div>

      <div class="panel-card panel-card-2-plan">
        <div class="task-list-header">
          <div>
            <h2 class="panel-title">Your Tasks</h2>
            <p class="panel-sub">Drag to reorder · tap edit to change</p>
          </div>
          <div class="task-header-actions">
            <span class="task-count-badge">{{ activeTasks.length }} tasks</span>
            <button class="btn-add-task" type="button" @click="showModal = true">+ Add</button>
          </div>
        </div>

        <div id="task-list-container">
          <!-- Active tasks grouped by priority -->
          <div class="eisen-category" v-for="group in groupDefs" :key="group.key">
            <div class="eisen-label" :class="group.labelClass">
              <span class="eisen-dot"></span>{{ group.title }}
              <span class="eisen-hint">{{ group.hint }}</span>
            </div>

            <draggable
              :list="groupedActiveTasks[group.key]"
              group="tasks"
              item-key="id"
              handle=".drag-handle"
              class="eisen-tasks"
              ghost-class="drag-ghost"
              chosen-class="drag-chosen"
              @end="onDragEnd"
            >
              <template #item="{ element: task }">
                <div class="task-item">
                  <span class="drag-handle" aria-hidden="true">⋮⋮</span>
                  <span class="task-num">{{ task.order }}</span>

                  <template v-if="editingId === task.id">
                    <input
                      v-model="editingText"
                      class="task-edit-input"
                      @keyup.enter="confirmEdit(task)"
                      @blur="confirmEdit(task)"
                      @keyup.escape="cancelEdit"
                    />
                  </template>
                  <template v-else>
                    <span class="task-text">{{ task.text }}</span>
                  </template>

                  <div class="task-actions">
                    <button class="task-btn" type="button" aria-label="Edit task" @click="startEdit(task)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                    <button class="task-btn danger" type="button" aria-label="Delete task" @click="deleteTask(task.id)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M6 6l1 16h10l1-16" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </template>
            </draggable>
          </div>

          <!-- Skipped tasks section -->
          <div class="skipped-section" v-if="skippedTasks.length > 0">
            <div class="skipped-label">
              <span class="skipped-dot"></span>SKIPPED
              <span class="eisen-hint">Move back to restore</span>
            </div>
            <div class="eisen-tasks">
              <div class="task-item task-item-skipped" v-for="task in skippedTasks" :key="task.id">
                <span class="task-text task-text-skipped">{{ task.text }}</span>
                <div class="task-actions">
                  <button class="btn-move-back" type="button" @click="moveBack(task)">
                    ↩ Move back
                  </button>
                  <button class="task-btn danger" type="button" aria-label="Delete task" @click="deleteTask(task.id)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M3 6h18" />
                      <path d="M8 6V4h8v2" />
                      <path d="M6 6l1 16h10l1-16" />
                      <path d="M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="btn-start-swipe" type="button" :disabled="activeTasks.length === 0" @click="startFocusMode">
          Start Focus Mode →
        </button>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="Add a task">
        <div class="modal-title">Add a Task</div>
        <div class="modal-sub">Tell us about this task so we can place it correctly.</div>

        <div class="modal-field">
          <label for="new-task-text">What's the task?</label>
          <input id="new-task-text" class="modal-input" v-model="newTaskText" type="text" placeholder="e.g. Reply to client email..." />
        </div>

        <div class="modal-field">
          <label>Is it important?</label>
          <div class="modal-toggle-row">
            <button type="button" class="modal-toggle" :class="{ selected: newTaskImportant }" @click="newTaskImportant = true">
              <div class="tgl-label">Yes</div>
              <div class="tgl-sub">Matters for goals/outcomes</div>
            </button>
            <button type="button" class="modal-toggle" :class="{ selected: !newTaskImportant }" @click="newTaskImportant = false">
              <div class="tgl-label">No</div>
              <div class="tgl-sub">Won't affect much</div>
            </button>
          </div>
        </div>

        <div class="modal-field">
          <label>Is it urgent?</label>
          <div class="modal-toggle-row">
            <button type="button" class="modal-toggle" :class="{ selected: newTaskUrgent }" @click="newTaskUrgent = true">
              <div class="tgl-label">Yes</div>
              <div class="tgl-sub">Needs to happen soon</div>
            </button>
            <button type="button" class="modal-toggle" :class="{ selected: !newTaskUrgent }" @click="newTaskUrgent = false">
              <div class="tgl-label">No</div>
              <div class="tgl-sub">Can wait a while</div>
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-modal-cancel" type="button" @click="showModal = false">Cancel</button>
          <button class="btn-modal-add" type="button" @click="addTask" :disabled="!newTaskText.trim()">Add Task</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import {
  guardWorkflowStep,
  unlockStep,
  getCurrentSession,
  addTaskToSession,
  deleteTaskFromSession,
  updateTaskInSession,
  reorderTasksInSession,
} from '../router/workflow'

const GROUP_ORDER = [
  'urgent-important',
  'not-urgent-important',
  'urgent-not-important',
  'not-urgent-not-important',
]

export default {
  name: 'PlannerView',
  components: { draggable },
  data() {
    return {
      sessionId: null,
      tasks: [],
      showModal: false,
      newTaskText: '',
      newTaskImportant: true,
      newTaskUrgent: true,
      editingId: null,
      editingText: '',
    }
  },
  computed: {
    // pending + doing, sorted by order
    activeTasks() {
      return this.tasks
        .filter(t => t.status === 'pending' || t.status === 'doing')
        .sort((a, b) => a.order - b.order)
    },
    // skipped only — order is null
    skippedTasks() {
      return this.tasks.filter(t => t.status === 'skipped')
    },
    // active tasks split into four groups for vuedraggable
    groupedActiveTasks() {
      const grouped = {
        'urgent-important':         [],
        'not-urgent-important':     [],
        'urgent-not-important':     [],
        'not-urgent-not-important': [],
      }
      for (const task of this.activeTasks) {
        if (grouped[task.priorityGroup] !== undefined) {
          grouped[task.priorityGroup].push(task)
        }
      }
      return grouped
    },
    groupDefs() {
      return [
        { key: 'urgent-important',         title: 'DO FIRST',    hint: 'Important & Urgent',      labelClass: 'eisen-do'       },
        { key: 'not-urgent-important',     title: 'SCHEDULE',    hint: 'Important, Not Urgent',   labelClass: 'eisen-schedule' },
        { key: 'urgent-not-important',     title: 'DELEGATE',    hint: 'Urgent, Not Important',   labelClass: 'eisen-delegate' },
        { key: 'not-urgent-not-important', title: 'MAYBE LATER', hint: 'Not Urgent or Important', labelClass: 'eisen-maybe'    },
      ]
    },
  },
  mounted() {
    guardWorkflowStep(2, this.$router)
    this._loadFromSession()
  },
  methods: {
    // ── Load ─────────────────────────────────────────────────────────────────
    _loadFromSession() {
      const session = getCurrentSession()
      if (!session) return

      this.sessionId = session.sessionId

      // Normalize order on every page load
      // active tasks: reorder 1-N, skipped tasks: order set to null
      const allTasks     = session.tasks ?? []
      const activeTasks  = allTasks
        .filter(t => t.status === 'pending' || t.status === 'doing')
        .sort((a, b) => a.order - b.order)
      const skippedTasks = allTasks.filter(t => t.status === 'skipped')

      reorderTasksInSession(this.sessionId, [...activeTasks, ...skippedTasks])

      // Read normalized data back from localStorage
      const updated = getCurrentSession()
      this.tasks = updated?.tasks ?? []

      const active  = this.activeTasks.length
      const skipped = this.skippedTasks.length
      console.log(`[Planner] Tasks loaded: ${this.tasks.length} tasks (${active} active, ${skipped} skipped)`)
      console.log('[Planner] localStorage session:', JSON.parse(localStorage.getItem('onestep-current-session')))
    },

    // ── Edit ─────────────────────────────────────────────────────────────────
    startEdit(task) {
      this.editingId   = task.id
      this.editingText = task.text
    },
    cancelEdit() {
      this.editingId   = null
      this.editingText = ''
    },
    confirmEdit(task) {
      if (this.editingId !== task.id) return
      const text = (this.editingText ?? '').trim()
      if (!text) { this.cancelEdit(); return }

      updateTaskInSession(this.sessionId, task.id, { text })
      console.log(`[Planner] Task edited: "${text}"`)
      this._loadFromSession()
      this.cancelEdit()
    },

    // ── Delete ────────────────────────────────────────────────────────────────
    deleteTask(taskId) {
      deleteTaskFromSession(this.sessionId, taskId)
      console.log(`[Planner] Task deleted → reordered: ${this.activeTasks.length - 1} active tasks`)
      this._loadFromSession()
    },

    // ── Add ───────────────────────────────────────────────────────────────────
    addTask() {
      const text = (this.newTaskText ?? '').trim()
      if (!text) return

      const priorityGroup =
        this.newTaskImportant  && this.newTaskUrgent  ? 'urgent-important'
        : this.newTaskImportant && !this.newTaskUrgent ? 'not-urgent-important'
        : !this.newTaskImportant && this.newTaskUrgent ? 'urgent-not-important'
        :                                                'not-urgent-not-important'

      addTaskToSession(this.sessionId, text, priorityGroup)

      // reorder all tasks' order to ensure consistency
      const session      = getCurrentSession()
      const allTasks     = session?.tasks ?? []
      const activeTasks  = allTasks
        .filter(t => t.status === 'pending' || t.status === 'doing')
        .sort((a, b) => a.order - b.order)
      const skippedTasks = allTasks.filter(t => t.status === 'skipped')
      reorderTasksInSession(this.sessionId, [...activeTasks, ...skippedTasks])

      console.log(`[Planner] Task added → reordered: ${activeTasks.length} tasks`)
      this._loadFromSession()

      this.newTaskText      = ''
      this.newTaskImportant = true
      this.newTaskUrgent    = true
      this.showModal        = false
    },

    // ── Drag ──────────────────────────────────────────────────────────────────
    onDragEnd() {
      // Rebuild ordered array from four group arrays
      // Update priorityGroup to match the group the task was dropped into
      const reorderedActive = GROUP_ORDER.flatMap(groupKey =>
        this.groupedActiveTasks[groupKey].map(t => ({
          ...t,
          priorityGroup: groupKey,
        }))
      )

      // Append skipped tasks — reorderTasksInSession will set their order to null
      const withSkipped = [...reorderedActive, ...this.skippedTasks]

      reorderTasksInSession(this.sessionId, withSkipped)
      console.log(`[Planner] Drag ended → reordered: ${reorderedActive.length} active tasks`)
      this._loadFromSession()
    },

    // ── Move back ─────────────────────────────────────────────────────────────
    moveBack(task) {
      // Step 1: restore status to pending
      updateTaskInSession(this.sessionId, task.id, { status: 'pending' })

      // Step 2: get fresh session state
      const session  = getCurrentSession()
      const allTasks = session?.tasks ?? []

      // Step 3: active tasks excluding the moved-back one
      const activeWithout = allTasks
        .filter(t => (t.status === 'pending' || t.status === 'doing') && t.id !== task.id)
        .sort((a, b) => a.order - b.order)

      // Step 4: insert moved-back task at end of its priorityGroup
      const reorderedActive = GROUP_ORDER.flatMap(groupKey => {
        const groupItems = activeWithout.filter(t => t.priorityGroup === groupKey)
        if (groupKey === task.priorityGroup) {
          return [...groupItems, { ...task, status: 'pending' }]
        }
        return groupItems
      })

      // Remaining skipped tasks (excluding the one just moved back)
      const remainingSkipped = allTasks.filter(
        t => t.status === 'skipped' && t.id !== task.id
      )

      reorderTasksInSession(this.sessionId, [...reorderedActive, ...remainingSkipped])
      console.log(`[Planner] Move back: "${task.text}" → ${task.priorityGroup}`)
      this._loadFromSession()
    },

    // ── Start Focus Mode ──────────────────────────────────────────────────────
    startFocusMode() {
      if (this.activeTasks.length === 0) return

      // Reset any 'doing' tasks back to 'pending' before entering Focus mode
      for (const task of this.activeTasks) {
        if (task.status === 'doing') {
          updateTaskInSession(this.sessionId, task.id, { status: 'pending' })
        }
      }

      console.log(`[Planner] Start Focus Mode: ${this.activeTasks.length} active tasks`)
      unlockStep(3)
      this.$router.push({ name: 'TaskSwipper' })
    },
  },
}
</script>

<style scoped>
.planner-page {
  --sand-100: #fdf6f0;
  --sand-200: #f5e8d8;
  --terracotta: #c1714f;
  --terracotta-dark: #a05840;
  --brown-dark: #2d1f14;
  --brown-mid: #5c3d28;
  --brown-text: #3d2a1a;
  --blue-timer: #7baec8;
  --radius-btn: 50px;
  --shadow-card: 0 8px 40px rgba(193, 113, 79, 0.13);

  max-width: 860px;
  margin: 0 auto;
  padding: 90px 24px 40px;
}

.workspace-panel {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.panel-header-band {
  background: linear-gradient(120deg, #c8a888 0%, #dbbfa0 100%);
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.phb-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(253, 246, 240, 0.7);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 22px rgba(45, 31, 20, 0.09);
}

.phb-icon svg {
  width: 28px;
  height: 28px;
  color: var(--brown-dark);
}

.phb-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 4px;
  margin-top: 2px;
}

.phb-desc {
  font-size: 13.5px;
  color: rgba(45, 31, 20, 0.65);
  line-height: 1.5;
}

.panel-card {
  background: white;
  border-radius: 0 0 20px 20px;
  padding: 28px 36px 36px;
}

.panel-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 6px;
}

.panel-sub {
  font-size: 13.5px;
  color: rgba(45, 31, 20, 0.5);
  margin-bottom: 0;
}

.task-list-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}

.task-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-count-badge {
  background: rgba(193, 113, 79, 0.1);
  color: var(--terracotta);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.btn-add-task {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1.5px solid rgba(193, 113, 79, 0.35);
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: var(--terracotta);
  transition: all 0.2s;
  font: inherit;
}

.btn-add-task:hover { background: rgba(193, 113, 79, 0.07); }

/* ── Eisenhower groups ───────────────────────────────────────────────────── */
.eisen-category { margin-bottom: 20px; }

.eisen-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  padding: 0 4px;
}

.eisen-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.eisen-hint {
  font-size: 10px;
  font-weight: 400;
  opacity: 0.6;
  text-transform: none;
  letter-spacing: 0;
}

.eisen-do       { color: #c1714f; }            .eisen-do .eisen-dot       { background: #c1714f; }
.eisen-schedule { color: var(--blue-timer); }  .eisen-schedule .eisen-dot { background: var(--blue-timer); }
.eisen-delegate { color: #b89470; }            .eisen-delegate .eisen-dot { background: #b89470; }
.eisen-maybe    { color: rgba(45,31,20,0.4); } .eisen-maybe .eisen-dot    { background: rgba(45,31,20,0.25); }

.eisen-tasks {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 36px;
}

/* ── Task item ───────────────────────────────────────────────────────────── */
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff7f1;
  border-radius: 12px;
  padding: 14px 16px;
  border: 1.5px solid rgba(193, 113, 79, 0.18);
}

.drag-handle {
  color: rgba(45,31,20,0.25);
  font-size: 14px;
  cursor: grab;
  user-select: none;
}

.drag-handle:active { cursor: grabbing; }

.drag-ghost {
  opacity: 0.4;
  background: rgba(193, 113, 79, 0.08);
  border: 1.5px dashed var(--terracotta);
}

.drag-chosen {
  box-shadow: 0 8px 24px rgba(193, 113, 79, 0.25);
  transform: scale(1.01);
}

.task-num {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: rgba(193,113,79,0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: var(--terracotta);
  flex-shrink: 0;
}

.task-text {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--brown-text);
}

.task-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.task-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(45,31,20,0.65);
  transition: background 0.15s, color 0.15s;
  font: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.task-btn svg { width: 18px; height: 18px; }
.task-btn:hover { background: rgba(193,113,79,0.08); color: var(--terracotta); }
.task-btn.danger:hover { background: rgba(232,139,139,0.12); color: #e07878; }

.task-edit-input {
  flex: 1;
  border: 1.5px solid rgba(193,113,79,0.25);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  outline: none;
}

.task-edit-input:focus { border-color: var(--terracotta); }

/* ── Skipped section ─────────────────────────────────────────────────────── */
.skipped-section {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1.5px dashed rgba(45, 31, 20, 0.12);
}

.skipped-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
  padding: 0 4px;
  color: rgba(45, 31, 20, 0.35);
}

.skipped-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(45, 31, 20, 0.2);
  flex-shrink: 0;
}

.task-item-skipped {
  background: rgba(45, 31, 20, 0.03);
  border-color: rgba(45, 31, 20, 0.1);
  opacity: 0.75;
}

.task-text-skipped {
  color: rgba(45, 31, 20, 0.45);
  text-decoration: line-through;
}

.btn-move-back {
  background: none;
  border: 1.5px solid rgba(193, 113, 79, 0.3);
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--terracotta);
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-move-back:hover {
  background: rgba(193, 113, 79, 0.08);
  border-color: var(--terracotta);
}

/* ── Start Focus Mode ────────────────────────────────────────────────────── */
.btn-start-swipe {
  width: 100%;
  padding: 15px;
  border-radius: var(--radius-btn);
  background: var(--brown-dark);
  color: var(--sand-100);
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  font: inherit;
  margin-top: 24px;
}

.btn-start-swipe:hover:not(:disabled) {
  background: var(--brown-mid);
  transform: translateY(-2px);
}

.btn-start-swipe:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Modal ───────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 250;
  background: rgba(45,31,20,0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-card {
  background: white;
  border-radius: 24px;
  padding: 36px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 24px 80px rgba(45,31,20,0.25);
}

.modal-title { font-size: 22px; font-weight: 800; color: var(--brown-dark); margin-bottom: 6px; }
.modal-sub   { font-size: 13px; color: rgba(45,31,20,0.5); margin-bottom: 24px; }
.modal-field { margin-bottom: 20px; }
.modal-field label { display: block; font-size: 14px; font-weight: 700; margin-bottom: 10px; color: var(--brown-text); }

.modal-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(193,113,79,0.55);
  border-radius: 14px;
  font: inherit;
  outline: none;
}

.modal-toggle-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.modal-toggle {
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid rgba(193,113,79,0.18);
  background: #fff7f1;
  cursor: pointer;
  font: inherit;
  text-align: center;
}

.modal-toggle.selected { border-color: rgba(193,113,79,0.7); background: rgba(193,113,79,0.08); }
.tgl-label { font-weight: 800; color: var(--brown-dark); margin-bottom: 6px; }
.tgl-sub   { font-size: 12px; color: rgba(45,31,20,0.45); }

.modal-actions { display: flex; gap: 14px; margin-top: 10px; }

.btn-modal-cancel {
  flex: 1;
  padding: 14px;
  border-radius: var(--radius-btn);
  border: 2px solid rgba(193,113,79,0.2);
  background: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.btn-modal-add {
  flex: 2;
  padding: 14px;
  border-radius: var(--radius-btn);
  border: none;
  background: var(--terracotta);
  color: white;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.btn-modal-add:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 520px) {
  .planner-page { padding: 90px 16px 40px; }
  .panel-card   { padding: 24px 18px 24px; }
  .modal-card   { padding: 24px 18px; }
}
</style>
