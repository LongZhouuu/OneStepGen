<template>
    <!-- Workflow step 4: session summary, reward, and next actions -->
    <div class="complete-page">
        <section class="complete-card">
            <!-- Header -->
            <div class="card-header">
                <div>
                    <p class="eyebrow">SESSION COMPLETE</p>
                    <p class="subtitle">That took real effort. Be proud of yourself.</p>
                </div>
            </div>

            <!-- Body -->
            <div class="card-body">
                <!-- Animal Reward Card -->
                <div v-if="earnedAnimal" class="animal-reward-card">
                    <div class="animal-image-placeholder">
                        <img :src="earnedAnimal.image" :alt="earnedAnimal.name">
                    </div>

                    <div class="animal-info">
                        <p class="reward-label">
                            {{ rewardLabel }}
                        </p>

                        <h3 class="animal-name">
                            {{ earnedAnimal.name }} !
                            <span v-if="shouldShowAnimalCount" class="animal-count">
                                (×{{ sameAnimalCount }})
                            </span>
                        </h3>

                        <div class="animal-meta">
                            <div class="meta-row">
                                <span class="meta-label">Region</span>
                                <span class="meta-value">{{ earnedAnimal.region }}</span>
                            </div>

                            <div class="meta-row">
                                <span class="meta-label">Earned at</span>
                                <span class="meta-value">{{ new Date(earnedAnimal.earnedAt).toLocaleString() }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="animal-reward-card">
                    Loading animal reward...
                </div>

                <div class="completed-pill">
                    <span>✓</span>
                    <span>{{ completedCount }} COMPLETED</span>
                </div>

                <h2 class="session-title">
                    Perfect Session! {{ completedCount }} out of {{ totalTaskCount }} tasks completed!
                </h2>

                <h2 v-if="skippedCount > 0" class="skipped-message">
                    There are still {{ skippedCount }} tasks that have been skipped.
                    Do you want to continue with them?
                </h2>


                <!-- Post-session navigation -->
                <div
                    class="button-row"
                    :class="{
                        'two-line-buttons': actionButtonCount === 4,
                        'three-buttons': actionButtonCount === 3
                    }"
                >
                    <button v-if="skippedCount > 0" class="btn primary" @click="handleContinueWithSkipped">
                        <i class="bi bi-arrow-clockwise"></i>
                        Continue with Skipped
                    </button>

                    <button class="btn primary" @click="handleStartNewSession">
                        <span><i class="bi bi-star"></i></span>
                        Start New Session
                    </button>

                    <button class="btn secondary" @click="handleJumpToRewards">
                        <span><i class="bi bi-gift"></i></span>
                        Check My Rewards
                    </button>

                    <button class="btn secondary" @click="handleExitToHome">
                        <span><i class="bi bi-house"></i></span>
                        Exit to Home
                    </button>
                </div>
            </div>
        </section>
        <img 
            v-if="shouldShowCelebration"
            src="../assets/party_celebrate_transparent.gif" 
            alt="celebrating!" 
            class="celebration-left"
        >

        <img 
            v-if="shouldShowCelebration"
            src="../assets/party_celebrate_transparent.gif" 
            alt="celebrating!" 
            class="celebration-right"
        >    
</div>
</template>

<script setup>
// Workflow step 4: show session results, award animals, and offer next steps.
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    getCurrentSession,
    guardWorkflowStep,
    deleteSession,
    resetWorkflow,
    unlockStep,
    getAnimalBySessionId,
    addRandomAnimal,
    getRewards
} from '../router/workflow'

const router = useRouter()
const session = ref(null)

const earnedAnimal = ref(null)
const isNewAnimal = ref(false)
const isCurrentSessionRevisit = ref(false)
const sameAnimalCount = ref(0)

const shouldShowCelebration = computed(() => {
    return earnedAnimal.value && !isCurrentSessionRevisit.value
})

const actionButtonCount = computed(() => {
    return skippedCount.value > 0 ? 4 : 3
})

