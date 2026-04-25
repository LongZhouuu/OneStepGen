<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-left">
        © 2026 OneStepGen. A simple tool designed for focus, for a calmer, more organised day. |
        <a target="_blank" href="https://icons8.com/icon/ulGWjC9dcyIM/tea">Tea</a> icon by
        <a target="_blank" href="https://icons8.com">Icons8</a> |
        Sound Effect by <a
          href="https://pixabay.com/users/liecio-3298866/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=190265">LIECIO</a>
        from <a
          href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=190265">Pixabay</a>
      </div>

      <div class="footer-right">
        <!-- <RouterLink to="/privacy">Privacy</RouterLink> -->
        <!-- <RouterLink to="/terms">Terms</RouterLink> -->
        <!-- <RouterLink to="/tools/support">Support</RouterLink> -->
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
  background-color: rgba(45, 31, 20, 0.96);
}

.footer-content {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  font-size: 14.6px;
  
  backdrop-filter: blur(20px);
  padding: 20px 40px;
  min-height: 60px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 14px 24px;
}

.footer-left {
  max-width: 500px;
  line-height: 1.5;
  color: #fffcfc;
}

.footer-left a {
  color: #fffcfc;
  text-decoration: underline;
  transition: opacity 0.3s ease;
}

.footer-left a:hover {
  opacity: 0.9;
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