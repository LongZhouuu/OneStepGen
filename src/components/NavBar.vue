<script setup>
import { RouterLink } from 'vue-router'
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

          <!-- Tools Dropdown -->
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
                <RouterLink class="dropdown-item" to="/tools/prioritizer">Prioritizer</RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/tools/support">Support</RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/tools/tips">Tips & Templates</RouterLink>
              </li>
              <!-- <li> -->
                <!-- <RouterLink class="dropdown-item" to="/tools/planner/swipper">Swipe</RouterLink> -->
              <!-- </li> -->
            </ul>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/reward">Reward</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/About">About us</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 998;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  color: #000;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
}

.dropdown-menu {
  border: none;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem 0;
}

.dropdown-item {
  font-size: 1.2rem;
  padding: 0.5rem 1.5rem;
  color: #333;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
}
</style>
