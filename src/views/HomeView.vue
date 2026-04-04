<template>
  <div>
    <section class="hero-wrapper">
      <NavBar />
      <HeroSection />
    </section>
  </div>
</template>

<script setup>
import HeroSection from '@/components/HeroSection.vue'
import NavBar from "../components/NavBar.vue"
</script>

<style scoped>
.hero-wrapper {
  position: relative;
}
</style>