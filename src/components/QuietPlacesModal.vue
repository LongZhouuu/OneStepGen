<template>
  <Teleport to="body">
    <div class="quiet-places-overlay" @click.self="emit('close')">
      <div
        ref="modalRef"
        class="quiet-places-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiet-places-modal-title"
        tabindex="-1"
        @keydown="handleKeydown"
      >
        <h2 id="quiet-places-modal-title" class="sr-only">Melbourne CBD focus map</h2>

        <button
          ref="closeButtonRef"
          type="button"
          class="btn-close"
          aria-label="Close focus map"
          @click="emit('close')"
        ></button>

        <QuietPlacesPanel />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import QuietPlacesPanel from './QuietPlacesPanel.vue'

const emit = defineEmits(['close'])

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

function getFocusableElements() {
  return Array.from(modalRef.value?.querySelectorAll(focusableSelector) ?? []).filter(
    (element) => !element.hasAttribute('disabled') && element.offsetParent !== null,
  )
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
  document.body.classList.add('quiet-places-modal-open')
  focusInitialElement()
})

onUnmounted(() => {
  document.body.classList.remove('quiet-places-modal-open')
})
</script>

<style scoped>
.quiet-places-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 16px;
  box-sizing: border-box;
}

.quiet-places-modal {
  width: min(1100px, 94vw);
  max-height: min(92vh, 900px);
  overflow: auto;
  background: #fff;
  border-radius: 28px;
  padding: 34px;
  position: relative;
  box-sizing: border-box;
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

.btn-close {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 2;
}

.btn-close:focus-visible {
  outline: 3px solid #4d2a1d;
  outline-offset: 4px;
}

:global(body.quiet-places-modal-open) {
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .quiet-places-overlay,
  .quiet-places-modal,
  .btn-close {
    transition: none;
  }
}
</style>
