<template>
  <div
    v-if="visible"
    class="bottom-nav-hint"
    role="status"
    aria-live="polite"
  >
    <div class="hint-stack">
      <div class="hint-card">
        <button
          type="button"
          class="hint-close"
          aria-label="Dismiss navigation tip"
          @click="dismiss"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <p class="hint-title">Switch modes anytime</p>
        <p class="hint-body">
          Use the bottom nav to move between Dump, Plan, Focus and Complete.
        </p>
      </div>

      <svg
        class="hint-arrow"
        viewBox="0 0 70 80"
        aria-hidden="true"
      >
        <path
          d="M35 0 Q8 46 42 64"
          stroke="#c1714f"
          stroke-width="2"
          fill="none"
          stroke-dasharray="5,3"
          stroke-linecap="round"
        />
        <polygon
          points="36,64 42,76 48,64"
          fill="#c1714f"
          transform="rotate(-45, 42, 64)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
/** Workflow tip above bottom nav; dismiss hides until browser session ends. */
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'onestep-bottom-nav-hint-dismissed'

const visible = ref(false)

onMounted(() => {
  try {
    visible.value = sessionStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    visible.value = true
  }
})

function dismiss() {
  visible.value = false
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore quota / private mode */
  }
}
</script>

<style scoped>
.bottom-nav-hint {
  position: fixed;
  left: 22px;
  bottom: calc(78px + env(safe-area-inset-bottom, 0px));
  z-index: 210;
  pointer-events: none;
}

.hint-stack {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: min(240px, max(148px, calc((100vw - 980px) / 2 - 18px)));
}

.hint-card {
  position: relative;
  padding: 14px 36px 14px 16px;
  border-radius: 14px;
  background: rgba(45, 31, 20, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 28px rgba(30, 18, 10, 0.28);
  pointer-events: auto;
}

.hint-title {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
  color: #fdf6f0;
}

.hint-body {
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.45;
  color: rgba(253, 246, 240, 0.72);
}

.hint-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(253, 246, 240, 0.55);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.hint-close svg {
  width: 14px;
  height: 14px;
}

.hint-card:hover .hint-close,
.hint-card:focus-within .hint-close {
  opacity: 1;
}

.hint-close:hover {
  color: #fdf6f0;
  background: rgba(255, 255, 255, 0.1);
}

.hint-close:focus-visible {
  opacity: 1;
  outline: 2px solid #d4956e;
  outline-offset: 2px;
}

.hint-arrow {
  display: block;
  flex-shrink: 0;
  align-self: center;
  width: 70px;
  height: 80px;
  margin: -2px auto 0;
  pointer-events: none;
}

@media (max-width: 640px) {
  .bottom-nav-hint {
    left: 14px;
    bottom: calc(72px + env(safe-area-inset-bottom, 0px));
  }

  .hint-stack {
    max-width: min(200px, 42vw);
  }

  .hint-title {
    font-size: 14px;
  }

  .hint-body {
    font-size: 12px;
  }

  .hint-arrow {
    width: 60px;
    height: 68px;
    margin-top: -2px;
  }
}
</style>
