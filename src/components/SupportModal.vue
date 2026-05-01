<template>
  <div class="support-overlay" @click.self="emit('close')">
    <div
      ref="modalRef"
      class="support-modal"
      :class="{ 'support-modal--wide': currentView === 'quiet' }"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <h2 id="support-modal-title" class="sr-only">Support tools</h2>

      <button
        ref="closeButtonRef"
        type="button"
        class="btn-close"
        aria-label="Close support tools"
        @click="emit('close')"
        style="position: absolute; top: 18px; right: 18px;"
      ></button>

      <component
        :is="currentComponent"
        @goBox="currentView = 'breathing'"
        @goRainbow="currentView = 'rainbow'"
        @goHelpline="currentView = 'helpline'"
        @goQuiet="currentView = 'quiet'"
        @back="currentView = 'menu'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'

import SupportMenu from './SupportMenu.vue'
import BoxBreathingPanel from './BoxBreathingPanel.vue'
import RainbowPanel from './RainbowPanel.vue'
import HelplinePanel from './HelplinePanel.vue'
import QuietPlacesPanel from './QuietPlacesPanel.vue'

const emit = defineEmits(['close'])

const props = defineProps({
  initialView: {
    type: String,
    default: 'menu',
  },
})

const currentView = ref(props.initialView)
const modalRef = ref(null)
const closeButtonRef = ref(null)

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'breathing':
      return BoxBreathingPanel
    case 'rainbow':
      return RainbowPanel
    case 'helpline':
      return HelplinePanel
    case 'quiet':
      return QuietPlacesPanel
    default:
      return SupportMenu
  }
})

function getFocusableElements() {
  return Array.from(modalRef.value?.querySelectorAll(focusableSelector) ?? [])
    .filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null)
}

function focusInitialElement() {
  nextTick(() => {
    closeButtonRef.value?.focus()
  })
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }

  if (event.key !== 'Tab') return

  const focusableElements = getFocusableElements()

  if (focusableElements.length === 0) {
    event.preventDefault()
    modalRef.value?.focus()
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

onMounted(() => {
  document.body.classList.add('support-modal-open')
  focusInitialElement()
})

onUnmounted(() => {
  document.body.classList.remove('support-modal-open')
})

watch(currentView, focusInitialElement)
</script>

<style scoped>
.support-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .18);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.support-modal {
  width: 520px;
  max-width: 92%;
  background: white;
  border-radius: 28px;
  padding: 34px;
  position: relative;
}

.support-modal--wide {
  width: min(1100px, 94vw);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.btn-close:focus-visible {
  outline: 3px solid #4d2a1d;
  outline-offset: 4px;
}

:global(body.support-modal-open) {
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .support-overlay,
  .support-modal,
  .btn-close {
    transition: none;
  }
}
</style>
