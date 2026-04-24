<!-- RainbowPanel.vue -->
<template>
  <div class="panel">
    <button class="back-btn" @click="$emit('back')">← Back</button>

    <h2>Rainbow Grounding</h2>
    <p class="sub">Reconnect with the present moment.</p>

    <div class="color-card">Find one blue object near you</div>

    <input
      class="input"
      type="text"
      placeholder="Type object name..."
    />
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

.sub {
  color: #7b6a5c;
}

.color-card {
  background: #d9ebff;
  padding: 22px;
  border-radius: 18px;
  margin: 20px 0;
  text-align: center;
}

.input {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}
</style>