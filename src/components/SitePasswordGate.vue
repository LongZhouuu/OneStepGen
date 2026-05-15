<template>
  <div class="site-gate" role="dialog" aria-modal="true" aria-labelledby="site-gate-title">
    <div class="site-gate__panel">
      <div class="site-gate__brand">
        <img src="@/assets/logo.svg" alt="" width="48" height="48" class="site-gate__logo" />
        <h1 id="site-gate-title" class="site-gate__title">OneStepGen</h1>
        <p class="site-gate__subtitle">This space is private. Enter the access phrase to continue.</p>
      </div>

      <div v-if="misconfigured" class="site-gate__alert" role="alert">
        <strong>Configuration required.</strong>
        <template v-if="serverGateMode">
          <p class="site-gate__alert-p">
            Use <strong>server gate</strong>: set <code>VITE_SITE_GATE=server</code> and
            <code>VITE_API_BASE_URL</code> in the build, then set
            <code>SITE_ACCESS_PASSWORD</code> and <code>SITE_GATE_SESSION_SECRET</code> on the API (Lambda).
          </p>
        </template>
        <template v-else>
          <p class="site-gate__alert-p">
            Set <code>VITE_SITE_ACCESS_PASSWORD</code> in your hosting build environment, then redeploy.
          </p>
        </template>
      </div>

      <form v-else class="site-gate__form" @submit.prevent="onSubmit">
        <label class="site-gate__label" for="site-gate-password">Access phrase</label>
        <input
          id="site-gate-password"
          v-model="password"
          type="password"
          name="password"
          autocomplete="current-password"
          class="site-gate__input"
          :class="{ 'site-gate__input--error': showError }"
          :aria-invalid="showError"
          aria-describedby="site-gate-hint site-gate-error"
          placeholder="Enter password"
          :disabled="submitting"
        />
        <p id="site-gate-hint" class="site-gate__hint">Use a password manager to paste the phrase.</p>
        <p v-if="showError" id="site-gate-error" class="site-gate__error" role="alert">That phrase is not correct.</p>
        <button type="submit" class="site-gate__submit" :disabled="submitting">
          {{ submitting ? 'Checking…' : 'Continue' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  grantSiteAccess,
  passwordMatches,
  isProductionMisconfigured,
  usesServerSiteGate,
  verifySitePasswordOnServer,
} from '@/utils/siteAccess'

defineOptions({ name: 'SitePasswordGate' })

const emit = defineEmits(['unlocked'])

const password = ref('')
const showError = ref(false)
const submitting = ref(false)
const misconfigured = computed(() => isProductionMisconfigured())
const serverGateMode = computed(() => usesServerSiteGate())

onMounted(() => {
  document.body.classList.add('site-gate-open')
})

onUnmounted(() => {
  document.body.classList.remove('site-gate-open')
})

async function onSubmit() {
  if (misconfigured.value) return
  showError.value = false
  submitting.value = true
  try {
    if (serverGateMode.value) {
      const ok = await verifySitePasswordOnServer(password.value)
      if (ok) {
        emit('unlocked')
        return
      }
    } else if (passwordMatches(password.value)) {
      grantSiteAccess()
      emit('unlocked')
      return
    }
    showError.value = true
    password.value = ''
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.site-gate {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right))
    max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
  background: radial-gradient(
      circle at 20% 20%,
      rgba(193, 113, 79, 0.22) 0%,
      transparent 45%
    ),
    radial-gradient(circle at 80% 80%, rgba(97, 185, 159, 0.18) 0%, transparent 42%),
    linear-gradient(165deg, #f7efe6 0%, #ede4d8 50%, #e8dccf 100%);
}

.site-gate__panel {
  width: min(100%, 26rem);
  padding: clamp(1.25rem, 4vw, 2rem);
  border-radius: clamp(16px, 3vw, 24px);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 20px 50px rgba(45, 31, 20, 0.12), 0 0 0 1px rgba(193, 113, 79, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.site-gate__brand {
  text-align: center;
  margin-bottom: clamp(1rem, 3vw, 1.5rem);
}

.site-gate__logo {
  display: block;
  margin: 0 auto 0.75rem;
}

.site-gate__title {
  margin: 0;
  font-size: clamp(1.35rem, 4.5vw, 1.75rem);
  font-weight: 800;
  color: #2d1f14;
  letter-spacing: 0.02em;
}

.site-gate__subtitle {
  margin: 0.5rem 0 0;
  font-size: clamp(0.875rem, 2.8vw, 0.95rem);
  line-height: 1.5;
  color: rgba(45, 31, 20, 0.65);
}

.site-gate__alert {
  font-size: 0.875rem;
  line-height: 1.55;
  color: #5c2d2d;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.25);
  border-radius: 12px;
  padding: 0.85rem 1rem;
}

.site-gate__alert-p {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  line-height: 1.5;
}

.site-gate__alert code {
  font-size: 0.8em;
  word-break: break-all;
}

.site-gate__form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.site-gate__label {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(45, 31, 20, 0.75);
}

.site-gate__input {
  width: 100%;
  min-height: 48px;
  padding: 0.65rem 0.85rem;
  font: inherit;
  font-size: 16px;
  border-radius: 12px;
  border: 1.5px solid rgba(193, 113, 79, 0.28);
  background: #fff;
  color: #2d1f14;
  box-sizing: border-box;
}

.site-gate__input:focus {
  outline: none;
  border-color: rgba(193, 113, 79, 0.65);
  box-shadow: 0 0 0 3px rgba(193, 113, 79, 0.2);
}

.site-gate__input--error {
  border-color: rgba(231, 76, 60, 0.55);
}

.site-gate__hint {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(45, 31, 20, 0.45);
}

.site-gate__error {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #c0392b;
}

.site-gate__submit {
  margin-top: 0.5rem;
  min-height: 48px;
  border: none;
  border-radius: 12px;
  background: #c1714f;
  color: #fff;
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.site-gate__submit:hover:not(:disabled) {
  background: #a85f42;
}

.site-gate__submit:active:not(:disabled) {
  transform: scale(0.98);
}

.site-gate__submit:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}

@media (prefers-reduced-motion: reduce) {
  .site-gate__submit {
    transition: none;
  }
  .site-gate__submit:active {
    transform: none;
  }
}
</style>

<style>
body.site-gate-open {
  overflow: hidden;
}
</style>
