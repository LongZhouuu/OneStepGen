<template>
  <SitePasswordGate v-if="!siteUnlocked" @unlocked="onSiteUnlocked" />
  <div v-else class="app-wrapper">
    <NavBar />

    <!-- AI supported based workflow content -->
    <main class="main-content" :class="{ 'workflow-main': isWorkflowPage }">
      <RouterView />
    </main>

    <!-- if not workflow page, show bottom navigation -->
    <BottomNav v-if="isWorkflowPage" />
    <SiteFooter v-else />

    <!-- Global Floating Support Button -->
    <FloatingSupportButton ref="supportButtonRef" @open="openSupportFromButton" />

    <!-- Support Modal -->
    <SupportModal
      v-if="openSupport"
      :initial-view="supportView"
      @close="closeSupport"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'

import {
  isSiteAccessGranted,
  isGateSkippedInDev,
  isServerSiteGate,
  checkServerSiteGateFromCookie,
} from '@/utils/siteAccess'
import SitePasswordGate from './components/SitePasswordGate.vue'

import NavBar from './components/NavBar.vue'
import SiteFooter from './components/SiteFooter.vue'
import BottomNav from './components/BottomNav.vue'

import FloatingSupportButton from './components/FloatingSupportButton.vue'
import SupportModal from './components/SupportModal.vue'

const route = useRoute()

const siteUnlocked = ref(
  isGateSkippedInDev() || (!isServerSiteGate() && isSiteAccessGranted()),
)

function onSiteUnlocked() {
  siteUnlocked.value = true
}

const isWorkflowPage = computed(() => route.path.startsWith('/workflow/'))

/* ---------- Support Modal ---------- */
// Two ways to open the SupportModal:
//   1) Floating heart button (global, always visible) -> opens at the menu
//   2) "Take a breath instead" link inside TipsPanel  -> opens directly at a specific view
//
// Because TipsPanel lives several layers deep in the component tree, we use a
// browser-native CustomEvent on `window` instead of bubbling props/emits up.

const openSupport = ref(false)
const supportButtonRef = ref(null)
// Which sub-view SupportModal should open on: 'menu' | 'breathing' | 'rainbow' | 'helpline'
const supportView = ref('menu')

// Path 1: floating button -> always start from the menu so the user can pick
function openSupportFromButton() {
  supportView.value = 'menu'
  openSupport.value = true
}

function closeSupport() {
  openSupport.value = false
  requestAnimationFrame(() => {
    supportButtonRef.value?.focus()
  })
}

// Path 2: anywhere in the app can dispatch:
//   window.dispatchEvent(new CustomEvent('open-support', { detail: { view: 'breathing' } }))
// We read the requested view from `event.detail.view` and fall back to 'menu' if missing.
function handleOpenSupportEvent(e) {
  supportView.value = e?.detail?.view ?? 'menu'
  openSupport.value = true
}

// Subscribe to the global event while App is alive; unsubscribe on teardown
// to avoid leaking listeners (especially relevant in dev with HMR).
onMounted(() => {
  window.addEventListener('open-support', handleOpenSupportEvent)
  if (!isGateSkippedInDev() && isServerSiteGate()) {
    checkServerSiteGateFromCookie().then((ok) => {
      if (ok) siteUnlocked.value = true
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('open-support', handleOpenSupportEvent)
})
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
