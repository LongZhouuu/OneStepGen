<template>
  <div class="app-wrapper">
    <NavBar />

    <!-- AI supported based workflow content -->
    <main class="main-content" :class="{ 'workflow-main': isWorkflowPage }">
      <RouterView />
    </main>

    <!-- if not workflow page, show bottom navigation -->
    <BottomNav v-if="isWorkflowPage" />
    <SiteFooter v-else />

    <!-- Global Floating Support Button -->
    <FloatingSupportButton @open="openSupport = true" />

    <!-- Support Modal -->
    <SupportModal
      v-if="openSupport"
      @close="openSupport = false"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, RouterView } from 'vue-router'

import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import BottomNav from './components/BottomNav.vue'

import FloatingSupportButton from './components/FloatingSupportButton.vue'
import SupportModal from './components/SupportModal.vue'

const route = useRoute()

const isWorkflowPage = computed(() => route.path.startsWith('/workflow/'))

const openSupport = ref(false)
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
