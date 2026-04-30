<template>
    <section class="timerCard" :class="{ collapsed: props.collapsed }">
        <div v-if="!isEditing" class="timerText" @dblclick="!isAllTasksFinished && startEdit()">
            {{ currentMin }}:{{ currentSec }}
        </div>

        <div v-else class="timerEditor">
            <div class="timerInputGroup">
                <input ref="minuteInput" v-model="editMin" class="timerInput" type="text" maxlength="3" inputmode="numeric"
                    aria-label="Timer minutes"
                    @input="handleMinInput" @keyup.enter="finishEdit" @blur="handleBlur" />
                <VoiceInputButton
                    class="timerVoiceButton"
                    aria-label="Dictate timer minutes"
                    @transcript="setMinuteFromVoice"
                />
            </div>
            <span class="timerColon">:</span>
            <div class="timerInputGroup">
                <input ref="secondInput" v-model="editSec" class="timerInput" type="text" maxlength="2" inputmode="numeric"
                    aria-label="Timer seconds"
                    @input="handleSecInput" @keyup.enter="finishEdit" @blur="handleBlur" />
                <VoiceInputButton
                    class="timerVoiceButton"
                    aria-label="Dictate timer seconds"
                    @transcript="setSecondFromVoice"
                />
            </div>
        </div>
        <div v-if="!props.collapsed">
            <div class="timerLabel">
                {{ isAllTasksFinished ? 'REMAINING TIME' : 'SESSION TIMER' }}
            </div>
            <div v-show="!isRunning" class="timerSubLabel">
                {{
                    isAllTasksFinished ?
                        'You have completed all listed tasks.' :
                        'Modify Timer by Double-Click, a bell will ring when the countdown ends.'
                }}
            </div>
        </div>

        <div v-if="!props.collapsed" class="timerButtonGroup">
            <button class="timerButton" @click="startTimer" :disabled="isRunning || isAllTasksFinished">
                {{ isRunning ? 'Checked-In' : 'Check-In' }}
            </button>

            <button v-if="isRunning || !isDefaultTime || isAllTasksFinished" class="timerButton"
                @click="handleSecondButton" :disabled="isAllTasksFinished">
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
import VoiceInputButton from './VoiceInputButton.vue'
import timerSound from '@/assets/timerRing.mp3'

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

const isAllTasksFinished = ref(false)

const finishAudio = ref(null)

const totalSeconds = ref(20 * 60)
let timerId = null

const isDefaultTime = computed(() => {
    return savedMin.value === defaultMin && savedSec.value === defaultSec
})

const props = defineProps({
    collapsed: {
        type: Boolean,
        default: false
    }
})

async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        return false
    }

    if (Notification.permission === 'granted') {
        return true
    }

    if (Notification.permission === 'denied') {
        return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
}

function showFinishNotification() {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    new Notification('Break Time!', {
        body: 'Take a short break',
    })
}

function setupFinishAudio() {
    if (!finishAudio.value) {
        finishAudio.value = new Audio(timerSound)
        finishAudio.value.preload = 'auto'
    }
}

async function unlockAudio() {
    setupFinishAudio()

    try {
        finishAudio.value.muted = true
        await finishAudio.value.play()
        finishAudio.value.pause()
        finishAudio.value.currentTime = 0
        finishAudio.value.muted = false
    } catch (e) {
        console.log('audio unlock failed', e)
    }
}

async function playFinishSound() {
    if (!finishAudio.value) return

    try {
        finishAudio.value.currentTime = 0
        await finishAudio.value.play()
    } catch (e) {
        console.log('play blocked', e)
    }
}

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
    if (isRunning.value || isAllTasksFinished.value) return
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

function setMinuteFromVoice(transcript) {
    const value = speechToNumberText(transcript).slice(0, 3)
    if (!value) return
    editMin.value = value
    secondInput.value?.focus()
    secondInput.value?.select()
}

function setSecondFromVoice(transcript) {
    const value = speechToNumberText(transcript).slice(0, 2)
    if (!value) return
    editSec.value = value
}

function speechToNumberText(transcript) {
    const digitText = transcript.replace(/\D/g, '')
    if (digitText) return digitText

    const numberWords = {
        zero: 0,
        oh: 0,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
        eleven: 11,
        twelve: 12,
        thirteen: 13,
        fourteen: 14,
        fifteen: 15,
        sixteen: 16,
        seventeen: 17,
        eighteen: 18,
        nineteen: 19,
        twenty: 20,
        thirty: 30,
        forty: 40,
        fifty: 50,
        sixty: 60,
    }

    const words = transcript.toLowerCase().match(/[a-z]+/g) ?? []
    const total = words.reduce((sum, word) => sum + (numberWords[word] ?? 0), 0)
    return total > 0 ? String(total) : ''
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

async function startTimer() {
    if (isAllTasksFinished.value) return

    if (isEditing.value) {
        finishEdit()
    }

    if (isRunning.value || totalSeconds.value <= 0) return

    await requestNotificationPermission()
    await unlockAudio()

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
            showFinishNotification()
            playFinishSound()
        }
    }, 1000)
}

function pauseTimer() {
    stopTimer()
    openEditor(currentMin.value, currentSec.value)
}

function handleSecondButton() {
    if (isAllTasksFinished.value) return

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

function pauseFromParent(hasNoRemainingTasks = false) {
    stopTimer()

    if (hasNoRemainingTasks) {
        isAllTasksFinished.value = true
    }
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

    height: 100%;
    width: 100%;
    padding: 0px 34px 0;
    text-align: center;
    /* box-shadow: 0 0px 18px rgba(0, 0, 0, 0.06); */
    background: #c3b7b700;
    border-radius: 28px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    /* border: 2px black solid; */
}

.timerText {
    font-size: 4.4rem;
    font-weight: 800;
    color: #2f2f2f;
}

.timerEditor {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
}

.timerInputGroup {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    width: 34%;
}

.timerInput {
    width: 100%;
    min-width: 0;
    border: none;
    outline: none;
    background: white;
    border-radius: 10px;
    text-align: center;
    font-size: 4.4rem;
    font-weight: 800;
    color: #2f2f2f;
    padding: 0;
}

.timerVoiceButton {
    width: 34px;
    height: 34px;
}

.timerColon {
    font-size: 48px;
    font-weight: 800;
    color: #2f2f2f;
    line-height: 1;
}

.timerLabel {
    margin-top: 6px;
    font-size: 1.12rem;
    font-weight: bold;
    letter-spacing: 2px;
    color: #8a8a8a;
}

.timerSubLabel {
    margin-top: 4px;
    font-size: 0.86rem;
    font-weight: bold;
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

.timerCard {
    transition: all 0.35s ease;
}

.timerCard.collapsed {
    /* height: 100%; */
    padding: 0;
    justify-content: center;
}

.timerCard.collapsed .timerText {
    font-size: 34px;
}

.timerCard.collapsed .timerEditor,
.timerCard.collapsed .timerColon,
.timerCard.collapsed .timerInput {
    font-size: 34px;
}

.timerCard.collapsed .timerInputGroup {
    width: 42%;
}

.timerCard.collapsed .timerVoiceButton {
    width: 30px;
    height: 30px;
}
</style>
