<template>
  <div class="panel">
    <button class="back-btn" @click="$emit('back')">← Back</button>

    <h2>Australian Helplines</h2>
    <p class="sub">Trusted support services.</p>

    <div class="resource-card">
      <strong>Lifeline</strong>
      <p>13 11 14</p>
    </div>

    <div class="resource-card">
      <strong>Beyond Blue</strong>
      <p>1300 22 4636</p>
    </div>

    <div class="resource-card">
      <strong>Headspace</strong>
      <p>headspace.org.au</p>
    </div>
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
  margin-bottom: 18px;
}

.resource-card {
  background: #faf6f2;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
}
</style>