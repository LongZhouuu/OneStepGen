<template>
    <div class="overlay">
        <div class="popup-card">
            <div class="avatar-ring">
                <div class="avatar">
                    <img src="@/assets/BreakTime.gif" alt="Tea" />
                </div>
            </div>
            <div class="restHint">Break Time!</div>
            <button class="backBtn" @click="$emit('close')">
                I'm Back
            </button>
        </div>

    </div>
</template>

<script setup></script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.popup-card {
    width: 280px;
    height: 280px;
    background: #ffffff;
    border-radius: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.avatar-ring {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    /* background: #e9e4db00; */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    right: -6px;
}

.avatar {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 50%;
    /* background: #e8caa800; */
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.restHint {
    color: #3c433b;
    font-size: 22px;
    font-weight: 600;
}

.backBtn {
    width: 170px;
    height: 34px;
    border: none;
    margin-top: 20px;
    border-radius: 28px;
    background: #cfe8c7;
    transition: all .8s;
    color: #3c433b;
    font-size: 14px;
    /* font-weight: 600; */
    cursor: pointer;
}

.backBtn:hover {
    background-color: #efd3bd;
}
</style>