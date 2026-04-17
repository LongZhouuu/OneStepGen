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
              </li>
              <!-- <li> -->
                <!-- <RouterLink class="dropdown-item" to="/tools/planner/swipper">Swipe</RouterLink> -->
              <!-- </li> -->
            </ul>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/reward">
              Reward<span class="nav-status">Coming soon</span>
            </RouterLink>
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
  color: #000;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
}

.dropdown-menu {
  border: none;
  background: rgba(255, 255, 255, 0.9);
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

.nav-status {
  margin-left: 6px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b46a2d;
}

.dropdown-item:hover {
  background-color: rgba(239, 150, 66, 0.683);
  color: #333;
}

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
  .nav-link,
  .dropdown-item {
    font-size: 1rem;
  }
}
</style>
