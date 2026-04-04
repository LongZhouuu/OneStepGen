<template>
  <section class="hero-section">
    <NavBar />
    <div class="hero-content">
      <h1 class="hero-title">Welcome to OneStepGen</h1>
      <p class="hero-subtitle">Your journey starts here.</p>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  background-image: url('/hero-bg.JPG');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  text-align: center;
  color: #333;
  padding: 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.8;
}
</style>
