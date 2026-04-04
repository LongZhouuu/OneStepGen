<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app-wrapper">
    <NavBar />
    <RouterView />
  </div>

</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Baloo 2', cursive;
}

.app-wrapper {
  min-height: 100vh;
  background: radial-gradient(
    circle at -20% 80%,
    rgba(168, 89, 20, 0.5) 0%,
    rgba(245, 222, 195, 0.2) 90%
  );
  background-attachment: fixed;
}
</style>