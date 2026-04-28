<!-- RainbowPanel.vue -->
<template>
  <div ref="panelRef" class="panel" :class="{ 'exercise-mode': screen === 'exercise' }"
    :style="exerciseBackgroundStyle">
    <button v-if="screen !== 'exercise'" class="top-btn" @click="$emit('back')">
      ← Back
    </button>

    <button v-else class="top-btn stop-btn" @click="stopExercise">
      Stop
    </button>

    <!-- start -->
    <section v-if="screen === 'intro'" class="intro-view">
      <div class="title-row">
        <h2>Rainbow Grounding</h2>

        <button ref="popoverBtnRef" type="button" class="intro-popover-btn" data-bs-toggle="popover"
          data-bs-placement="right" data-bs-title="What is Rainbow Grounding?" data-bs-html="true" :data-bs-content="'Sometimes life is <strong>overwhelming</strong>, rainbow grounding is designed to help ' +
            '<strong>ground yourself</strong> in the <strong>present moment</strong>, so your attention returns to the present ' +
            'and bring you to a place of <strong>calm</strong>.<br><br>' +
            '<p class=&quot;quot&quot;>' +
            'To Write Love on Her Arms. (n.d.). <em>Rainbow walk grounding technique</em>[PDF]. ' +
            '<a href=&quot;https://twloha.com/content/files/rainbow-grounding-technique.pdf&quot; target=&quot;_blank&quot;>' +
            'https://twloha.com/content/files/rainbow-grounding-technique.pdf' +
            '</a>' +
            '</p>'" aria-label="Why this exercise?">
          <i class="bi bi-question-diamond"></i>
        </button>
      </div>

      <p class="sub">Reconnect with the present moment.</p>

      <button class="start-btn" @click="startRainbowExercise">
        Start
      </button>
    </section>

    <!-- grounding -->
    <section v-else-if="screen === 'exercise'" class="exercise-view" :style="{ color: exerciseTextColor }">
      <p class="round-label">
        {{ isInfiniteMode ? 'Free round' : `Round ${currentIndex + 1} of ${rainbowColors.length}` }}
      </p>

      <h2 class="color-title" v-html="isInfiniteMode
        ? 'Please find <strong>one object</strong> near you in <strong>this colour</strong>'
        : `Please find <strong>one object</strong> near you in <strong>${currentColor.name}</strong>`"></h2>

      <p class="instruction">
        Find an object near you that is this colour, or as close as possible.
      </p>

      <input v-model="answer" class="input" type="text"
        :placeholder="isInfiniteMode ? 'Type the object name...' : `Type the ${currentColor.name} object name...`"
        @keyup.enter="goNext" />

      <button class="next-btn" :disabled="!answer.trim()" @click="goNext"
        :title="!answer.trim() ? 'Please enter at least one object' : ''">
        Next
      </button>
    </section>

    <!-- complete -->
    <section v-else-if="screen === 'completed'" class="completed-view">
      <h2>You have completed one grounding exercise</h2>

      <p class="completed-text">
        Sometimes life is <strong>overwhelming</strong>, rainbow grounding is designed to help
        <strong>ground yourself</strong> in the <strong>present moment</strong>, so your attention returns to the
        present
        and bring you to a place of <strong>calm</strong>.<br><br>
      <p class='quot'>
        To Write Love on Her Arms. (n.d.). <em>Rainbow walk grounding technique</em>[PDF].
        <a href="https://twloha.com/content/files/rainbow-grounding-technique.pdf" target='_blank'>
          https://twloha.com/content/files/rainbow-grounding-technique.pdf
        </a>
      </p>
      </p>

      <p class="completed-question">
        Do you feel a little better?
      </p>

      <div class="actions">
        <button class="end-btn" @click="$emit('back')">
          End
        </button>

        <button class="continue-btn" @click="continueRandomRound">
          Continue to the next round
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { Popover } from 'bootstrap'

