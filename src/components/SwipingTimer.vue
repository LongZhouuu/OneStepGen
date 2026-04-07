<template>
    <section class="timerCard">
        <div v-if="!isEditing" class="timerText" @dblclick="startEdit">
            {{ currentMin }}:{{ currentSec }}
        </div>

        <div v-else class="timerEditor">
            <input ref="minuteInput" v-model="editMin" class="timerInput" type="text" maxlength="3" inputmode="numeric"
                @input="handleMinInput" @keyup.enter="finishEdit" @blur="handleBlur" />
            <span class="timerColon">:</span>
            <input ref="secondInput" v-model="editSec" class="timerInput" type="text" maxlength="2" inputmode="numeric"
                @input="handleSecInput" @keyup.enter="finishEdit" @blur="handleBlur" />
        </div>

        <div class="timerLabel">SESSION TIMER</div>
        <div v-show="!isRunning" class="timerSubLabel">
            Modify Timer by Double-Click
        </div>

        <div class="timerButtonGroup">
            <button class="timerButton" @click="startTimer" :disabled="isRunning">
                {{ isRunning ? 'Checked-In' : 'Check-In' }}
            </button>

            <button v-if="isRunning || !isDefaultTime" class="timerButton" @click="handleSecondButton">
                {{ isRunning ? 'Pause' : 'Restore Default' }}
            </button>
        </div>
    </section>

    <Teleport to="body">
        <CountdownPop v-if="isPopupVisible" @close="handlePopupClose" />
    </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from 'vue'
import CountdownPop from './CountdownPop.vue'

const emit = defineEmits(['countingState'])

const defaultMin = '20'
const defaultSec = '00'

const savedMin = ref(defaultMin)
const savedSec = ref(defaultSec)

const currentMin = ref(defaultMin)
const currentSec = ref(defaultSec)

const editMin = ref('')
const editSec = ref('')

const isEditing = ref(false)
const isRunning = ref(false)
const isPopupVisible = ref(false)

const minuteInput = ref(null)
const secondInput = ref(null)

const totalSeconds = ref(20 * 60)
let timerId = null

const isDefaultTime = computed(() => {
    return savedMin.value === defaultMin && savedSec.value === defaultSec
})

function updateCurrentTime() {
    const min = Math.floor(totalSeconds.value / 60)
    const sec = totalSeconds.value % 60

    currentMin.value = String(min).padStart(2, '0')
    currentSec.value = String(sec).padStart(2, '0')
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    }

    isRunning.value = false
    emit('countingState', false)
}

function loadSavedTime() {
    totalSeconds.value = Number(savedMin.value) * 60 + Number(savedSec.value)
    updateCurrentTime()
}

function loadDefaultTime() {
    savedMin.value = defaultMin
    savedSec.value = defaultSec
    loadSavedTime()
}

function openEditor(min, sec) {
    editMin.value = min
    editSec.value = sec
    isEditing.value = true

    nextTick(() => {
        minuteInput.value?.focus()
        minuteInput.value?.select()
    })
}

function startEdit() {
    if (isRunning.value) return
    openEditor(savedMin.value, savedSec.value)
}

function handleMinInput(e) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3)
    editMin.value = value

    if (value.length === 3) {
        secondInput.value?.focus()
        secondInput.value?.select()
    }
}

function handleSecInput(e) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2)
    editSec.value = value
}

function handleBlur() {
    setTimeout(() => {
        const active = document.activeElement

        if (active !== minuteInput.value && active !== secondInput.value) {
            finishEdit()
        }
    }, 0)
}

function finishEdit() {
    const minText = editMin.value.padStart(2, '0')
    const secText = editSec.value.padStart(2, '0')

    const minNumber = Number(minText)
    const secNumber = Number(secText)

    const isInvalid =
        Number.isNaN(minNumber) ||
        Number.isNaN(secNumber) ||
        secNumber < 0 ||
        secNumber > 59

    if (isInvalid) {
        isEditing.value = false
        return
    }

    savedMin.value = minText
    savedSec.value = secText

    loadSavedTime()
    isEditing.value = false
}

function startTimer() {
    if (isEditing.value) {
        finishEdit()
    }

    if (isRunning.value || totalSeconds.value <= 0) return

    isRunning.value = true
    emit('countingState', true)

    timerId = setInterval(() => {
        if (totalSeconds.value > 0) {
            totalSeconds.value -= 1
            updateCurrentTime()
        }

        if (totalSeconds.value <= 0) {
            stopTimer()
            isPopupVisible.value = true
        }
    }, 1000)
}

function pauseTimer() {
    stopTimer()
    openEditor(currentMin.value, currentSec.value)
}

function handleSecondButton() {
    if (isRunning.value) {
        pauseTimer()
    } else {
        loadDefaultTime()
    }
}

function handlePopupClose() {
    isPopupVisible.value = false
    loadSavedTime()
    startTimer()
}

function pauseFromParent() {
    stopTimer()
}

defineExpose({
    pauseFromParent
})

onBeforeUnmount(() => {
    if (timerId) {
        clearInterval(timerId)
    }
})
</script>

<style scoped>
.timerCard {
    width: 100%;
    background: #f4f4f4;
    border-radius: 20px;
    padding: 14px 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.timerText {
    font-size: 48px;
    font-weight: 800;
    color: #2f2f2f;
}

.timerEditor {
    display: flex;
    justify-content: center;
    align-items: center;
}

.timerInput {
    width: 24%;
    border: none;
    outline: none;
    background: white;
    border-radius: 10px;
    text-align: center;
    font-size: 48px;
    font-weight: 800;
    color: #2f2f2f;
    padding: 0;
}

.timerColon {
    font-size: 48px;
    font-weight: 800;
    color: #2f2f2f;
    line-height: 1;
}

.timerLabel {
    margin-top: 6px;
    font-size: 12px;
    letter-spacing: 2px;
    color: #8a8a8a;
}

.timerSubLabel {
    margin-top: 4px;
    font-size: 10px;
    letter-spacing: 2px;
    color: #8a8a8a;
}

.timerButtonGroup {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.timerButton {
    margin-top: 8px;
    border: none;
    border-radius: 99px;
    padding: 8px 24px;
    background: #7fb3c9;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all .6s;
}

.timerButton:not(:disabled):hover {
    background: #efd3bd;
    color: black;
}

.timerButton:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>