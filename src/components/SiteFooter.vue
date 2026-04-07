<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-left">
        © 2026 OneStepGen. A simple tool designed for focus, for a calmer, more organised day. |
        <a target="_blank" href="https://icons8.com/icon/ulGWjC9dcyIM/tea">Tea</a> icon by 
        <a target="_blank" href="https://icons8.com">Icons8</a>
      </div>

      <div class="footer-right">
        <RouterLink to="/privacy">Privacy</RouterLink>
        <RouterLink to="/terms">Terms</RouterLink>
        <RouterLink to="/tools/support">Support</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.site-footer {
  margin-top: auto;
}

.footer-content {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  font-size: 14.6px;
  background-color: rgba(224, 223, 223, 0.384);
  padding: 20px 40px;
  min-height: 60px;
}

.footer-left {
  max-width: 500px;
  line-height: 1.5;
  color: #444;
}

.footer-left a {
  color: #333;
  text-decoration: underline;
  transition: opacity 0.3s ease;
}

.footer-left a:hover {
  opacity: 0.7;
}

.footer-right {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.footer-right a {
  color: #333;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.footer-right a:hover {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 20px;
  }

  .footer-left {
    max-width: 100%;
  }
}
</style>