defineEmits(['back'])

const panelRef = ref(null)
const popoverBtnRef = ref(null)
let popoverInstance = null

onMounted(async () => {
  await nextTick()
  initPopover()
})

onBeforeUnmount(() => {
  disposePopover()
})

const screen = ref('intro')
// intro | exercise | completed

watch(screen, async (newScreen) => {
  if (newScreen === 'intro') {
    await nextTick()
    initPopover()
  } else {
    disposePopover()
  }
})

const currentIndex = ref(0)
const answer = ref('')
const isInfiniteMode = ref(false)
const currentRandomColor = ref(null)

const rainbowColors = [
  {
    name: 'red',
    hex: '#ff0000',
  },
  {
    name: 'orange',
    hex: '#ffa500',
  },
  {
    name: 'yellow',
    hex: '#ffff00',
  },
  {
    name: 'green',
    hex: '#008000',
  },
  {
    name: 'cyan',
    hex: '#00ffff',
  },
  {
    name: 'blue',
    hex: '#0000ff',
  },
  {
    name: 'purple',
    hex: '#800080',
  },
]

const currentColor = computed(() => {
  if (isInfiniteMode.value && currentRandomColor.value) {
    return currentRandomColor.value
  }

  return rainbowColors[currentIndex.value]
})

const exerciseBackgroundStyle = computed(() => {
  if (screen.value !== 'exercise') return {}

  return {
    backgroundColor: isInfiniteMode.value
      ? currentColor.value
      : currentColor.value.hex,
  }
})

const exerciseTextColor = computed(() => {
  if (screen.value !== 'exercise') return {}

  const hex = isInfiniteMode.value
    ? currentColor.value
    : currentColor.value.hex

  return getReadableTextColor(hex)
})

function initPopover() {
  if (!popoverBtnRef.value) return

  if (popoverInstance) {
    popoverInstance.dispose()
    popoverInstance = null
  }

  popoverInstance = new Popover(popoverBtnRef.value, {
    trigger: 'click',
    placement: 'right',
    container: panelRef.value,
  })
}

function disposePopover() {
  if (popoverInstance) {
    popoverInstance.dispose()
    popoverInstance = null
  }
}

// control text color by background color
function getReadableTextColor(hex) {
  const cleanHex = hex.replace('#', '')

  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)

  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 150 ? '#2f261f' : '#ffffff'
}

function startRainbowExercise() {
  disposePopover()

  isInfiniteMode.value = false
  currentRandomColor.value = null
  currentIndex.value = 0
  answer.value = ''
  screen.value = 'exercise'
}

function stopExercise() {
  screen.value = 'intro'
  currentIndex.value = 0
  answer.value = ''
  isInfiniteMode.value = false
  currentRandomColor.value = null
}

function goNext() {
  if (!answer.value.trim()) return

  answer.value = ''

  if (isInfiniteMode.value) {
    currentRandomColor.value = getRandomColor()
    return
  }

  if (currentIndex.value < rainbowColors.length - 1) {
    currentIndex.value++
  } else {
    screen.value = 'completed'
  }
}

function continueRandomRound() {
  isInfiniteMode.value = true
  currentRandomColor.value = getRandomColor()
  answer.value = ''
  screen.value = 'exercise'
}

function getRandomColor() {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')

  return `#${hex}`
}
</script>

<style scoped>
/* .intro-popover-wrap {
  margin-top: -18px;
  margin-bottom: 28px;
} */

.title-row {
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  gap: 8px;
}

.intro-popover-btn {
  /* width: 10px; */
  /* height: 10px; */
  /* border-radius: 50%; */
  border: none;
  background: transparent;
  color: #2f261f;

  display: flex;
  align-items: center;
  justify-content: center;

  /* font-size: ; */
  /* font-weight: 800; */
  /* line-height: 1; */
  /* padding: 0; */
  cursor: pointer;

  /* transform: translateY(-6px); */
  /* transition: all 0.2s ease; */
}

