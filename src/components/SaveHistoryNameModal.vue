<template>
  <div
    v-if="modelValue"
    class="shnm-overlay"
    role="presentation"
    @click.self="close"
  >
    <div class="shnm-card" role="dialog" aria-modal="true" aria-labelledby="shnm-title">
      <h2 id="shnm-title" class="shnm-title">Save to History</h2>
      <p class="shnm-desc">Give this plan a name so you can open it again later.</p>

      <label class="shnm-label" for="shnm-input">Name</label>
      <input
        id="shnm-input"
        v-model="localName"
        type="text"
        class="shnm-input"
        maxlength="120"
        autocomplete="off"
        @keyup.enter="confirm"
      />

      <div class="shnm-actions">
        <button type="button" class="shnm-btn shnm-btn-close" @click="close">
          Close
        </button>
        <button
          type="button"
          class="shnm-btn shnm-btn-confirm"
          :disabled="!localName.trim()"
          @click="confirm"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  /** Prefill from sessionSource.historyName when opening */
  initialName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const localName = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      localName.value = props.initialName ?? ''
    }
  },
)

watch(
  () => props.initialName,
  () => {
    if (props.modelValue) {
      localName.value = props.initialName ?? ''
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

function confirm() {
  const name = localName.value.trim()
  if (!name) return
  emit('confirm', name)
}
</script>

<style scoped>
.shnm-overlay {
  position: fixed;
  inset: 0;
  z-index: 260;
  background: rgba(45, 31, 20, 0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.shnm-card {
  background: white;
  border-radius: 24px;
  padding: 28px 32px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 24px 80px rgba(45, 31, 20, 0.25);
}

.shnm-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  color: #2d1f14;
}

.shnm-desc {
  margin: 0 0 18px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(45, 31, 20, 0.55);
}

.shnm-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #5c3d28;
  margin-bottom: 8px;
}

.shnm-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(193, 113, 79, 0.28);
  font: inherit;
  font-size: 15px;
  color: #3d2a1a;
  margin-bottom: 22px;
  outline: none;
  transition: border-color 0.2s;
}

.shnm-input:focus {
  border-color: #c1714f;
}

.shnm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.shnm-btn {
  padding: 10px 20px;
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s, transform 0.2s;
}

.shnm-btn-close {
  background: rgba(45, 31, 20, 0.08);
  color: #5c3d28;
}

.shnm-btn-close:hover {
  background: rgba(45, 31, 20, 0.12);
}

.shnm-btn-confirm {
  background: #c1714f;
  color: #fff;
}

.shnm-btn-confirm:hover:not(:disabled) {
  background: #a05840;
  transform: translateY(-1px);
}

.shnm-btn-confirm:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
