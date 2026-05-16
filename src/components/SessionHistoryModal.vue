<template>
  <!-- Main history list -->
  <div
    v-if="modelValue && !pendingDelete"
    class="shm-overlay"
    role="presentation"
    @click.self="close"
  >
    <div
      class="shm-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shm-title"
    >
      <div class="shm-head">
        <h2 id="shm-title" class="shm-title">Session History</h2>
        <button type="button" class="shm-close" aria-label="Close" @click="close">
          ✕
        </button>
      </div>

      <div v-if="entries.length === 0" class="shm-empty">
        No history yet. Save a task plan to get started.
      </div>

      <ul v-else class="shm-list" aria-label="Saved sessions">
        <li v-for="item in entries" :key="item.id" class="shm-item">
          <div class="shm-item-card">
            <div class="shm-item-header">
              <button
                type="button"
                class="shm-item-toggle"
                :aria-expanded="expandedHistoryId === item.id"
                :aria-controls="`shm-panel-${item.id}`"
                @click="toggleExpand(item.id)"
              >
                <span class="shm-chevron" :class="{ open: expandedHistoryId === item.id }" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
                <span class="shm-toggle-text">
                  <span class="shm-row-label">{{ item.label }}</span>
                  <span class="shm-row-meta">{{ formatDate(item.createdAt) }}</span>
                </span>
              </button>
              <button
                type="button"
                class="shm-row-delete"
                :aria-label="`Delete ${item.label}`"
                @click.stop="pendingDelete = item"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M6 6l1 16h10l1-16" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>

            <div
              :id="`shm-panel-${item.id}`"
              class="shm-item-panel"
              :class="{ open: expandedHistoryId === item.id }"
            >
              <div class="shm-detail-head">{{ detailHeading(item) }}</div>
              <p class="shm-detail-body">{{ detailBody(item) }}</p>
              <button type="button" class="shm-use-btn" @click="useHistorySession(item)">
                Continue to Focus →
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <!-- Delete confirmation (stacked above dimmed list) -->
  <div
    v-if="modelValue && pendingDelete"
    class="shm-overlay shm-overlay--confirm"
    role="presentation"
    @click.self="cancelDelete"
  >
    <div class="shm-confirm-card" role="alertdialog" aria-labelledby="shm-delete-title">
      <p id="shm-delete-title" class="shm-confirm-text">
        Delete "{{ pendingDelete.label }}"? This cannot be undone.
      </p>
      <div class="shm-confirm-actions">
        <button type="button" class="shm-btn shm-btn-cancel" @click="cancelDelete">
          Cancel
        </button>
        <button type="button" class="shm-btn shm-btn-danger" @click="confirmDelete">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getTaskHistory, deleteHistoryItem, loadSessionFromHistory } from '@/router/workflow'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const entries = ref([])
const pendingDelete = ref(null)
/** Which history row is expanded (accordion: one at a time). */
const expandedHistoryId = ref(null)

function refreshList() {
  entries.value = getTaskHistory()
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      pendingDelete.value = null
      expandedHistoryId.value = null
      refreshList()
    }
  },
)

function toggleExpand(id) {
  expandedHistoryId.value = expandedHistoryId.value === id ? null : id
}

