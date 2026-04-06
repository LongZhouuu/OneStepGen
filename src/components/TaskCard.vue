<template>
    <section class="planner-card">
        <h1 class="title">Swiping Planner</h1>

        <div class="task-board">
            <div class="task-note" :class="{ disabled: !currentTaskItem || !props.canSwipe }" :style="cardStyle"
                @pointerdown="currentTaskItem && props.canSwipe && startDrag($event)"
                @pointermove="currentTaskItem && props.canSwipe && onDrag($event)"
                @pointerup="currentTaskItem && props.canSwipe && endDrag()"
                @pointerleave="currentTaskItem && props.canSwipe && endDrag()"
                @pointercancel="currentTaskItem && props.canSwipe && endDrag()"
                :title="props.canSwipe ? '' : 'Click Check-In to begin the swipe.'">
                <div class="task-badge">
                    {{ currentTaskOrder }}
                </div>

                <span class="task-text">{{ currentTaskText }}</span>
                <div class="note-corner"></div>
            </div>
        </div>

        <div class="swipe-hints">
            <button class="hint-btn" @click="swipeByClick('left')"
                :disabled="!currentTaskItem || isDragging || !props.canSwipe">
                ← Swipe left to complete a task
            </button>

            <button class="hint-btn" @click="swipeByClick('right')"
                :disabled="!currentTaskItem || isDragging || !props.canSwipe">
                Swipe right to skip a task →
            </button>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    },
    canSwipe: {
        type: Boolean,
        default: false
    }
})

const currentIndex = ref(0)

const currentTaskItem = computed(() => {
    return props.tasks[currentIndex.value] || null
})

const currentTaskText = computed(() => {
    return currentTaskItem.value?.text || 'No more tasks!'
})

const currentTaskOrder = computed(() => {
    return currentTaskItem.value?.order || '🥳'
})

const isDragging = ref(false)
const startX = ref(0)
const offsetX = ref(0)

const rotateY = computed(() => {
    return Math.max(-28, Math.min(28, offsetX.value / 8))
})

const rotateZ = computed(() => {
    return Math.max(-8, Math.min(8, offsetX.value / 25))
})

const cardStyle = computed(() => ({
    transform: `
        translateX(${offsetX.value}px)
        rotateY(${rotateY.value}deg)
        rotateZ(${rotateZ.value}deg)
    `,
    transition: isDragging.value ? 'none' : 'transform 0.28s ease',
    boxShadow: `${Math.abs(offsetX.value) / 8}px 10px 24px rgba(0, 0, 0, 0.14)`,
    cursor: !currentTaskItem.value
        ? 'default'
        : !props.canSwipe
            ? 'not-allowed'
            : isDragging.value
                ? 'grabbing'
                : 'grab'
}))

function startDrag(e) {
    if (!currentTaskItem.value) return
    isDragging.value = true
    startX.value = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
}

function onDrag(e) {
    if (!isDragging.value || !currentTaskItem.value) return
    offsetX.value = e.clientX - startX.value
}

function endDrag() {
    if (!isDragging.value || !currentTaskItem.value) return

    const threshold = 120

    // the user behaviour ended
    if (offsetX.value > threshold) {
        swipeOut('right')
    } else if (offsetX.value < -threshold) {
        swipeOut('left')
    } else {
        offsetX.value = 0
    }

    isDragging.value = false
}

// when user click instead of swipe
function swipeByClick(direction) {
    if (!currentTaskItem.value || isDragging.value) return
    swipeOut(direction)
}


function swipeOut(direction) {
    if (!currentTaskItem.value) return

    if (direction === 'right') {
        skipTask()
        offsetX.value = 400
    } else if (direction === 'left') {
        completeTask()
        offsetX.value = -400
    }

    setTimeout(() => {
        currentIndex.value += 1
        offsetX.value = 0
        isDragging.value = false
    }, 220)
}

function skipTask() {
    props.tasks[currentIndex.value].status = 'skipped'
    console.log(props.tasks[currentIndex.value].status)
}

function completeTask() {
    props.tasks[currentIndex.value].status = 'completed'
    console.log(props.tasks[currentIndex.value].status)
}
</script>

<style scoped>
.planner-card {
    background: #f8f8f8;
    border-radius: 28px;
    padding: 28px 14px 14px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

.title {
    margin: 0;
    text-align: center;
    font-size: 18px;
    font-weight: 800;
    color: #242424;
}

.task-board {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 28px 0 22px;
    perspective: 1000px;
    overflow: hidden;
    min-height: 240px;
}

.task-note {
    position: relative;
    width: 230px;
    height: 230px;
    background: #efd3bd;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 26px 20px 20px;
    font-weight: 700;
    line-height: 1.35;
    color: #343434;
    user-select: none;
    transform-style: preserve-3d;
    will-change: transform;
    /* border: 3px solid #2f2f2f; */
}

.task-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    min-width: 34px;
    height: 34px;
    padding: 0 10px;
    border-radius: 999px;
    background: #ffcf5a;
    color: #2b2b2b;
    /* border: 3px solid #2f2f2f; */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 900;
    line-height: 1;
    box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.18);
}

.task-text {
    white-space: pre-line;
    backface-visibility: hidden;
    font-size: 17px;
    font-weight: 800;
    max-width: 170px;
}

.note-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 18px solid transparent;
    border-top: 18px solid rgba(255, 255, 255, 0.72);
}

.swipe-hints {
    display: flex;
    justify-content: space-between;
    gap: 12px;
}

.hint-btn {
    border: none;
    background: transparent;
    padding: 0;
    font-size: 11px;
    color: #b8b8b8;
    cursor: pointer;
    transition: transform 0.15s ease, opacity 0.15s ease;
}

.hint-btn:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
}

.hint-btn:disabled {
    cursor: not-allowed;
    opacity: 0.45;
}

.task-note {
    cursor: grab;
}

.task-note.disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>