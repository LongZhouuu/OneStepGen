<template>
    <section class="planner-card">
        <div class="panel-header-band">
            <div class="phb-icon" aria-hidden="true"
                style="display: flex; justify-content: center; align-items: center;">
                <i class="bi bi-archive" style="font-size: 1.4rem; position: relative; bottom: -0.2rem;"></i>
            </div>

            <div>
                <div class="phb-title">One-Step Swiper</div>
                <div class="phb-desc">Swipe tasks to complete or skip them.</div>
            </div>
        </div>
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
            <div class="memo-card-wrapper" id="memo-wrapper" style="max-width: 82%;">
                <div
                    v-if="swipeFeedbackVisible"
                    class="swipe-feedback-chip"
                    :class="{ 'swipe-feedback-chip--fade': swipeFeedbackFading }"
                >
                    <i :class="swipeFeedbackIcon"></i>
                </div>

                <div class="memo-card-shadow"></div>

                <div class="memo-card"
                    :class="{
                        disabled: !currentTaskItem || !props.canSwipe,
                        [`memo-card--${currentTaskCognitiveTier}`]: showMatchBadge,
                    }"
                    :style="cardStyle"
                    @pointerdown="currentTaskItem && props.canSwipe && startDrag($event)"
                    @pointermove="currentTaskItem && props.canSwipe && onDrag($event)"
                    @pointerup="currentTaskItem && props.canSwipe && endDrag()"
                    @pointerleave="currentTaskItem && props.canSwipe && endDrag()"
                    @pointercancel="currentTaskItem && props.canSwipe && endDrag()"
                    :title="props.canSwipe ? '' : 'Click Check-In to begin the swipe.'">
                    <div class="memo-card-top">
                        <div class="memo-task-num" id="memo-num">{{ currentTaskOrder }}</div>
                        <span
                            v-if="showMatchBadge"
                            class="cognitive-badge"
                            :class="`cognitive-badge--${currentTaskCognitiveTier}`"
                        >{{ currentTaskCognitiveLabel }}</span>
                    </div>
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
import {
    getTaskCognitiveTier,
    getTaskCognitiveLabel,
    taskMatchesUserEnergy,
} from '@/utils/energyMatching'

const emit = defineEmits(['updateTaskState', 'noMoreTasks'])

const props = defineProps({
    tasks: {
        type: Array,
        required: true
    },
    canSwipe: {
        type: Boolean,
        default: false
    },
    userEnergyLevel: {
        type: String,
        default: null,
    },
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
        // +1 ?
        ? currentTaskItem.value.order
        : '🥳'
})

const currentTaskCognitiveTier = computed(() =>
    getTaskCognitiveTier(currentTaskItem.value ?? {}),
)

const currentTaskCognitiveLabel = computed(() =>
    getTaskCognitiveLabel(currentTaskItem.value ?? {}),
)

const showMatchBadge = computed(() =>
    taskMatchesUserEnergy(currentTaskItem.value ?? {}, props.userEnergyLevel),
)

const isDragging = ref(false)
const startX = ref(0)
const offsetX = ref(0)
const swipeFeedbackVisible = ref(false)
const swipeFeedbackFading = ref(false)
// const swipeFeedbackSymbol = ref('')
const swipeFeedbackIcon = ref('')