const rewardLabel = computed(() => {
    if (isNewAnimal.value) {
        return 'You earned a new animal!'
    }

    if (isCurrentSessionRevisit.value) {
        return 'Your earned animal:'
    }

    return 'You earned another:'
})

const shouldShowAnimalCount = computed(() => {
    return !isNewAnimal.value && !isCurrentSessionRevisit.value && sameAnimalCount.value > 1
})

onMounted(() => {
    const canEnter = guardWorkflowStep(4, router)

    if (!canEnter) return

    session.value = getCurrentSession()

    const currentSessionId = session.value?.sessionId

    if (!currentSessionId) return

    const existingAnimal = getAnimalBySessionId(currentSessionId)

    // Case 1:
    // This session already has an animal.
    // User is re-entering the complete step in the same session.
    if (existingAnimal) {
        earnedAnimal.value = existingAnimal
        isNewAnimal.value = false
        isCurrentSessionRevisit.value = true

        const allAnimals = getRewards()
        sameAnimalCount.value = allAnimals.filter(
            animal => animal.name === existingAnimal.name
        ).length

        return
    }

    // Case 2:
    // First time entering complete step in this session.
    //  Check old animal list before adding the new animal.
    const animalsBeforeAdding = getRewards()

    const newAnimal = addRandomAnimal(currentSessionId)

    earnedAnimal.value = newAnimal
    isCurrentSessionRevisit.value = false

    const previousSameAnimalCount = animalsBeforeAdding.filter(
        animal => animal.name === newAnimal.name
    ).length

    sameAnimalCount.value = previousSameAnimalCount + 1

    // If there was no animal with the same name before,
    //  this is a completely new animal type.
    isNewAnimal.value = previousSameAnimalCount === 0
})

const completedCount = computed(() => {
    return session.value?.completedCount
})

const totalTaskCount = computed(() => {
    // return session.value?.tasks?.length || 0
    return session.value?.completedCount + session.value?.skippedCount
})

const skippedCount = computed(() => {
    // return session.value?.tasks?.filter(task => task.status === 'skipped').length || 0
    return session.value?.skippedCount
})

function clearCurrentSession() {
    if (!session.value?.sessionId) return

    deleteSession(session.value.sessionId)
    session.value = null
}

function handleExitToHome() {
    clearCurrentSession()
    resetWorkflow()
    router.push('/')
}

function handleJumpToRewards() {
    // clearCurrentSession()
    // resetWorkflow()
    router.push('/reward')
}

// Clears the session and restarts the workflow at step 1.
function handleStartNewSession() {
    clearCurrentSession()
    resetWorkflow()
    router.push({ name: 'AIDump' })
}

// Returns to the planner to work through skipped tasks.
function handleContinueWithSkipped() {
    resetWorkflow()
    unlockStep(2)

    router.push({ name: 'Planner' })
}

// const reward = getRandomAnimal()
// console.log(reward);
// const earnedAnimal = {
//     name: 'Quokka',
//     region: 'Western Australia',
//     earnedAt: new Date().toLocaleString()
// }
</script>

<style scoped>
* {
    font-family: 'Baloo 2', cursive;
}

.complete-page {
    max-width: 860px;
    margin: 0 auto;
    padding-top: 10.2vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.complete-card {
    width: 39.7vw;
    min-width: 720px;
    min-height: 64vh;
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 18px 40px rgba(120, 80, 45, 0.08);
    padding: 0 0 1.2vh 0;
}

.card-header {
    width: 100%;
    height: 10vh;
    background: #a9d7c7;
    display: flex;
    align-items: center;
    padding: 0 5%;
    box-sizing: border-box;
}

.eyebrow {
    margin: 0 0 0;
    font-size: 1.42rem;
    letter-spacing: 3px;
    font-weight: 700;
    color: #5c796f;
}

.subtitle {
    margin: 0 0 0;
    font-size: 13px;
    color: #4f6c62;
}

.card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2vh 2vw;
    box-sizing: border-box;
}

