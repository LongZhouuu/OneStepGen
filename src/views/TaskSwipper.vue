<template>
    <!-- Workflow step 3: timed focus mode with swipeable task cards -->
    <div class="page">

        <div class="phone-frame">
        <TaskProgressBar :tasks="tasks" />

            <!-- task card -->
            <div class="taskCardWrapper">
                <TaskCard
                    :tasks="tasks"
                    :can-swipe="isTimerRunning"
                    :user-energy-level="userEnergyLevel"
                    @updateTaskState="updateTaskStatus"
                    @noMoreTasks="handleNoMoreTasks"
                />
            </div>
          
            <!-- Timer and optional tactics panel -->
            <section class="status" :class="{ compressed: isTimerRunning, tipsOpen: isTipsOpen }">
                <div class="timerArea">
                    <SwipingTimer ref="timerRef" :collapsed="isTipsOpen" @countingState="isTimerRunning = $event" />
                </div>

                <hr v-if="!isTipsOpen" style="width: 90%; height: 1px; margin-top: 0; margin-bottom: 0;">

                <button v-if="!isTipsOpen" class="tipsExpand" @click="isTipsOpen = true">
                    <i class="bi bi-lightbulb"></i>
                    Stuck on this step? See why
                </button>

                <!-- tips panel -->
                <section v-else class="tipsPanel">
                    <TipsPanel @close="isTipsOpen = false" />
                </section>
            </section>
        </div>
    </div>
</template>

<script setup>
// Workflow step 3: run focus timer and update task status via swipe actions.
import TaskCard from '@/components/TaskCard.vue'
import SwipingTimer from '@/components/SwipingTimer.vue'
import TipsPanel from '@/components/TipsPanel.vue'
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import TaskProgressBar from '@/components/TaskProgressBar.vue'
import {
    guardWorkflowStep,
    unlockStep,
    getCurrentSession,
    updateTaskInSession,
    completeCurrentSession,
    setFocusLockActive,
    getUserEnergyLevel,
} from '../router/workflow'

const activeTab = ref('checkin')
const isTimerRunning = ref(false)
const isTipsOpen = ref(false)
const router = useRouter()

const timerRef = ref(null)
const session = ref(null)
const tasks = ref([])
const userEnergyLevel = ref(null)

onMounted(() => {
    guardWorkflowStep(3, router)
    userEnergyLevel.value = getUserEnergyLevel()
    loadSession()
    setFocusLockActive(false)
})



// Loads the active session and task queue from workflow storage.
function loadSession() {
    const currentSession = getCurrentSession()

    if (!currentSession) {
        console.warn('No current session found.')
        session.value = null
        tasks.value = []
        return
    }

    session.value = currentSession
    tasks.value = currentSession.tasks || []
}

const hasRemainingTasks = computed(() => {
    return tasks.value.some(task =>
        task.status !== 'completed' && task.status !== 'skipped'
    )
})

/** Emitted when queue empty or last card resolved — completes session and unlocks step 4. */
function handleNoMoreTasks() {
    activeTab.value = 'checkin'
    timerRef.value?.pauseFromParent(!hasRemainingTasks.value)

    if (!hasRemainingTasks.value) {
        if (session.value) {
            session.value = completeCurrentSession(session.value.sessionId)
        }

        unlockStep(4)
        router.push({ name: 'Complete' })
    }
}

watch(isTimerRunning, (newVal) => {
    if (newVal) {
        activeTab.value = 'tasks'
    }
})

// Persists a swipe outcome for the task at the given index.
function updateTaskStatus(index, newStatus) {
    if (!session.value) return
    if (!tasks.value[index]) return

    const task = tasks.value[index]

    task.status = newStatus
    task.updatedAt = Date.now()

    updateTaskInSession(session.value.sessionId, task.id, {
        status: newStatus,
    })

    session.value = getCurrentSession()
    tasks.value = session.value?.tasks || []
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.page {
    /* min-height: 100vh; */
    display: flex;
    justify-content: center;
    padding: 10.8vh 24px 0px;
    font-family: inherit;
    color: #2d2d2d;
}

.page button,
.page input {
    font-family: inherit;
}

.phone-frame {
    width: 100%;
    max-width: 980px;
    display: grid;
    grid-template-columns: minmax(0, 460px) minmax(0, 460px);
    grid-template-rows: auto minmax(0, 420px);
    /* gap: 34px; */
    align-items: stretch;
    justify-content: center;
    /* align-items: center; */
}


.tabs {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin: 14px 0 12px;
    flex-shrink: 0;
}

.tab {
    border: none;
    background: transparent;
    color: #9a9a9a;
    font-size: 1rem;
    font-weight: 700;
    padding: 8px 0 12px;
    position: relative;
    cursor: pointer;
}

.tab.active {
    color: #2f2f2f;
}

.tab.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    border-radius: 999px;
    background: #2f2f2f;
}

.taskList {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
}

