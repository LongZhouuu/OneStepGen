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
}

.app-wrapper {
  min-height: 100vh;
}
</style>