<template>
  <button class="float-support" @click="$emit('open')">
    <!-- Tooltip -->
    <span class="float-tooltip">Support</span>

    <svg
      class="icon-svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M12 21.2c-.3 0-.6-.1-.8-.3C7 17.5 3.9 14.8 2.7 12.2 1.6 9.7 2.3 6.8 4.6 5.3c2-1.3 4.5-.9 6 .7l1.4 1.4 1.4-1.4c1.5-1.6 4-2 6-.7 2.3 1.5 3 4.4 1.9 6.9-1.2 2.6-4.3 5.3-8.5 8.7-.2.2-.5.3-.8.3z"
      />
    </svg>
  </button>
</template>

<script setup>
defineEmits(['open'])
</script>

<style scoped>
/* Main Floating Button */
.float-support {
  position: fixed;
  right: 26px;
  bottom: 24px;
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
.float-support:hover {
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 20px 42px rgba(0, 0, 0, 0.2);
}

.float-support:hover::before {
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

.float-support:hover .float-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* Heart Icon */
.icon-svg {
  width: 26px;
  height: 26px;
  color: white;
  transition: transform 0.25s ease;
  animation: heartbeat 2.4s ease-in-out infinite;
  transform-origin: center;
}

.float-support:hover .icon-svg {
  transform: scale(1.1);
  animation-duration: 1.1s;
}

@keyframes heartbeat {
  0%, 40%, 100% { transform: scale(1); }
  15% { transform: scale(1.12); }
  30% { transform: scale(1.02); }
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
</style>