<template>
  <div>
    <!-- Menu Title -->
    <h2 class="support-title">
      <img class="title-icon" :src="supportIconUrl" alt="" aria-hidden="true" />

      <span>Support</span>
    </h2>
    <p class="sub">Choose what you need right now</p>

    <!-- Box Breathing -->
    <button class="support-card" type="button" @click="$emit('goBox')">
      <span class="support-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M3 8.5h10.5a2.5 2.5 0 1 0-2.5-2.5" />
          <path d="M3 12.5h14a2.5 2.5 0 1 1-2.5 2.5" />
          <path d="M3 16.5h7" />
        </svg>
      </span>
      <span class="support-text">
        <span class="support-heading">Box Breathing</span>
        <span class="support-sub">Calm your nervous system with a guided breathing exercise</span>
      </span>
    </button>

    <!-- Rainbow Grounding -->
    <button class="support-card" type="button" @click="$emit('goRainbow')">
      <span class="support-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M3 18a9 9 0 0 1 18 0" />
          <path d="M6 18a6 6 0 0 1 12 0" />
          <path d="M9 18a3 3 0 0 1 6 0" />
        </svg>
      </span>
      <span class="support-text">
        <span class="support-heading">Rainbow Grounding</span>
        <span class="support-sub">Bring you back to the present moment</span>
      </span>
    </button>

    <!-- Helpful Resources -->
    <button class="support-card" type="button" @click="$emit('goHelpline')">
      <span class="support-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
          stroke-linejoin="round">
          <path
            d="M4.5 5.7c0-.7.5-1.2 1.2-1.2h2.6c.5 0 1 .3 1.1.8l1.1 3.1c.2.5 0 1-.4 1.3l-1.8 1.2a12 12 0 0 0 5.8 5.8l1.2-1.8c.3-.4.8-.6 1.3-.4l3.1 1.1c.5.2.8.6.8 1.1v2.6c0 .7-.5 1.2-1.2 1.2A15.5 15.5 0 0 1 4.5 5.7z" />
        </svg>
      </span>
      <span class="support-text">
        <span class="support-heading">Helpful Resources</span>
        <span class="support-sub">Crisis support, mental health lines &amp; community resources</span>
      </span>
    </button>

    <!-- Footer -->
    <div class="support-footer">
      <p class="support-footer-text">
        <span class="support-footer-text-bold">Note:</span>
        These resources are provided <strong>for general information only</strong>
        and <strong>should not replace professional advice</strong>.
        Always seek professional help if you are in crisis.
      </p>
    </div>
  </div>
</template>

<script setup>
import supportIconUrl from '@/assets/support-icon.png'

defineEmits(['goBox', 'goRainbow', 'goHelpline'])
</script>

<style scoped>
.support-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 30px;
  color: #4d2a1d;
}

.title-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  filter:
    brightness(0) saturate(100%) invert(48%) sepia(23%) saturate(965%) hue-rotate(335deg) brightness(94%) contrast(89%)
    drop-shadow(0 0 0 #b66a48)
    drop-shadow(0 0 0 #b66a48);
  flex-shrink: 0;
}

.sub {
  color: #7b6a5c;
  margin: 6px 0 22px;
  font-size: 15px;
}

.support-card {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
  text-align: left;
  background: #fdf5f1;
  border: 1px solid rgba(180, 106, 45, 0.12);
  border-radius: 18px;
  padding: 18px 22px;
  margin-bottom: 14px;
  cursor: pointer;
  font-family: inherit;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.support-card:last-child {
  margin-bottom: 0;
}

.support-card:hover {
  border-color: #b66a48;
  background: #fff9f7;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(97, 75, 52, 0.1);
}

.support-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #c88667;
}

.support-icon svg {
  width: 100%;
  height: 100%;
}

.support-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.support-heading {
  font-size: 17px;
  font-weight: 600;
  color: #2a180f;
  line-height: 1.3;
}

.support-sub {
  font-size: 14.5px;
  line-height: 1.45;
  color: #7b6a5c;
}
</style>
