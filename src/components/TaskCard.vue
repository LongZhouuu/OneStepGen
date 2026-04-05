<template>
    <section class="planner-card">
        <h1 class="title">Swiping Planner</h1>

        <div class="task-board">
            <div class="task-note">
                <span>Update C2 project<br />progress with Ted</span>
                <div class="note-corner"></div>
            </div>
        </div>

        <div class="swipe-hints">
            <span>← Swipe left to complete a task</span>
            <span>Swipe right to skip a task →</span>
        </div>
    </section>
</template>
<style>
.planner-card {
    background: #f8f8f8;
    border-radius: 18px;
    padding: 28px 18px 18px;
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
    padding: 28px 0 22px;
}

.task-note {
    position: relative;
    width: 150px;
    height: 190px;
    background: #efd3bd;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 18px;
    font-weight: 700;
    line-height: 1.35;
    color: #343434;
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
    font-size: 9px;
    color: #b8b8b8;
}
</style>