.tipsExpand {
    width: 90%;
    padding: 12px 16px;
    background: linear-gradient(90deg, #9ecede 0%, #7fb3c9 52%, #5899b3 100%);
    border: none;
    border-radius: 14px;
    font-size: 14.8px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    font-family: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-shrink: 0;
    box-shadow:
        0 4px 14px rgba(91, 127, 138, 0.28),
        0 0 16px rgba(127, 179, 201, 0.26);
    animation: tipsExpandGlow 2.6s ease-in-out infinite;
}

.tipsExpand:hover {
    background: linear-gradient(90deg, #a8d8ea 0%, #8fc0d4 52%, #6ba9c0 100%);
    color: #fff;
    transform: translateY(-2px);
    box-shadow:
        0 6px 18px rgba(91, 127, 138, 0.32),
        0 0 20px rgba(127, 179, 201, 0.3);
}

@keyframes tipsExpandGlow {
    0%,
    100% {
        box-shadow:
            0 4px 14px rgba(91, 127, 138, 0.28),
            0 0 14px rgba(127, 179, 201, 0.22);
    }

    50% {
        box-shadow:
            0 4px 16px rgba(91, 127, 138, 0.32),
            0 0 18px rgba(127, 179, 201, 0.28);
    }
}

.taskItemContainer {
    height: 150px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 0;
    /* No scroll bar */
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE/Edge */
}

.taskItemContainer::-webkit-scrollbar {
    display: none;
    /* Chrome / Safari */
}

.taskItem {
    width: 100%;
    background: #fafafa;
    border-radius: 16px;
    min-height: 20px;
    padding: 12px 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.taskItem.skipped .taskText {
    text-decoration: line-through;
    color: #aaa;
}

.taskText {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.taskStatus {
    margin-left: 8px;
    font-size: 1rem;
    font-weight: 700;
    flex-shrink: 0;
}


.taskStatus.pending {
    color: #4da3ff;
}

.taskStatus.doing {
    color: #f4b400;
}

.taskStatus.completed {
    color: #4caf50;
}

.taskStatus.skipped {
    color: #e74c3c;
}

.clearBtn {
    margin-top: 16px;
    align-self: last baseline;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    background: #c8e1f5;
    color: #2f2f2f;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    /* border: 1px solid black; */
    flex-shrink: 0;
    transition: all .6s
}

.clearBtn:hover {
    background: #4caf50;
    color: white;
}

/* 
.checkIn {
    flex: 1;
    background: #fafafa;
    border-radius: 14px;
    padding: 20px;
    text-align: center;
    color: #666;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
} */

@media (max-width: 767px) {
    .page {
        padding: 80px 12px 24px;
    }

    .phone-frame {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
        max-width: 520px;
    }

    .taskCardWrapper,
    .status {
        max-width: 100%;
    }

    .status {
        right: 0;
        position: relative;
    }
}

@media (max-width: 420px) {
    .tabs {
        gap: 22px;
    }
}

.checkIn {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: none;
    color: #4a6d8c;
    font-size: 1rem;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    margin-bottom: 32px;
    position: absolute;
    left: 200px;

}

.back-btn:hover {
    background: rgba(255, 255, 255, 0.5);
    color: #2a4d6c;
}

.task-slide-leave-active {
    transition: all 0.35s ease;
}

.task-slide-leave-to {
    opacity: 0;
    transform: translateX(80px);
}

.task-slide-move {
    transition: transform 0.35s ease;
}

.taskCardWrapper {
    /* margin-top: 40px; */
    /* height: 100%; */
    width: 100%;
    max-width: 460px;
    transition: transform 0.35s ease;
    transform-origin: top center;
}


.status {
    /* margin-top: 40px; */
    /* width: 100%; */
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 28px;
    max-width: 460px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 0;
    transition: transform 0.35s ease, opacity 0.35s ease, margin-top 0.35s ease;
    transform-origin: top center;
}

/* .status.compressed {
    transform: scale(0.92);
    opacity: 0.92;
    margin-top: 30px;
} */

.status {
    overflow: hidden;
    right: -1.6%;
    position: relative;
}

.status.tipsOpen {
    justify-content: flex-start;
    gap: 0;
}

.timerArea {
    width: 100%;
    height: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: height 0.35s ease;
}

.status.tipsOpen .timerArea {
    height: 14%;
}

.tipsPanel {
    width: 100%;
    height: 90%;
    background: #fffaf7;
    border-top: 1.5px solid rgba(193, 113, 79, 0.18);
    border-radius: 24px 24px 28px 28px;
    padding: 10px;
    animation: slideUp 0.35s ease;
}

.tipsHeader {
    position: relative;
    text-align: center;
}

.tipsHeader h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    color: #2f2f2f;
}

.tipsBack {
    position: absolute;
    left: 0;
    top: -4px;
    border: none;
    background: transparent;
    font-size: 26px;
    font-weight: 600;
    color: #c1714f;
    cursor: pointer;
}

@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>
