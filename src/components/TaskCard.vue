<template>
    <section class="planner-card">
        <h1 class="title">One-Step Planner</h1>
        <!-- <h2 class="subTitle">
            You can mark a task as completed by dragging the card to the left, or mark it as skipped
            by dragging it to the right.
        </h2> -->

        <!-- <div class="task-board">
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
        </div> -->
        <div class="task-board">
            <div class="memo-card-wrapper" id="memo-wrapper">
                <div class="memo-card-shadow"></div>
                <div class="memo-card" :class="{ disabled: !currentTaskItem || !props.canSwipe }" :style="cardStyle"
                    @pointerdown="currentTaskItem && props.canSwipe && startDrag($event)"
                    @pointermove="currentTaskItem && props.canSwipe && onDrag($event)"
                    @pointerup="currentTaskItem && props.canSwipe && endDrag()"
                    @pointerleave="currentTaskItem && props.canSwipe && endDrag()"
                    @pointercancel="currentTaskItem && props.canSwipe && endDrag()"
                    :title="props.canSwipe ? '' : 'Click Check-In to begin the swipe.'">
                    <div class="memo-task-num" id="memo-num">{{ currentTaskOrder }}</div>
                    <span class="task-text" id="memo-text">
                        {{ currentTaskText }}
                    </span>
                    <p class="memo-swipe-hint">Hold &amp; drag, or use the buttons below</p>
                </div>
            </div>
        </div>


        <div class="swipe-hints">
            <button class="hintBtn completeHintBtn" @click="swipeByClick('left')"
                :disabled="!currentTaskItem || isDragging || !props.canSwipe"
                :title="props.canSwipe ? '' : 'Click Check-In to begin the task.'">
                <p style="font-weight: bold;">Complete this task</p>
                <p style="font-size: 11px;color: #eaeaea;;">or try hold and swipe to Left⬅️</p>
            </button>

            <button class="hintBtn skipHintBtn" @click="swipeByClick('right')"
                :disabled="!currentTaskItem || isDragging || !props.canSwipe"
                :title="props.canSwipe ? '' : 'Click Check-In to begin the task.'">
                <p style="font-weight: bold;">Skip this task</p>
                <p style="font-size: 11px;color: #eaeaea;;">➡️or try hold and swipe to Right</p>
            </button>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['updateTaskState', 'noMoreTasks'])

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

const currentTaskId = ref(null)

function findFirstValidTask() {
    return props.tasks.find(task =>
        task.status === 'pending' || task.status === 'doing'
    ) || null
}

const currentTaskItem = computed(() => {
    if (!props.tasks.length) return null

    if (currentTaskId.value == null) {
        return findFirstValidTask()
    }

    const task = props.tasks.find(task =>
        task.id === currentTaskId.value &&
        (task.status === 'pending' || task.status === 'doing')
    )

    return task || findFirstValidTask()
})

const currentTaskRealIndex = computed(() => {
    if (!currentTaskItem.value) return -1

    return props.tasks.findIndex(task => task.id === currentTaskItem.value.id)
})

watch(
    () => props.tasks,
    () => {
        if (!currentTaskItem.value) {
            currentTaskId.value = null
            return
        }

        currentTaskId.value = currentTaskItem.value.id
    },
    { immediate: true, deep: true }
)

watch(
    () => props.canSwipe,
    (newVal) => {
        if (!newVal) return

        if (!currentTaskItem.value) {
            emit('noMoreTasks')
            return
        }

        if (currentTaskItem.value.status === 'pending') {
            emit('updateTaskState', currentTaskRealIndex.value, 'doing')
        }
    }
)

const currentTaskText = computed(() => {
    return currentTaskItem.value?.text || 'No more tasks!'
})

