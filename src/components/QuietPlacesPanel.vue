<!-- QuietPlacesPanel.vue: Shows a simple nearby quiet spaces support view. -->
<template>
  <div class="panel">
    <button class="back-btn" type="button" @click="$emit('back')">
      ← Back
    </button>

    <h2>Nearby Quiet Spaces</h2>
    <p class="sub">See recommended workplaces around you</p>
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

h2 {
  margin: 0;
  font-size: 28px;
  color: #2f261f;
}

.sub {
  color: #7b6a5c;
  margin-top: 10px;
}
</style>