const revealY = ref(0)
const revealScale = ref(1)
const revealOpacity = ref(1)

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
        translateY(${revealY.value}px)
        scale(${revealScale.value})
    `,
    opacity: revealOpacity.value,
    transition: isDragging.value
        ? 'none'
        : 'transform 0.28s ease, opacity 0.22s ease',
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

function revealNextCard() {
    offsetX.value = 0

    revealY.value = 10
    revealScale.value = 0.97
    revealOpacity.value = 0

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            revealY.value = 0
            revealScale.value = 1
            revealOpacity.value = 1
        })
    })
}

function swipeOut(direction) {
    if (!currentTaskItem.value) return

    const leavingIndex = currentTaskRealIndex.value
    const nextTask = getNextValidTask(leavingIndex)

    swipeFeedbackIcon.value = direction === 'right'
        ? 'bi bi-skip-forward'
        : 'bi bi-check2'
    swipeFeedbackVisible.value = true
    swipeFeedbackFading.value = false

    if (direction === 'right') {
        offsetX.value = 420
        emit('updateTaskState', leavingIndex, 'skipped')
    } else if (direction === 'left') {
        offsetX.value = -420
        emit('updateTaskState', leavingIndex, 'completed')
    }

    setTimeout(() => {
        swipeFeedbackFading.value = true
    }, 80)

    setTimeout(() => {
        swipeFeedbackVisible.value = false
        swipeFeedbackFading.value = false
    }, 500)

    setTimeout(() => {
        offsetX.value = 0

        if (nextTask) {
            currentTaskId.value = nextTask.id

            const nextTaskIndex = props.tasks.findIndex(task => task.id === nextTask.id)

            if (props.canSwipe && nextTask.status === 'pending') {
                emit('updateTaskState', nextTaskIndex, 'doing')
            }

            revealNextCard()
        } else {
            currentTaskId.value = null
            emit('noMoreTasks')
        }

        isDragging.value = false
    }, 260)
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
    /* margin-bottom: 14px; */
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
    /* animation: memoFloatIn 0.28s ease both; */
}

/* @keyframes memoFloatIn {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.97);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
} */

.memo-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
}

.memo-card--low {
    border-color: #8ecfad;
}

.memo-card--normal {
    border-color: #e8b86d;
}

.memo-card--high {
    border-color: #e89a88;
}

.cognitive-badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 64px;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: 2px solid transparent;
}

.swipe-feedback-chip {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(1);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    font-weight: 800;
    line-height: 1;
    z-index: 5;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.42s ease, transform 0.42s ease;
}

.swipe-feedback-chip--fade {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.72);
}

.swipe-feedback-chip i {
    font-size: 30px;
    line-height: 1;
}

.cognitive-badge--low {
    background: #e8f5ee;
    color: #2d6b52;
    border-color: #8ecfad;
}

.cognitive-badge--normal {
    background: #fff4e6;
    color: #9a5f20;
    border-color: #e8b86d;
}

.cognitive-badge--high {
    background: #fdeeed;
    color: #9b3d28;
    border-color: #e89a88;
}

.memo-swipe-hint {
    font-size: 12px;
    color: rgba(45, 31, 20, 0.28);
    /* margin-top: 14px; */
    letter-spacing: 0.04em;
}


.planner-card {
    background: #f8f8f8;
    border-radius: 28px;
    padding: 0 0 24px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
    width: 100%;
    position: relative;
    left: -1.6%;
    height: 100%;
    overflow: hidden;
}

.panel-header-band {
    background: linear-gradient(120deg, #c8a888 0%, #dbbfa0 100%);
    padding: 20px 24px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
}

.phb-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    background: rgba(253, 246, 240, 0.7);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 10px 22px rgba(45, 31, 20, 0.09);
}

.phb-icon svg {
    width: 28px;
    height: 28px;
    color: #2d1f14;
}

.phb-title {
    font-size: 22px;
    font-weight: 700;
    color: #2d1f14;
    margin-bottom: 4px;
    margin-top: 2px;
}

.phb-desc {
    font-size: 13.5px;
    color: rgba(45, 31, 20, 0.65);
    line-height: 1.5;
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
    padding: 40px 0 28px;
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
    position: relative;
    bottom: 2vh;
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
    margin-left: 20px;
    margin-right: 20px;
}

.hintBtn p {
    margin: 0;
    font-weight: normal;
}

.skipHintBtn {
    background: #e74c3c;

}

.completeHintBtn {
    background: #61b99f;
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