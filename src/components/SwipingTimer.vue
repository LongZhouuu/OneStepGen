<template>
    <section class="timer-card">
        <div v-if="!isEditing" class="time" @dblclick="startEdit">
            {{ defaultMin }}:{{ defaultSec }}
        </div>

        <div v-else class="timeEditor">
            <input
                ref="minuteInput"
                v-model="draftMinutes"
                class="timeInput"
                type="text"
                maxlength="3"
                inputmode="numeric"
                @input="handleMinuteInput"
                @keyup.enter="finishEdit"
                @blur="handleBlur"
            />
            <span class="colon">:</span>
            <input
                ref="secondInput"
                v-model="draftSeconds"
                class="timeInput"
                type="text"
                maxlength="2"
                inputmode="numeric"
                @input="handleSecondInput"
                @keyup.enter="finishEdit"
                @blur="handleBlur"
            />
        </div>

        <div class="label">SESSION TIMER</div>
        <div class="sublabel">Modify Timer by Double-Click</div>

        <button class="checkIn">
            Check-In
        </button>
    </section>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const defaultMin = ref('20')
const defaultSec = ref('00')

const draftMinutes = ref('')
const draftSeconds = ref('')

const isEditing = ref(false)
const minuteInput = ref(null)
const secondInput = ref(null)

function startEdit() {
    draftMinutes.value = defaultMin.value
    draftSeconds.value = defaultSec.value
    isEditing.value = true

    nextTick(() => {
        minuteInput.value?.focus()
        minuteInput.value?.select()
    })
}

function handleMinuteInput(e) {
    // Only numbers are allowed
    // support three-digit input
    let value = e.target.value.replace(/\D/g, '').slice(0, 3)
    draftMinutes.value = value

    if (value.length === 3) {
        secondInput.value?.focus()
        secondInput.value?.select()
    }
}

function handleSecondInput(e) {
    // Only numbers are allowed
    // support two-digit input
    let value = e.target.value.replace(/\D/g, '').slice(0, 2)
    draftSeconds.value = value
}

function handleBlur() {
    setTimeout(() => {
        const active = document.activeElement
        if (
            active !== minuteInput.value &&
            active !== secondInput.value
        ) {
            finishEdit()
        }
    }, 0)
}

function finishEdit() {
    // If the number is less than two digits, fill in the blanks with zeros.
    const mm = draftMinutes.value.padStart(2, '0')
    const ss = draftSeconds.value.padStart(2, '0')

    const secondNumber = Number(ss)

    // If the second is not between 0 and 59 then considered invalid, no changes
    if (Number.isNaN(secondNumber) || secondNumber < 0 || secondNumber > 59) {
        isEditing.value = false
        return
    }

    defaultMin.value = mm
    defaultSec.value = ss
    isEditing.value = false
}
</script>

<style scoped>
.timer-card {
    width: 100%;
    background: #f4f4f4;
    border-radius: 20px;
    padding: 14px 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.time {
    font-size: 48px;
    font-weight: 800;
    color: #2f2f2f;
    cursor: pointer;
}

.timeEditor {
    display: flex;
    justify-content: center;
    align-items: center;
    /* gap: 6px; */
}

.timeInput {
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

.colon {
    font-size: 48px;
    font-weight: 800;
    color: #2f2f2f;
    line-height: 1;
}

.label {
    margin-top: 6px;
    font-size: 12px;
    letter-spacing: 2px;
    color: #8a8a8a;
}

.sublabel {
    margin-top: 4px;
    font-size: 10px;
    letter-spacing: 2px;
    color: #8a8a8a;
}

.checkIn {
    margin-top: 8px;
    border: none;
    border-radius: 999px;
    padding: 12px 24px;
    background: #7fb3c9;
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}
</style>