function close() {
  pendingDelete.value = null
  expandedHistoryId.value = null
  emit('update:modelValue', false)
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return String(iso)
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function detailHeading(item) {
  return item.inputType === 'pdf' ? 'PDF file' : 'Original text'
}

/** Full saved source shown only when the row is expanded. */
function detailBody(item) {
  if (item.inputType === 'pdf') {
    return item.pdfFileName?.trim() || '—'
  }
  const t = String(item.input ?? '').trim()
  return t || '—'
}

/** Load snapshot into a fresh session and open the swiper step. */
function useHistorySession(item) {
  loadSessionFromHistory(item)
  emit('update:modelValue', false)
  router.push({ name: 'TaskSwipper' })
}

function confirmDelete() {
  if (!pendingDelete.value) return
  const deletedId = pendingDelete.value.id
  deleteHistoryItem(deletedId)
  pendingDelete.value = null
  if (expandedHistoryId.value === deletedId) {
    expandedHistoryId.value = null
  }
  refreshList()
}

function cancelDelete() {
  pendingDelete.value = null
}
</script>

<style scoped>
.shm-overlay {
  position: fixed;
  inset: 0;
  z-index: 320;
  background: rgba(45, 31, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.shm-overlay--confirm {
  z-index: 330;
  background: rgba(45, 31, 20, 0.55);
}

.shm-card {
  width: 100%;
  max-width: 420px;
  max-height: min(72vh, 520px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(45, 31, 20, 0.18);
  overflow: hidden;
}

.shm-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid rgba(193, 113, 79, 0.15);
  background: linear-gradient(120deg, #fdf6f0 0%, #f5e8d8 100%);
}

.shm-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #2d1f14;
}

.shm-close {
  border: none;
  background: rgba(255, 255, 255, 0.7);
  width: 34px;
  height: 34px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: #5c3d28;
}

.shm-close:hover {
  background: rgba(193, 113, 79, 0.12);
  color: #c1714f;
}

.shm-empty {
  padding: 28px 20px;
  text-align: center;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(45, 31, 20, 0.55);
}

.shm-list {
  list-style: none;
  margin: 0;
  padding: 12px 14px 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shm-item {
  margin: 0;
}

.shm-item-card {
  border: 2px solid rgba(193, 113, 79, 0.42);
  border-radius: 14px;
  background: rgba(253, 246, 240, 0.85);
  box-shadow: 0 2px 10px rgba(45, 31, 20, 0.06);
  overflow: hidden;
}

.shm-item-header {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.shm-item-toggle {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 10px 12px 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition: background 0.15s;
}

.shm-item-toggle:hover {
  background: rgba(193, 113, 79, 0.07);
}

.shm-chevron {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  margin-top: 2px;
  color: rgba(45, 31, 20, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.22s ease;
}

.shm-chevron svg {
  width: 18px;
  height: 18px;
}

.shm-chevron.open {
  transform: rotate(180deg);
}

.shm-toggle-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.shm-row-label {
  font-weight: 700;
  font-size: 14px;
  color: #2d1f14;
  line-height: 1.25;
}

.shm-row-meta {
  font-size: 11px;
  font-weight: 600;
  color: rgba(45, 31, 20, 0.45);
}

.shm-item-panel {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.38s ease, opacity 0.22s ease;
}

.shm-item-panel.open {
  max-height: 520px;
  opacity: 1;
  border-top: 1px solid rgba(193, 113, 79, 0.22);
}

.shm-row-delete {
  flex-shrink: 0;
  width: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: rgba(45, 31, 20, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
  align-self: stretch;
}

.shm-row-delete:hover {
  color: #c0392b;
  background: rgba(192, 57, 43, 0.06);
}

.shm-row-delete svg {
  width: 20px;
  height: 20px;
}

.shm-detail-head {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(45, 31, 20, 0.48);
  padding: 12px 14px 6px;
}

.shm-detail-body {
  margin: 0;
  padding: 10px 14px 14px;
  font-size: 13px;
  line-height: 1.55;
  color: #3d2a1a;
  white-space: pre-wrap;
  word-break: break-word;
}

.shm-use-btn {
  width: calc(100% - 28px);
  margin: 0 14px 14px;
  padding: 11px 14px;
  border-radius: 999px;
  border: none;
  background: #c1714f;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.shm-use-btn:hover {
  background: #a05840;
  transform: translateY(-1px);
}

.shm-confirm-card {
  width: 100%;
  max-width: 360px;
  background: #fff;
  border-radius: 14px;
  padding: 22px 20px;
  box-shadow: 0 16px 48px rgba(45, 31, 20, 0.2);
}

.shm-confirm-text {
  margin: 0 0 18px;
  font-size: 15px;
  line-height: 1.5;
  color: #2d1f14;
}

.shm-confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.shm-btn {
  padding: 8px 16px;
  border-radius: 10px;
  font: inherit;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  border: none;
}

.shm-btn-cancel {
  background: rgba(45, 31, 20, 0.08);
  color: #5c3d28;
}

.shm-btn-cancel:hover {
  background: rgba(45, 31, 20, 0.12);
}

.shm-btn-danger {
  background: #c0392b;
  color: #fff;
}

.shm-btn-danger:hover {
  background: #a93226;
}
</style>