.completed-pill {
    width: 146px;
    height: 39px;
    border-radius: 999px;
    background: #eaf4ef;
    color: #66bfa7;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 9px;
    font-size: 16.8px;
    font-weight: 700;
    margin-top: 1.8vh;
}

.session-title {
    margin: 18px 0 0;
    font-size: 16.8px;
    color: #61b99f;
    font-weight: 800;
    text-align: center;
}

.skipped-message {
    margin: 10px 0 0;
    font-size: 14px;
    color: #e74c3c;
    font-weight: 700;
    text-align: center;
}

/* Animal Reward Card */
.animal-reward-card {
    width: 100%;
    max-width: 520px;
    /* margin-top: 28px; */
    margin-bottom: 1.2vh;
    padding: 2vh 2vw;
    border-radius: 24px;
    background: #fbf7f1;
    /* border: 2px solid #efe2d3; */
    display: flex;
    align-items: center;
    gap: 22px;
    box-sizing: border-box;
    box-shadow: 0 4px 4px rgba(120, 80, 45, 0.05);
}

.animal-image-placeholder {
    width: 150px;
    height: 150px;
    flex-shrink: 0;
    border-radius: 22px;
    background: #d9d9d92a;
    border: 1.4px solid #bdbdbd;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.animal-image-placeholder img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.animal-info {
    flex: 1;
    min-width: 0;
}

.reward-label {
    margin: 0 0 6px;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #bc704c;
    font-weight: 800;
}

.animal-name {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
    color: #3f3129;
    font-weight: 800;
}

.animal-meta {
    margin-top: 0.4vh;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.meta-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.meta-label {
    font-size: 12px;
    color: #9b8f8b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
}

.meta-value {
    font-size: 15px;
    color: #5f514a;
    font-weight: 700;
}

.button-row {
    margin-top: 2vh;
    width: 100%;
    max-width: 620px;
    display: flex;
    gap: 12px;
    justify-content: center;
}

/* When there are 4 buttons: 2 x 2 layout */
.two-line-buttons {
    display: grid;
    grid-template-columns: repeat(2, 220px);
    gap: 12px;
    justify-content: center;
}

/* When there are 3 buttons: primary button on top, two secondary buttons below */
.three-buttons {
    display: grid;
    grid-template-columns: repeat(2, 220px);
    gap: 12px;
    justify-content: center;
}

.three-buttons .btn:first-child {
    grid-column: 1 / 3;
    width: 260px;
    justify-self: center;
}

.three-buttons .btn {
    width: 220px;
}

.btn {
    min-height: 46px;
    border-radius: 999px;
    padding: 0 20px;
    border: none;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    font-size: 1rem;
    line-height: 1.15;
    text-align: center;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary {
    background: #bd6d48;
    color: #ffffff;
}

.secondary {
    background: #ffffff;
    color: #6b574b;
    border: 1.5px solid #ddd6d2;
}

.btn:hover {
    transform: translateY(-1px);
}

.animal-count {
    font-size: 20px;
    color: #bc704c;
    font-weight: 800;
}

.celebration-left {
    position: absolute;
    width: 10vw;
    left: 27.2%;
    top: 34%;
}

.celebration-right {
    position: absolute;
    width: 10vw;
    right: 27.2%;
    top: 34%;
    transform: scaleX(-1);
}

/* Small screen */
@media (max-width: 760px) {
    .complete-card {
        width: 92vw;
        min-width: unset;
    }

    .card-body {
        padding: 28px 24px 0;
    }

    .animal-reward-card {
        flex-direction: column;
        text-align: center;
    }

    .animal-image-placeholder {
        width: 160px;
        height: 160px;
    }

    .meta-row {
        align-items: center;
    }

    .two-line-buttons,
    .three-buttons {
        grid-template-columns: 1fr;
        width: 100%;
        max-width: 320px;
    }

    .three-buttons .btn:first-child {
        grid-column: 1;
        width: 100%;
        max-width: none;
    }

    .three-buttons .btn,
    .button-row .btn {
        width: 100%;
    }
}
</style>