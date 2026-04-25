<template>
    <div class="complete-page">
        <section class="complete-card">
            <!-- Header -->
            <div class="card-header">
                <!-- <div class="icon-box">
          ⚔
        </div> -->

                <div>
                    <p class="eyebrow">SESSION COMPLETE</p>
                    <!-- <h1>You did it!</h1> -->
                    <p class="subtitle">That took real effort. Be proud of yourself</p>
                </div>
            </div>

            <!-- Body -->
            <div class="card-body">
                <!-- <div class="reward-card"> -->
                <!-- <div class="animal">🐼</div> -->
                <!-- <p>You earned a little friend!</p> -->
                <!-- </div> -->

                <div class="completed-pill" style="font-size: 16.8px;">
                    <span>✓</span>
                    <span>7 COMPLETED</span>
                </div>

                <h2 style="font-size: 16.8px;">Perfect Session! All 7 tasks completed!</h2>

                <!-- <p class="hint"> -->
                <!-- Complete sessions to collect all animals in your Rewards page! -->
                <!-- </p> -->

                <div class="button-row">
                    <button class="btn primary">
                        <span><i class="bi bi-star"></i></span>
                        Start New Session
                    </button>

                    <RouterLink class="btn secondary" to="/">
                        <span><i class="bi bi-house"></i></span>
                        Exit to Home
                    </RouterLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
</script>

<style scoped>
* {
    font-family: 'Baloo 2', cursive;
}

.complete-page {
    max-width: 860px;
    margin: 0 auto;
    /* padding: 90px 0px 40px; */
    padding-top: 90px;
}

.complete-card {
    width: 39.7vw;
    min-width: 720px;
    height: 70vh;
    background: #ffffff;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 18px 40px rgba(120, 80, 45, 0.08);
    padding: 0 0 10px 0;
}

.card-header {
    width: 100%;
    height: 16.5%;
    background: #a9d7c7;
    display: flex;
    align-items: center;
    padding: 0 5%;
    box-sizing: border-box;
    gap: 22px;
}

.icon-box {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.38);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
}

.eyebrow {
    margin: 0 0 5px;
    font-size: 1.42rem;
    letter-spacing: 3px;
    font-weight: 700;
    color: #5c796f;
}

h1 {
    margin: 0;
    font-size: 24px;
    line-height: 1.1;
    color: #1f160f;
    /* font-family: Georgia, "Times New Roman", serif; */
}

.subtitle {
    margin: 8px 0 0;
    font-size: 13px;
    color: #4f6c62;
}

.card-body {
    height: 72.5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5.8vh;
    box-sizing: border-box;
}

.reward-card {
    width: 236px;
    height: 162px;
    border-radius: 20px;
    background: #f6ecdd;
    border: 2px solid #efd3bf;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 14px;
}

.animal {
    font-size: 62px;
    line-height: 1;
}

.reward-card p {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #bc704c;
}

.completed-pill {
    margin-top: 28px;
    width: 146px;
    height: 39px;
    border-radius: 999px;
    background: #eaf4ef;
    color: #66bfa7;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 9px;
    font-size: 15px;
    font-weight: 700;
}

.card-body h2 {
    margin: 22px 0 0;
    font-size: 15px;
    color: #61b99f;
    font-weight: 800;
}

.hint {
    margin: 22px 0 0;
    font-size: 16px;
    color: #9b8f8b;
}

.button-row {
    margin-top: 32px;
    display: flex;
    gap: 12px;
}

.btn {
    height: 46px;
    border-radius: 999px;
    padding: 0 24px;
    border: none;
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 1rem;
}

.primary {
    /* width: 196px; */
    background: #bd6d48;
    color: #ffffff;
}

.secondary {
    /* width: 160px; */
    background: #ffffff;
    color: #6b574b;
    border: 1.5px solid #ddd6d2;
}

.btn:hover {
    transform: translateY(-1px);
}
</style>