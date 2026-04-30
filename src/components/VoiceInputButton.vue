<template>
  <button
    class="voice-input-button"
    :class="{ listening: isListening }"
    type="button"
    :aria-label="buttonLabel"
    :title="buttonLabel"
    :disabled="!isSupported || isListening"
    @mousedown.prevent
    @click="startListening"
  >
    <svg
      class="voice-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
      <path d="M8 22h8" />
    </svg>
  </button>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  ariaLabel: {
    type: String,
    default: 'Start voice input',
  },
  language: {
    type: String,
    default: 'en-AU',
  },
})

const emit = defineEmits(['transcript', 'error'])

const isListening = ref(false)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const isSupported = Boolean(SpeechRecognition)

const buttonLabel = computed(() => {
  if (!isSupported) return 'Voice input is not supported in this browser'
  return isListening.value ? 'Listening for voice input' : props.ariaLabel
})

function startListening() {
  if (!SpeechRecognition || isListening.value) return

  const recognition = new SpeechRecognition()
  recognition.lang = props.language
  recognition.interimResults = false
  recognition.continuous = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
    isListening.value = true
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0]?.transcript ?? '')
      .join(' ')
      .trim()

    if (transcript) {
      emit('transcript', transcript)
    }
  }

  recognition.onerror = (event) => {
    emit('error', event.error)
  }

  recognition.onend = () => {
    isListening.value = false
  }

  recognition.start()
}
</script>

<style scoped>
.voice-input-button {
  width: 36px;
  height: 36px;
  border: 1.5px solid rgba(193, 113, 79, 0.28);
  border-radius: 999px;
  background: #fff;
  color: #b66a48;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.voice-input-button:hover:not(:disabled),
.voice-input-button:focus-visible {
  background: rgba(193, 113, 79, 0.08);
  border-color: rgba(193, 113, 79, 0.75);
  color: #a05840;
}

.voice-input-button:focus-visible {
  outline: 3px solid rgba(45, 31, 20, 0.8);
  outline-offset: 3px;
}

.voice-input-button.listening {
  background: #b66a48;
  border-color: #b66a48;
  color: #fff;
  box-shadow: 0 0 0 5px rgba(182, 106, 72, 0.16);
}

.voice-input-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.voice-icon {
  width: 18px;
  height: 18px;
}

@media (prefers-reduced-motion: reduce) {
  .voice-input-button {
    transition: none;
  }
}
</style>