.intro-popover-btn:active {
  border: none;
}

/* .intro-popover-btn:hover {
  background: #2f261f;
  color: white;
} */

:deep(.quot) {
  font-size: 11px;
  /* color: red; */
  /* margin-bottom: 0; */
}

/* :deep(.popover) {
  z-index: 10000;
  border-radius: 14px;
} */
.panel {
  position: relative;
  min-height: 100%;
  padding: 10px 24px 28px;
  box-sizing: border-box;
  border-radius: 24px;
  transition: background-color 0.35s ease;
}

.exercise-mode {
  min-height: 520px;
  display: flex;
  flex-direction: column;

  width: calc(100% - 48px);
  margin: 0 auto;
}

.top-btn {
  border: none;
  background: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  margin-bottom: 18px;
  font-size: 15px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #3f352c;
}

.stop-btn {
  background: rgba(255, 255, 255, 0.75);
  font-weight: 700;
  transition: all .3s;
  border: 1px rgba(0, 0, 0, 0.75) solid;
}

.stop-btn:hover {
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  border: 1px rgb(255, 255, 255, 0.75) solid;
}

.intro-view,
.completed-view {
  padding-top: 20px;
}

h2 {
  margin: 0;
  font-size: 28px;
  color: #2f261f;
}

.sub {
  color: #7b6a5c;
  margin-top: 10px;
  margin-bottom: 32px;
}

.start-btn,
.next-btn,
.end-btn,
.continue-btn {
  border: none;
  cursor: pointer;
  border-radius: 16px;
  /* font-weight: 700; */
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.start-btn {
  width: 100%;
  padding: 8px 16px;
  background: white;
  color: #b66a48;
  font-size: 16px;
  font-weight: bold;
  transition: all .3s;
  border: 1px solid #b66a48;
}

.exercise-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 420px;
  text-align: center;
}

.round-label {
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 700;
  color: currentColor;
  opacity: 0.72;
}

.color-title {
  font-size: 34px;
  line-height: 1.15;
  color: currentColor;
}

.instruction {
  max-width: 360px;
  margin: 18px auto 26px;
  color: currentColor;
  opacity: 0.78;
  line-height: 1.5;
}

.input {
  width: 100%;
  padding: 15px 16px;
  border-radius: 16px;
  border: 1px solid rgba(47, 38, 31, 0.18);
  box-sizing: border-box;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.78);
  outline: none;
}

.input:focus {
  border-color: rgba(47, 38, 31, 0.45);
}

.next-btn {
  width: 24%;
  margin-top: 20px;
  padding: 10px;
  background: black;
  color: #fff;
  font-size: 16px;
}

.next-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.completed-text {
  margin-top: 20px;
  color: #6f5d50;
  line-height: 1.7;
}

.completed-question {
  margin-top: 18px;
  font-weight: 700;
  color: #2f261f;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
}

.end-btn,
.continue-btn {
  /* flex: 1; */
  min-width: 14vw;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: bold;
}

.end-btn {
  background: white;
  color: #b66a48;
  transition: all .3s;
  border: 1px #b66a48 solid;
}

.continue-btn {
  background: #b66a48;
  color: #fff;
  border: 1px #b66a48 solid;
  transition: all .3s;
}

.start-btn:hover {
  background-color: #b66a48;
  color: white;
  border: 1px #b66a48 solid;
}

.end-btn:hover {
  background-color: #b66a48;
  color: white;
}

.continue-btn:hover {
  background-color: white;
  color: #b66a48;
  border: 1px #b66a48 solid;
  box-sizing: content-box;
}

@media (max-width: 480px) {
  .panel {
    padding: 10px 18px 24px;
  }

  .color-title {
    font-size: 28px;
  }

  .actions {
    flex-direction: column;
  }
}
</style>