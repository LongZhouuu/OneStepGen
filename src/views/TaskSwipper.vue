<template>
    <div class="page">
        <div class="phone-frame">
            <TaskCard :tasks="tasks" />

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
                        <div v-for="task in tasks" :key="task.id" class="task-item"
                            :class="{ skipped: task.status === 'skipped' }"
                            :title="task.status === 'skipped' ? 'This task has been skipped' : ''">
                            {{ task.text }}
                        </div>
                    </div>
                    <button class="clear-btn" @click="clear">
                        Clear All
                    </button>
                </section>

                <section v-else class="checkin-panel">
                    <SwipingTimer />
                </section>
            </section>
        </div>
    </div>
</template>

<script setup>
import TaskCard from '@/components/TaskCard.vue'
import SwipingTimer from '@/components/SwipingTimer.vue'
import { ref } from 'vue'

const activeTab = ref('checkin')

// mock data
const tasks = ref([
    {
        id: crypto.randomUUID(),
        text: "Buy headphone for meeting",
        status: "pending",
        order: 1,
        createdAt: Date.now() - 100000,
        updatedAt: Date.now() - 100000
    },
    {
        id: crypto.randomUUID(),
        text: "Finish website performance report",
        status: "doing",
        order: 2,
        createdAt: Date.now() - 90000,
        updatedAt: Date.now() - 50000
    },
    {
        id: crypto.randomUUID(),
        text: "Call purchasing team for hardware details",
        status: "pending",
        order: 3,
        createdAt: Date.now() - 80000,
        updatedAt: Date.now() - 80000
    },
    {
        id: crypto.randomUUID(),
        text: "Prepare slides for weekly meeting",
        status: "completed",
        order: 4,
        createdAt: Date.now() - 120000,
        updatedAt: Date.now() - 60000
    },
    {
        id: crypto.randomUUID(),
        text: "Review UX feedback from team",
        status: "pending",
        order: 5,
        createdAt: Date.now() - 70000,
        updatedAt: Date.now() - 30000
    }
])

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

.task-list-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
}

.task-items-wrapper {
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

.task-items-wrapper::-webkit-scrollbar {
    display: none;
    /* Chrome / Safari */
}

.task-item {
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

.task-item.skipped {
    text-decoration: line-through;
    color: #aaa;
    opacity: 0.6;
    transform: scale(0.98);
}

.clear-btn {
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
</style>