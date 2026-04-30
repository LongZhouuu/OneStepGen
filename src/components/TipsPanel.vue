<template>
  <section class="tips-panel">
    <header class="tp-header">
      <button
        v-if="selectedState"
        class="tp-back"
        type="button"
        @click="backToStates"
        aria-label="Back to states"
      >
        <i class="bi bi-arrow-left"></i>
      </button>
      <div v-else class="tp-title">
        <i class="bi bi-lightbulb"></i>
        <h2>Quick Tactics</h2>
      </div>
      <button class="tp-close" type="button" @click="$emit('close')" aria-label="Close panel">×</button>
    </header>

    <Transition name="tp-fade" mode="out-in">
      <!-- State picker -->
      <div v-if="!selectedState" key="picker" class="tp-picker">
        <h3 class="tp-prompt">What's blocking you on this task?</h3>
        <p class="tp-prompt-sub">Pick what fits right now.</p>

        <ul class="tp-states">
          <li v-for="state in states" :key="state.key">
            <button
              class="tp-state"
              type="button"
              @click="selectState(state.key)"
            >
              <span class="tp-state-icon" aria-hidden="true">
                <i :class="state.icon"></i>
              </span>
              <span class="tp-state-label">{{ state.label }}</span>
              <span class="tp-state-arrow" aria-hidden="true">></span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Tip card -->
      <div v-else key="tip" class="tp-tip-view">
        <p class="tp-state-context">
          <span class="tp-state-icon-sm" aria-hidden="true">
            <i :class="currentStateIconClass"></i>
          </span>
          {{ currentStateLabel }}
        </p>

        <Transition name="tp-card" mode="out-in">
          <article v-if="currentTip" :key="currentTip.id" class="tp-tip-card">
            <h3 class="tp-tip-title">{{ currentTip.title }}</h3>
            <p class="tp-tip-body">{{ currentTip.body }}</p>
          </article>
        </Transition>

        <div class="tp-actions">
          <button
            v-if="currentTips.length > 1"
            class="tp-try-another"
            type="button"
            @click="tryAnother"
          >
            Try another
            <i class="bi bi-arrow-clockwise"></i>
          </button>
          <button class="tp-pick-other" type="button" @click="backToStates">
            Pick another state
          </button>
        </div>

        <button class="tp-handoff" type="button" @click="handoffToBreathing">
          Still too heavy? Take a breath instead
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { tipsData } from '@/data/tips.js'

const emit = defineEmits(['close'])

const states = [
  { key: 'cantStart', label: "Can't Start", icon: 'bi bi-door-open' },
  { key: 'distracted', label: 'Distracted', icon: 'bi bi-broadcast' },
  { key: 'overwhelmed', label: 'Overwhelmed', icon: 'bi bi-water' },
  { key: 'tired', label: 'Tired', icon: 'bi bi-battery-low' },
  { key: 'avoiding', label: 'Avoiding It', icon: 'bi bi-sign-stop' },
  { key: 'givingUp', label: 'Want to Give Up', icon: 'bi bi-cloud-drizzle' },
]

const selectedState = ref(null)
const tipIndex = ref(0)

const currentTips = computed(() => {
  if (!selectedState.value) return []
  return tipsData[selectedState.value]?.tips ?? []
})

const currentTip = computed(() => currentTips.value[tipIndex.value] ?? null)

const currentStateLabel = computed(() => {
  if (!selectedState.value) return ''
  return tipsData[selectedState.value]?.label ?? ''
})

const currentStateIconClass = computed(() => {
  return states.find((s) => s.key === selectedState.value)?.icon ?? ''
})

function selectState(key) {
  selectedState.value = key
  const tips = tipsData[key]?.tips ?? []
  tipIndex.value = tips.length > 0 ? Math.floor(Math.random() * tips.length) : 0
}

function tryAnother() {
  const total = currentTips.value.length
  if (total <= 1) return
  let next = tipIndex.value
  while (next === tipIndex.value) {
    next = Math.floor(Math.random() * total)
  }
  tipIndex.value = next
}

function backToStates() {
  selectedState.value = null
  tipIndex.value = 0
}

