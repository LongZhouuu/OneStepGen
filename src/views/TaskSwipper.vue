<template>
    <div class="page">

        <div class="phone-frame">
            <button class="back-btn" @click="router.back()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7"></path>
                </svg>
                Back to Task Planner
            </button>
            <div class="taskCardWrapper" :class="{ expanded: isTimerRunning }">
                <TaskCard :tasks="tasks" :can-swipe="isTimerRunning" @updateTaskState="updateTaskStatus"
                    @noMoreTasks="handleNoMoreTasks" />
            </div>

            <section class="status" :class="{ compressed: isTimerRunning }">
                <nav class="tabs">
                    <button class="tab" :class="{ active: activeTab === 'checkin' }" @click="activeTab = 'checkin'">
                        Check In
                    </button>
                    <button class="tab" :class="{ active: activeTab === 'tasks' }" @click="activeTab = 'tasks'">
                        View All Tasks
                    </button>
                </nav>

                <section v-show="activeTab === 'tasks'" class="taskList">
                    <TransitionGroup name="task-slide" tag="div" class="taskItemContainer">
                        <div v-for="task in tasks" :key="task.id" class="taskItem"
                            :class="{ skipped: task.status === 'skipped' }">
                            <span class="taskText">
                                <span style="font-weight: bold;">
                                    {{ task.order == null ? '' : task.order + 1 + '. ' }}
                                </span>
                                {{ task.text }}
                            </span>

                            <span class="taskStatus" :class="task.status">
                                {{ task.status }}
                            </span>
                        </div>
                    </TransitionGroup>
                    <button class="clearBtn" @click="clear">
                        Clear All Completed
                    </button>
                </section>

                <section v-show="activeTab === 'checkin'" class="checkIn">
                    <SwipingTimer ref="timerRef" @countingState="isTimerRunning = $event" />
                </section>
            </section>
        </div>
    </div>
</template>

<script setup>
import TaskCard from '@/components/TaskCard.vue'
import SwipingTimer from '@/components/SwipingTimer.vue'
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

const activeTab = ref('checkin')
const isTimerRunning = ref(false)
const router = useRouter()

const tasks = ref(JSON.parse(localStorage.getItem('tasks') || '[]'))

const timerRef = ref(null)

const hasRemainingTasks = computed(() => {
    return tasks.value.some(task =>
        task.status !== 'completed' && task.status !== 'skipped'
    )
})

function handleNoMoreTasks() {
    activeTab.value = 'checkin'
    timerRef.value?.pauseFromParent(!hasRemainingTasks.value)
}

watch(isTimerRunning, (newVal) => {
    if (newVal) {
        activeTab.value = 'tasks'
    }
})

// mock data
// const tasks = ref([
//     {
//         id: crypto.randomUUID(),
//         text: "Buy headphone for meeting",
//         status: "pending",
//         order: 1,
//         createdAt: Date.now() - 100000,
//         updatedAt: Date.now() - 100000
//     },
//     {
//         id: crypto.randomUUID(),
//         text: "Finish website performance report",
//         status: "pending",
//         order: 2,
//         createdAt: Date.now() - 90000,
//         updatedAt: Date.now() - 50000
//     },
//     {
//         id: crypto.randomUUID(),
//         text: "Call purchasing team for hardware details",
//         status: "pending",
//         order: 3,
//         createdAt: Date.now() - 80000,
//         updatedAt: Date.now() - 80000
//     },
//     {
//         id: crypto.randomUUID(),
//         text: "Prepare slides for weekly meeting",
//         status: "skipped",
//         order: 4,
//         createdAt: Date.now() - 120000,
//         updatedAt: Date.now() - 60000
//     },
//     {
//         id: crypto.randomUUID(),
//         text: "Review UX feedback from team",
//         status: "pending",
//         order: 5,
//         createdAt: Date.now() - 70000,
//         updatedAt: Date.now() - 30000
//     }
// ])
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
}

function updateTaskStatus(index, newStatus) {
    if (!tasks.value[index]) return

    tasks.value[index].status = newStatus
    tasks.value[index].updatedAt = Date.now()
    saveTasks()
}

function clear() {
    console.log('fy');

    tasks.value = tasks.value.filter(task => task.status !== 'completed')
    saveTasks()
}
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    padding: 40px 0px 0px 0px;
    font-family: Arial, Helvetica, sans-serif;
    color: #2d2d2d;
}

.phone-frame {
    width: 100%;
    max-width: 380px;
    margin-top: 30px;
}

.status {
    /* border: 1px solid black; */
    /* min-height: 200px; */
    display: flex;
    flex-direction: column;
    padding: 0 12px 12px;
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
    font-size: 14px;
    font-weight: 700;
    padding: 6px 0 10px;
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
    border-radius: 12px;
    min-height: 20px;
    padding: 10px 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    font-size: 14px;
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
    font-size: 12px;
    font-weight: 600;
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
    border-radius: 999px;
    padding: 10px 20px;
    background: #c8e1f5;
    color: #2f2f2f;
    font-size: 12px;
    font-weight: 700;
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
    left: 110px;
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
    transition: transform 0.35s ease;
    transform-origin: top center;
}

.taskCardWrapper.expanded {
    transform: scale(1.08);
}

.status {
    display: flex;
    flex-direction: column;
    padding: 0 12px 12px;
    transition: transform 0.35s ease, opacity 0.35s ease, margin-top 0.35s ease;
    transform-origin: top center;
}

.status.compressed {
    transform: scale(0.92);
    opacity: 0.92;
    margin-top: 30px;
}
</style>