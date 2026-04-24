<template>
  <div class="panel">
    <button class="back-btn" @click="$emit('back')">← Back</button>

    <h2>Box Breathing</h2>
    <p class="sub">A guided breathing exercise to help you feel calm.</p>

    <div class="placeholder-box"></div>

    <p class="hint">Inhale • Hold • Exhale • Hold</p>
  </div>
</template>

<script setup>
defineEmits(['back'])
</script>

<style scoped>
.panel {
  padding-top: 10px;
}

.back-btn {
  border: none;
  background: none;
  cursor: pointer;
  margin-bottom: 18px;
  font-size: 15px;
}

.sub,
.hint {
  color: #7b6a5c;
}

.placeholder-box {
  width: 140px;
  height: 140px;
  margin: 24px auto;
  border-radius: 20px;
  background: #f6e7de;
}
</style>