<template>
    <div class="page">
        <div class="phone-frame">
            <TaskCard />

            <section class="status">
                <nav class="tabs">
                    <button class="tab" :class="{ active: activeTab === 'checkin' }" @click="activeTab = 'checkin'">
                        Check In
                    </button>
                    <button class="tab" :class="{ active: activeTab === 'tasks' }" @click="activeTab = 'tasks'">
                        View All Tasks
                    </button>
                </nav>

                <section v-if="activeTab === 'tasks'" class="task-list-section">
                    <div class="task-items-wrapper">
                        <div v-for="task in tasks" :key="task.id" class="task-item">
                            {{ task.text }}
                        </div>
                    </div>

                    <button class="hide-btn" @click="hideTasks">
                        Hide Tasks
                    </button>
                </section>

                <section v-else class="checkin-panel">
                    <div class="timer-card">
                        <div class="time">20:00</div>
                        <div class="label">SESSION TIMER</div>

                        <button class="reminder-btn">
                            🔔 Set Reminder
                        </button>
                    </div>
                </section>
            </section>
        </div>
    </div>
</template>

<script setup>
import TaskCard from '@/components/TaskCard.vue'
import { ref } from 'vue'

const activeTab = ref('tasks')

const tasks = ref([
    { id: 1, text: 'Buy headphone for meeting' },
    { id: 2, text: 'Finish website performance report' },
    { id: 3, text: 'Call purchasing team for hardware details' },
    { id: 4, text: 'Call purchasing team for hardware details' },
    { id: 5, text: 'Call purchasing team for hardware details' }
])

function hideTasks() {
    activeTab.value = 'checkin'
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
    padding: 28px 16px 40px;
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

.task-list-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
}

.task-items-wrapper {
    height: 170px;
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

.task-items-wrapper::-webkit-scrollbar {
    display: none;
    /* Chrome / Safari */
}

.task-item {
    width: 100%;
    background: #fafafa;
    border-radius: 12px;
    min-height: 30px;
    padding: 14px 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.hide-btn {
    margin-top: 16px;
    align-self: center;
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
}
/* 
.checkin-panel {
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

.checkin-panel {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.timer-card {
    width: 100%;
    background: #f4f4f4;
    border-radius: 20px;
    padding: 32px 20px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.time {
    font-size: 48px;
    font-weight: 800;
    color: #2f2f2f;
}

.label {
    margin-top: 6px;
    font-size: 12px;
    letter-spacing: 2px;
    color: #8a8a8a;
}

.reminder-btn {
    margin-top: 24px;
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