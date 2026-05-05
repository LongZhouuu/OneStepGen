<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import QuietPlacesModal from './QuietPlacesModal.vue'

const quietPlacesOpen = ref(false)
const focusMapBtnRef = ref(null)

function openQuietPlaces() {
  quietPlacesOpen.value = true
}

function closeQuietPlaces() {
  quietPlacesOpen.value = false
  requestAnimationFrame(() => {
    focusMapBtnRef.value?.focus()
  })
}
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
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Nav Links -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'Planner' }">Workspace</RouterLink>
          </li>

          <!-- Tools Dropdown
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="toolsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Tools
            </a>
            <ul class="dropdown-menu" aria-labelledby="toolsDropdown">
              <li>
                <RouterLink class="dropdown-item" to="/tools/planner">Planner</RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/tools/prioritizer">
                  Prioritizer <span class="nav-status">Coming soon</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/tools/support">
                  Support <span class="nav-status">Coming soon</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/tools/tips">Tips & Templates</RouterLink>
              </li> -->
              <!-- <li> -->
                <!-- <RouterLink class="dropdown-item" to="/tools/planner/swipper">Swipe</RouterLink> -->
              <!-- </li> -->
            <!-- </ul>
          </li> -->

          <li class="nav-item">
            <RouterLink class="nav-link" to="/reward">
              Reward<span class="nav-status">Coming soon</span>
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">About us</RouterLink>
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

/* .dropdown-menu {
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem 0;
} */

/* .dropdown-item {
  font-size: 1.2rem;
  padding: 0.5rem 1.5rem;
  color: #333;
} */

.nav-status {
  display: inline-block;
  margin-left: 8px;
  padding: 3px 8px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b46a2d;
  background-color: #f8dabd;
  /* border: 1px solid rgba(180, 106, 45, 0.18); */
  border-radius: 10px;
  line-height: 1.2;
  vertical-align: middle;
}

/* .dropdown-item:hover {
  background-color: rgba(239, 150, 66, 0.683);
  color: #333;
} */

@media (max-width: 991px) {
  .navbar .container {
    padding-left: 12px;
    padding-right: 12px;
  }
  .navbar-collapse {
    margin-top: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.9);
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
  /* .nav-link, */
  /* .dropdown-item {
    font-size: 1rem;
  } */
}
</style>