// Soft handoff: when a productivity tip isn't enough (user feels overwhelmed/tired),
// hand off to the global SupportModal and skip its menu by jumping straight to Box Breathing.
// App.vue listens for this 'open-support' event and reads detail.view to decide which view to show.
function handoffToBreathing() {
  window.dispatchEvent(
    new CustomEvent('open-support', { detail: { view: 'breathing' } })
  )
  emit('close')
}
</script>

<style scoped>
.tips-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: inherit;
  color: #2f2f2f;
  padding: 4px 6px 0;
  box-sizing: border-box;
}

.tp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-shrink: 0;
  min-height: 28px;
}

.tp-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tp-title i {
  font-size: 18px;
  color: #5c7d94;
}

.tp-title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #2f2f2f;
}

.tp-back,
.tp-close {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #7fb3c9;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.18s ease, color 0.18s ease;
}

.tp-back i {
  font-size: 16px;
}

.tp-close {
  font-size: 24px;
  font-weight: 600;
}

.tp-back:hover,
.tp-close:hover {
  background: rgba(83, 114, 134, 0.14);
  color: #49707c;
}

.tp-picker {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(83, 114, 134, 0.35) transparent;
}

.tp-picker::-webkit-scrollbar {
  width: 6px;
}

.tp-picker::-webkit-scrollbar-thumb {
  background: rgba(83, 114, 134, 0.35);
  border-radius: 6px;
}

.tp-prompt {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #2f2f2f;
}

.tp-prompt-sub {
  margin: 2px 0 12px;
  font-size: 13px;
  color: #8a7d75;
}

.tp-states {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tp-state {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #eef5fb;
  border: 1.5px solid rgba(83, 114, 134, 0.22);
  border-radius: 12px;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 600;
  color: #2f2f2f;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease;
  text-align: left;
}

.tp-state:hover {
  background: #dfeefa;
  border-color: rgba(83, 114, 134, 0.5);
  box-shadow: 0 4px 12px rgba(91, 127, 138, 0.16);
}

.tp-state:active {
  transform: scale(0.98);
}

.tp-state-icon {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
  width: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tp-state-label {
  flex: 1;
}

.tp-state-arrow {
  color: #7fb3c9;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
}

.tp-tip-view {
  flex: 1;
  /* min-height: 0; */
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;  
}

.tp-state-context {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px;
  font-size: 12.5px;
  font-weight: 700;
  color: #7fb3c9;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.tp-state-icon-sm {
  font-size: 13px;
  line-height: 1;
  width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tp-tip-card {
  flex: 0 0 auto;
  min-height: 160px;
  max-width: 100%;
  
  background: linear-gradient(135deg, #f4f9ff 0%, #dfeefa 100%);
  border: 1.5px solid rgba(83, 114, 134, 0.22);
  border-radius: 16px;

  padding: 22px 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  box-shadow: 0 6px 18px rgba(83, 114, 134, 0.14);
}

.tp-tip-title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 800;
  color: #2f2f2f;
  line-height: 1.25;
}

.tp-tip-body {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.6;
  color: #5a4f47;
}

.tp-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
  flex-shrink: 0;
}

.tp-try-another,
.tp-pick-other {
  padding: 10px 14px;
  border-radius: 10px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease,
    transform 0.12s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.tp-try-another {
  flex: 1;
  background: #7fb3c9;
  color: #fff;
  border: none;
}

.tp-try-another:hover {
  background: #49707c;
}

.tp-try-another:active {
  transform: scale(0.97);
}

.tp-pick-other {
  background: #ffffff;
  color: #7fb3c9;
  border: 1.5px solid rgba(83, 114, 134, 0.32);
}

.tp-pick-other:hover {
  border-color: #7fb3c9;
  background: #f4f9ff;
}

.tp-handoff {
  margin-top: 10px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: #7fb3c9;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  align-self: center;
  border-radius: 8px;
  transition: background 0.18s ease, color 0.18s ease;
}

.tp-handoff:hover {
  background: rgba(83, 114, 134, 0.1);
  color: #3f5f69;
}

.tp-handoff i {
  font-size: 14px;
  transition: transform 0.18s ease;
}

.tp-handoff:hover i {
  transform: translateX(2px);
}

/* Transitions */
.tp-fade-enter-active,
.tp-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.tp-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.tp-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.tp-card-enter-active,
.tp-card-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.tp-card-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.tp-card-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