const currentTaskOrder = computed(() => {
    return currentTaskItem.value?.order != null
        ? currentTaskItem.value.order + 1
        : '🥳'
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

    if (offsetX.value > threshold) {
        swipeOut('right')
    } else if (offsetX.value < -threshold) {
        swipeOut('left')
    } else {
        offsetX.value = 0
    }

    isDragging.value = false
}

function swipeByClick(direction) {
    if (!currentTaskItem.value || isDragging.value) return
    swipeOut(direction)
}

function getNextValidTask(afterIndex) {
    for (let i = afterIndex + 1; i < props.tasks.length; i++) {
        const task = props.tasks[i]
        if (task.status === 'pending' || task.status === 'doing') {
            return task
        }
    }
    return null
}

function swipeOut(direction) {
    if (!currentTaskItem.value) return

    const leavingIndex = currentTaskRealIndex.value
    const leavingTaskId = currentTaskItem.value.id
    const nextTask = getNextValidTask(leavingIndex)

    if (direction === 'right') {
        emit('updateTaskState', leavingIndex, 'skipped')
        offsetX.value = 400
    } else if (direction === 'left') {
        emit('updateTaskState', leavingIndex, 'completed')
        offsetX.value = -400
    }

    setTimeout(() => {
        if (nextTask) {
            currentTaskId.value = nextTask.id

            const nextTaskIndex = props.tasks.findIndex(task => task.id === nextTask.id)

            if (props.canSwipe && nextTask.status === 'pending') {
                emit('updateTaskState', nextTaskIndex, 'doing')
            }
        } else {
            currentTaskId.value = null
            emit('noMoreTasks')
        }

        offsetX.value = 0
        isDragging.value = false
    }, 220)
}
</script>

<style scoped>
.memo-task-num {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ffcf5a;
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Lora', serif;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 14px;
    box-shadow: 0 3px 10px rgba(193, 113, 79, 0.3);
}

.memo-card-wrapper {
    width: 100%;
    margin: 0 0 14px;
}

.swipe-buttons {
    width: 100%;
}

.swipe-direction-hints {
    margin-bottom: 10px;
    padding: 0;
}

.memo-card-wrapper {
    position: relative;
    width: 100%;
    margin: 0 0 14px;
    cursor: grab;
    user-select: none;
}

.memo-card-shadow {
    position: absolute;
    top: 8px;
    left: 8px;
    right: -8px;
    bottom: -8px;
    background: rgba(193, 113, 79, 0.1);
    border-radius: 18px;
}

.memo-card {
    position: relative;
    background: #fdf2e8;
    border-radius: 18px;
    padding: 22px 18px;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 24px rgba(193, 113, 79, 0.16);
    border: 1px solid rgba(193, 113, 79, 0.14);
    transition: transform 0.12s;
    background-image: repeating-linear-gradient(transparent, transparent 29px, rgba(193, 113, 79, 0.07) 29px, rgba(193, 113, 79, 0.07) 30px);
    background-position: 0 44px;
}

.memo-swipe-hint {
    font-size: 12px;
    color: rgba(45, 31, 20, 0.28);
    margin-top: 14px;
    letter-spacing: 0.04em;
}


.planner-card {
    background: #f8f8f8;
    border-radius: 28px;
    padding: 40px 24px 24px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    width: 106%;
    position: relative;
    left: -3%;
    /* border: 1px solid black; */
    /* height: 500px; */
    height: 100%;
}

.title {
    margin: 0;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 800;
    color: #242424;
}

.subTitle {
    margin-top: 6px;
    text-align: center;
    font-size: 1rem;
    font-weight: 500;
    color: #7c7c7c;
    font-style: italic;
}

.task-board {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0 32px;
    perspective: 1000px;
    overflow: hidden;
    min-height: 240px;
    padding-top: 12px;
}

.task-note {
    position: relative;
    width: 230px;
    height: 230px;
    background: #efd3bd;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px 32px 32px;
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
    padding: 0 16px;
    border-radius: 999px;
    background: #ffcf5a;
    color: #2b2b2b;
    /* border: 3px solid #2f2f2f; */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: 900;
    line-height: 1;
    box-shadow: 4px 6px 0 rgba(0, 0, 0, 0.18);
}

.task-text {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.55;
    color: black;
    flex: 1;
    max-height: 20vh;
    align-items: center;
    /* border: 2px black solid; */
    justify-content: center;
    display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: normal; */
    /* word-break: break-word; */
}

.note-corner {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 24px solid transparent;
    border-top: 24px solid rgba(255, 255, 255, 0.72);
}

.swipe-hints {
    display: flex;
    justify-content: space-between;
    gap: 0px;
}

.hintBtn {
    border: none;
    background: #ffcf5a;
    padding: 8px 8px;
    border-radius: 6px;
    font-size: 1rem;
    color: rgb(255, 255, 255);
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, opacity 0.15s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 160px;
}

.hintBtn p {
    margin: 0;
    font-weight: normal;
}

.skipHintBtn {
    background: #e74c3c;

}

.completeHintBtn {
    background: #4caf50;
}

.hintBtn:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
}

.hintBtn:disabled {
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