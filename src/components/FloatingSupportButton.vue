<template>
  <button
    ref="buttonRef"
    class="float-support"
    type="button"
    aria-label="Open support tools"
    @click="$emit('open')"
  >
    <!-- Tooltip -->
    <span class="float-tooltip">Support</span>

    <img class="icon-img" :src="supportIconUrl" alt="" aria-hidden="true" />
  </button>
</template>

<script setup>
import { ref } from 'vue'
import supportIconUrl from '@/assets/support-icon.png'

defineEmits(['open'])

const buttonRef = ref(null)

defineExpose({
  focus: () => buttonRef.value?.focus(),
})
</script>

<style scoped>
/* Main Floating Button */
.float-support {
  position: fixed;
  right: 26px;
  bottom: 200px;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: #b66a48;
  color: white;
  cursor: pointer;
  z-index: 999;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.14);

  transition: all 0.28s ease;

  animation: pulse 2.8s infinite;
}

/* Outer Hover Ring */
.float-support::before {
  content: "";
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  background: rgba(182, 106, 72, 0.18);
  transform: scale(0.8);
  opacity: 0;
  transition: 0.28s ease;
  z-index: -1;
}

/* Hover */
.float-support:hover,
.float-support:focus-visible {
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.2);
}

.float-support:focus-visible {
  outline: 3px solid #2a180f;
  outline-offset: 4px;
}

.float-support:hover::before,
.float-support:focus-visible::before {
  opacity: 1;
  transform: scale(1);
}

/* Tooltip */
.float-tooltip {
  position: absolute;
  right: 84px;
  top: 50%;
  transform: translateY(-50%) translateX(8px);

  background: #2a180f;
  color: white;
  font-size: 15px;
  font-weight: 600;
  padding: 11px 18px;
  border-radius: 16px;

  white-space: nowrap;
  opacity: 0;
  transition: 0.25s ease;
}

/* Tooltip Arrow */
.float-tooltip::after {
  content: "";
  position: absolute;
  right: -7px;
  top: 50%;
  transform: translateY(-50%);
  border-left: 7px solid #2a180f;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
}

.float-support:hover .float-tooltip,
.float-support:focus-visible .float-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* Support Icon */
.icon-img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: brightness(0) invert(1) drop-shadow(0 0 0 white) drop-shadow(0 0 0 white);
  transition: transform 0.25s ease;
  animation: support-lift 2.4s ease-in-out infinite;
  transform-origin: center;
}

.float-support:hover .icon-img,
.float-support:focus-visible .icon-img {
  transform: scale(1.1);
  animation-duration: 1.1s;
}

@keyframes support-lift {
  0%, 40%, 100% { transform: scale(1); }
  15% { transform: translateY(-1px) scale(1.08); }
  30% { transform: translateY(0) scale(1.02); }
}

/* Idle Pulse Effect */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(182, 106, 72, 0.28);
  }

  70% {
    box-shadow: 0 0 0 14px rgba(182, 106, 72, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(182, 106, 72, 0);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .float-support {
    width: 60px;
    height: 60px;
    right: 18px;
    bottom: 18px;
  }

  .float-tooltip {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .float-support,
  .float-support::before,
  .float-tooltip,
  .icon-img {
    animation: none;
    transition: none;
  }

  .float-support:hover,
  .float-support:focus-visible,
  .float-support:hover .icon-img,
  .float-support:focus-visible .icon-img {
    transform: none;
  }
}
</style>
