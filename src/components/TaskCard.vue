<template>
    <section class="planner-card">
        <h1 class="title">Swiping Planner</h1>

        <div class="task-board">
            <div
                class="task-note"
                :style="cardStyle"
                @pointerdown="startDrag"
                @pointermove="onDrag"
                @pointerup="endDrag"
                @pointerleave="endDrag"
                @pointercancel="endDrag"
            >
                <span>{{ currentTask }}</span>
                <div class="note-corner"></div>
            </div>
        </div>

        <div class="swipe-hints">
            <span>← Swipe left to complete a task</span>
            <span>Swipe right to skip a task →</span>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    }
})

const currentIndex = ref(0)
const currentTask = computed(() => {
    return props.tasks[currentIndex.value]?.text || 'No more tasks'
})
console.log(props.tasks);


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
    cursor: isDragging.value ? 'grabbing' : 'grab'
}))

function startDrag(e) {
    isDragging.value = true
    startX.value = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
}

function onDrag(e) {
    if (!isDragging.value) return
    offsetX.value = e.clientX - startX.value
}

function endDrag() {
    if (!isDragging.value) return

    const threshold = 120

    if (offsetX.value > threshold) {
        console.log('right')
    } else if (offsetX.value < -threshold) {
        console.log('left')
    }

    if (Math.abs(offsetX.value) > threshold) {
        offsetX.value = offsetX.value > 0 ? 400 : -400

        setTimeout(() => {
            // Allow loops
            currentIndex.value = (currentIndex.value + 1) % props.tasks.length
            offsetX.value = 0
        }, 220)
    } else {
        offsetX.value = 0
    }

    isDragging.value = false
}
</script>

<style scoped>
.planner-card {
    background: #f8f8f8;
    border-radius: 18px;
    padding: 28px 11px 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.title {
    margin: 0;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
}

.task-board {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 28px 0 22px;
    perspective: 1000px;
    overflow: hidden;
    min-height: 220px;
}

.task-note {
    position: relative;
    width: 230px;
    height: 230px;
    background: #efd3bd;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 18px;
    font-weight: 700;
    line-height: 1.35;
    color: #343434;
    user-select: none;
    transform-style: preserve-3d;
    will-change: transform;
}

.task-note span {
    white-space: pre-line;
    backface-visibility: hidden;
}

.note-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 16px solid transparent;
    border-top: 16px solid rgba(255, 255, 255, 0.6);
}

.swipe-hints {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 11px;
    color: #b8b8b8;
}
</style>