<template>
  <div class="app-wrapper">
    <NavBar />

    <main class="main-content" :class="{ 'workflow-main': isWorkflowPage }">
      <RouterView />
    </main>

    <BottomNav v-if="isWorkflowPage" />
    <SiteFooter v-else-if="!isHomePage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import BottomNav from './components/BottomNav.vue'

const route = useRoute()

const isHomePage = computed(() => route.path === '/')
const isWorkflowPage = computed(() => route.path.startsWith('/workflow/'))
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Baloo 2', cursive;
}

.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at -20% 80%,
      rgba(168, 89, 20, 0.5) 0%,
      rgba(245, 222, 195, 0.2) 90%);
  background-attachment: fixed;
}

.main-content {
  flex: 1;
}

.workflow-main {
  padding-bottom: 120px;
}
</style>