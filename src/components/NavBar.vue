<script setup>
/** Primary site navigation with mobile menu and Focus map entry. */
import { ref, watch, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import QuietPlacesModal from './QuietPlacesModal.vue'

const quietPlacesOpen = ref(false)
const focusMapBtnRef = ref(null)
const navOpen = ref(false)
const route = useRoute()

/** Opens the quiet-places modal and closes the mobile nav. */
function openQuietPlaces() {
  closeNav()
  quietPlacesOpen.value = true
}

/** Closes the quiet-places modal and restores focus to the map button. */
function closeQuietPlaces() {
  quietPlacesOpen.value = false
  requestAnimationFrame(() => {
    focusMapBtnRef.value?.focus()
  })
}

/** Toggles the mobile navigation drawer open or closed. */
function toggleNav() {
  navOpen.value = !navOpen.value
}

/** Closes the mobile navigation drawer. */
function closeNav() {
  navOpen.value = false
}

watch(
  () => route.path,
  () => {
    closeNav()
  },
)

watch(navOpen, (open) => {
  document.body.classList.toggle('navbar-menu-open', open)
})

onUnmounted(() => {
  document.body.classList.remove('navbar-menu-open')
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light py-2">
    <div class="container">
      <!-- Logo -->
      <RouterLink class="navbar-brand d-flex align-items-center" to="/">
        <img src="@/assets/logo.svg" alt="OneStepGen" height="38" class="me-2" />
        <!-- <span class="brand-text">OneStepGen</span> -->
      </RouterLink>

      <!-- Mobile Toggle Button -->
      <button
        class="navbar-toggler"
        type="button"
        aria-controls="navbarNav"
        :aria-expanded="navOpen"
        aria-label="Toggle navigation"
        @click="toggleNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        v-if="navOpen"
        class="navbar-backdrop"
        aria-hidden="true"
        @click="closeNav"
      />

      <!-- Nav Links -->
      <div
        class="collapse navbar-collapse justify-content-end"
        :class="{ show: navOpen }"
        id="navbarNav"
      >
        <ul class="navbar-nav align-items-center">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" @click="closeNav">Home</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'Planner' }" @click="closeNav">Workspace</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/reward" @click="closeNav">Reward</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/about" @click="closeNav">About us</RouterLink>
          </li>

          <li class="nav-item nav-item--focus-map">
            <button
              ref="focusMapBtnRef"
              type="button"
              class="nav-focus-map-btn"
              aria-haspopup="dialog"
              :aria-expanded="quietPlacesOpen"
              @click="openQuietPlaces"
            >
              Focus map
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <QuietPlacesModal v-if="quietPlacesOpen" @close="closeQuietPlaces" />
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 998;
  isolation: isolate;
  background-color: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8px 24px rgba(51, 51, 51, 0.04);
}

@supports ((backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px))) {
  .navbar {
    background-color: rgba(255, 255, 255, 0.42);
    backdrop-filter: saturate(180%) blur(16px);
    -webkit-backdrop-filter: saturate(180%) blur(16px);
  }
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: #333;
}

.nav-link {
  color: #333;
  font-size: 1.2rem;
  font-weight: 400;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ce752d;
  /* background-color: rgba(255, 255, 255, 0.5); */
  /* border-radius: 6px; */
}

.nav-focus-map-btn {
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.45rem 1.15rem;
  border-radius: 999px;
  color: #fff;
  background: linear-gradient(135deg, #ce752d 0%, #b45a20 100%);
  box-shadow: 0 2px 10px rgba(206, 117, 45, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
  margin-left: 0.35rem;
  margin-right: 0.35rem;
}

.nav-focus-map-btn:hover {
  filter: brightness(1.06);
  box-shadow: 0 4px 14px rgba(206, 117, 45, 0.45);
}

.nav-focus-map-btn:focus-visible {
  outline: 3px solid #4d2a1d;
  outline-offset: 3px;
}

.navbar-backdrop {
  display: none;
}

:global(body.navbar-menu-open) {
  overflow: hidden;
}

@media (max-width: 991px) {
  .navbar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 997;
    background: rgba(30, 22, 16, 0.35);
  }

  .navbar .container {
    padding-left: 12px;
    padding-right: 12px;
  }

  .navbar-collapse {
    position: relative;
    z-index: 999;
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.9);
  }

  .navbar-collapse:not(.show) {
    display: none;
  }
  .navbar-nav {
    width: 100%;
    align-items: flex-start !important;
    gap: 4px;
  }

  .nav-focus-map-btn {
    width: 100%;
    text-align: center;
    margin: 6px 0;
  }
}
</style>
