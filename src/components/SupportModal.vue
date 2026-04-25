<template>
  <div class="support-overlay" @click.self="$emit('close')">
    <div class="support-modal">

      <!-- Close Button -->
      <button class="close-btn" @click="$emit('close')">✕</button>

      <component
        :is="currentComponent"
        @goBox="currentView='breathing'"
        @goRainbow="currentView='rainbow'"
        @goHelpline="currentView='helpline'"
        @back="currentView='menu'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import SupportMenu from './SupportMenu.vue'
import BoxBreathingPanel from './BoxBreathingPanel.vue'
import RainbowPanel from './RainbowPanel.vue'
import HelplinePanel from './HelplinePanel.vue'

defineEmits(['close'])

const currentView = ref('menu')

const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'breathing':
      return BoxBreathingPanel
    case 'rainbow':
      return RainbowPanel
    case 'helpline':
      return HelplinePanel
    default:
      return SupportMenu
  }
})
</script>

<style scoped>
.support-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.18);
  backdrop-filter:blur(8px);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index:9999;
}

.support-modal{
  width:520px;
  max-width:92%;
  background:white;
  border-radius:28px;
  padding:34px;
  position:relative;
}

.close-btn{
  position:absolute;
  top:18px;
  right:18px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #eeeeee;
  color: #555;
  font-size: 15px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: #e0e0e0;
}
</style>