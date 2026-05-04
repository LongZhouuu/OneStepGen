<template>
  <div class="workflow-page">
    <div class="workspace-panel active" id="panel-1">
      <div class="panel-header-band band-1">
        <div class="phb-icon" aria-hidden="true">
          <!-- local inline icon to avoid global sprite dependency -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </div>
        <div>
          <div class="phb-title">Dump your ideas</div>
          <div class="phb-desc">Write everything on your mind. No filtering — just get it all out.</div>
        </div>
      </div>
 
      <div class="panel-card panel-card-1">
        <!-- Input view -->
        <div v-if="view === 'input'" id="dump-input-view">
          <div class="input-area">
            <textarea
              v-model="inputText"
              maxlength="2500"
              placeholder="e.g. I need to finish the report for Monday, call the dentist, clean the kitchen, buy groceries, reply to Sarah's email, sort out my finances…"
              @input="onDumpTextInput"
            />
            <VoiceInputButton
              class="input-voice-button"
              aria-label="Dictate your task dump"
              @transcript="appendVoiceInput"
            />
          </div>

          <!--
            DEMO: one-click sample text for testing without typing.
            To remove: delete this block, DEMO_SAMPLE_TEXT + fillDemoSampleText() in script, and .demo-sample-row / .btn-demo-sample styles.
          -->
          <div class="demo-sample-row">
            <button
              type="button"
              class="btn-demo-sample"
              @click="fillDemoSampleText"
            >
              Use sample text
            </button>
          </div>
 
          <div class="input-tools">
            <label class="upload-btn" :class="{ 'has-file': uploadedFile || uploadedFileMeta }">
              <svg class="clip-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.82-2.82l8.49-8.48" />
              </svg>
              {{ uploadedFile ? uploadedFile.name : uploadedFileMeta ? uploadedFileMeta.name : 'Upload PDF' }}
              <input type="file" accept=".pdf" style="display:none" @change="handlePdfUpload">
            </label>
            <div v-if="!uploadedFile && !uploadedFileMeta" class="dump-text-input-meta">
              <span class="dump-char-count" :class="{ warn: charCount >= dumpInputMaxChars }">
                {{ charCount }} / {{ dumpInputMaxChars }}
              </span>
              <span v-if="charCount >= dumpInputMaxChars" class="dump-text-limit-msg" role="status">
                Maximum {{ dumpInputMaxChars }} characters.
              </span>
            </div>
            <button v-if="uploadedFile || uploadedFileMeta" class="btn-remove-pdf" @click.prevent="removePdf">✕ Remove</button>
          </div>
 
          <div class="ai-hint">
            <span class="icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l2.6 6.1L21 10l-5 4.3L17.2 21 12 17.7 6.8 21 8 14.3 3 10l6.4-1.9Z" />
              </svg>
            </span>
            <div>
              <strong>AI Prioritizer</strong> — Our AI will read your input and create a clear, prioritised task list. It figures out what's urgent, what's important, and what can wait.
            </div>
          </div>
 
          <button class="btn-create-tasks" @click="createTasks" :disabled="!canCreate">
            <svg class="sparkle-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2l2.6 6.1L21 10l-5 4.3L17.2 21 12 17.7 6.8 21 8 14.3 3 10l6.4-1.9Z" />
            </svg>
            Create Tasks with AI →
          </button>
        </div>
 
        <!-- AI view (loading / result / error) -->
        <div v-else id="dump-ai-view">
          <!-- Loading -->
          <div v-if="view === 'loading'" id="ai-loading-card" class="ai-loading-card">
            <div class="ai-loading-visual">
              <div class="ai-spinner" aria-hidden="true">
                <svg style="width:52px;height:52px;color:var(--terracotta)" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <div class="ai-loading-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            </div>
            <h2 class="panel-title ai-title">Analysing your input…</h2>
            <p class="ai-sub">Identifying tasks, sorting by priority,<br>and preparing your personal task list.</p>
            <!-- Steps are purely CSS-animated — not tied to any JS timer -->
            <div class="ai-steps-preview" aria-label="AI progress">
              <div class="ai-step-item ai-step-cycle" data-step="0"><span class="aistep-dot"></span> Reading your thoughts</div>
              <div class="ai-step-item ai-step-cycle" data-step="1"><span class="aistep-dot"></span> Identifying tasks</div>
              <div class="ai-step-item ai-step-cycle" data-step="2"><span class="aistep-dot"></span> Sorting by priority</div>
            </div>
          </div>
 
          <!-- Result -->
          <div v-else-if="view === 'result'" class="ai-result">
            <div class="ai-result-top" aria-hidden="true">
              <svg style="width:48px;height:48px;color:var(--green-complete);margin-bottom:16px" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 class="panel-title ai-ready">Tasks ready!</h2>
            <p class="ai-found">Found <strong>{{ taskCount }} tasks</strong>. Let's review and fine-tune them.</p>
            <button class="btn-review" @click="reviewYourTasks">
              Review Your Tasks →
            </button>
          </div>
 
          <!-- Error -->
          <div v-else-if="view === 'error'" class="ai-error">
            <p class="ai-error-msg">{{ errorMessage }}</p>
          </div>
 
          <button class="btn-back-dump" @click="backToDump">
            ← Edit my input
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { guardWorkflowStep, unlockStep, createSession, addAITasksToSession, getCurrentSession } from '../router/workflow'
import VoiceInputButton from '@/components/VoiceInputButton.vue'

// Strip trailing slash so paths like /process-text never become //process-text
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const MIN_LOADING_MS = 2600
const DUMP_INPUT_MAX_CHARS = 2500
// English letters, digits, whitespace, and common English punctuation only (strip everything else).
const DUMP_INPUT_DISALLOWED = /[^A-Za-z0-9\s.,;:'"!?\-()[\]{}@#&*%+=<>/\\|`~^_$]/g

// DEMO: copy used by the "Use sample text" button; edit the string or remove with the button.
const DEMO_SAMPLE_TEXT =
  "I need to finish the report for Monday, call the dentist, clean the kitchen, buy groceries, reply to Sarah's email, sort out my finances"

export default {
  name: 'AIDump',
  components: { VoiceInputButton },
  data() {
    return {
      view: 'input',
      inputText: '',
      uploadedFile: null,
      uploadedFileMeta: null,
      taskCount: 0,
      errorMessage: '',
    }
  },
  computed: {
    charCount() {
      return (this.inputText ?? '').length
    },
    dumpInputMaxChars() {
      return DUMP_INPUT_MAX_CHARS
    },
    canCreate() {
      const hasText = (this.inputText ?? '').trim().length > 0
      const hasPdf  = this.uploadedFile !== null || this.uploadedFileMeta !== null
      return (hasText || hasPdf) && this.view === 'input'
    },
  },
  mounted() {
    guardWorkflowStep(1, this.$router)

    const session = getCurrentSession()
    if (session) {
      if (session.inputType === 'text') {
        this.inputText = this._sanitizeDumpInput(session.rawInputText ?? '')
      } else if (session.inputType === 'pdf') {
        this.uploadedFileMeta = session.uploadedFileMeta ?? null
      }
    }
  },
  methods: {
    // ── PDF handling ──────────────────────────────────────────────────────────
    handlePdfUpload(e) {
      const file = e?.target?.files?.[0] ?? null
      if (!file) return

      this.uploadedFile = file
      this.uploadedFileMeta = {
        name:         file.name,
        size:         file.size,
        type:         file.type,
        lastModified: file.lastModified,
      }
      e.target.value = ''
    },
    removePdf() {
      this.uploadedFile     = null
      this.uploadedFileMeta = null
    },
    appendVoiceInput(transcript) {
      const current = this.inputText?.trimEnd() ?? ''
      const merged = current ? `${current} ${transcript}` : transcript
      this.inputText = this._sanitizeDumpInput(merged)
    },

    onDumpTextInput(e) {
      const next = this._sanitizeDumpInput(e?.target?.value ?? this.inputText)
      if (next !== this.inputText) this.inputText = next
    },

    _sanitizeDumpInput(raw) {
      const s = String(raw ?? '')
      const cleaned = s.replace(DUMP_INPUT_DISALLOWED, '')
      return cleaned.length > DUMP_INPUT_MAX_CHARS ? cleaned.slice(0, DUMP_INPUT_MAX_CHARS) : cleaned
    },

    // DEMO: pairs with the "Use sample text" button in the template; delete when removing the button.
    fillDemoSampleText() {
      this.inputText = this._sanitizeDumpInput(DEMO_SAMPLE_TEXT)
    },

    // ── Navigation ────────────────────────────────────────────────────────────
    backToDump() {
      this.view         = 'input'
      this.errorMessage = ''
    },
    reviewYourTasks() {
      unlockStep(2)
      this.$router.push({ name: 'Planner' })
    },

    // ── Real backend call ─────────────────────────────────────────────────────
    async _callBackend(inputType, sessionId) {
      if (!API_BASE) {
        throw new Error(
          'Missing API URL: set VITE_API_BASE_URL in .env.production, run npm run build, redeploy dist/, invalidate CloudFront.',
        )
      }

      const path = inputType === 'pdf' ? '/upload-pdf' : '/process-text'
      const url = `${API_BASE}${path}`
      let res

      try {
        if (inputType === 'pdf') {
          const formData = new FormData()
          formData.append('file', this.uploadedFile)
          res = await fetch(url, {
            method: 'POST',
            body: formData,
          })
        } else {
          res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: this.inputText.trim() }),
          })
        }
      } catch (e) {
        const msg = e?.message || String(e)
        if (
          msg.includes('Failed to fetch') ||
          msg.includes('NetworkError') ||
          msg.includes('Load failed')
        ) {
          throw new Error(
            `Network/CORS blocked request to ${url}. Enable CORS on API Gateway for your CloudFront domain (or * for testing).`,
          )
        }
        throw e
      }

      const text = await res.text()
      const trimmed = text.trim()
      if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html')) {
        throw new Error(
          `Got HTML instead of JSON — the request probably hit your CloudFront SPA (wrong host/path), not API Gateway. Use absolute VITE_API_BASE_URL=https://YOUR-ID.execute-api.ap-southeast-2.amazonaws.com then rebuild & redeploy. Attempted: ${url}`,
        )
      }

      let payload
      try {
        payload = JSON.parse(text)
      } catch {
        throw new Error(
          `API did not return JSON (HTTP ${res.status}). First chars: ${trimmed.slice(0, 120)}…`,
        )
      }

      if (!res.ok) {
        const detail = payload.detail
        let detailStr = ''
        if (typeof detail === 'string') detailStr = detail
        else if (Array.isArray(detail))
          detailStr = detail.map(d => d.msg || JSON.stringify(d)).join('; ')
        else if (detail != null) detailStr = JSON.stringify(detail)
        throw new Error(
          detailStr || payload.message || `HTTP ${res.status} from API (${path}).`,
        )
      }

      // Backend returns array of { task, priority, priorityGroup, score, rank, category_rank }
      // Convert to internal format: { text, priorityGroup, order }
      const backendTasks = payload
      console.log('[AIDump] Raw backend response:', backendTasks)

      return {
        sessionId,
        tasks: backendTasks.map(t => ({
          text:          t.task,
          priorityGroup: t.priorityGroup,
          order:         t.rank,
        })),
      }
    },

    // ── Main flow ─────────────────────────────────────────────────────────────
    async createTasks() {
      const hasPdf  = this.uploadedFile !== null || this.uploadedFileMeta !== null
      const hasText = (this.inputText ?? '').trim().length > 0
      if (!hasPdf && !hasText) return

      const inputType = hasPdf ? 'pdf' : 'text'

      // Same input check — skip AI if nothing changed
      const existingSession = getCurrentSession()
      const isSameText = inputType === 'text' &&
        this.inputText.trim() === (existingSession?.rawInputText ?? '')
      const isSamePdf = inputType === 'pdf' &&
        this.uploadedFileMeta?.name === existingSession?.uploadedFileMeta?.name &&
        this.uploadedFileMeta?.size === existingSession?.uploadedFileMeta?.size

      if (isSameText || isSamePdf) {
        this.taskCount = existingSession.tasks.length
        this.view = 'result'
        console.log('[AIDump] Same input detected, reusing existing tasks:', this.taskCount, 'tasks')
        return
      }

      // Phase 1: save session skeleton immediately
      const session = createSession({
        inputType,
        rawInputText:     inputType === 'text' ? this.inputText.trim() : '',
        uploadedFileMeta: this.uploadedFileMeta,
      })
      const { sessionId } = session
      console.log('[AIDump] Session created:', { sessionId, inputType })

      this.view = 'loading'

      try {
        const [response] = await Promise.all([
          this._callBackend(inputType, sessionId),
          new Promise(r => setTimeout(r, MIN_LOADING_MS)),
        ])

        console.log('[AIDump] Backend response received:', response)

        // Phase 2: merge AI tasks into session
        addAITasksToSession(sessionId, response.tasks)

        this.taskCount = response.tasks.length
        console.log(`[AIDump] Tasks written to localStorage: ${this.taskCount} tasks`)
        console.log('[AIDump] Final localStorage session:', JSON.parse(localStorage.getItem('onestep-current-session')))

        this.view = 'result'

      } catch (err) {
        console.error('[AIDump] Backend call failed:', err)
        const text = err?.message || 'Something went wrong. Please try again.'
        this.errorMessage = text.length > 420 ? `${text.slice(0, 417)}…` : text
        this.view = 'error'
      }
    },
  },
}
</script>
 
<style scoped>
.workflow-page {
  /* local design tokens (fallbacks based on index.html) */
  --sand-100: #fdf6f0;
  --sand-200: #f5e8d8;
  --terracotta: #c1714f;
  --terracotta-dark: #a05840;
  --brown-dark: #2d1f14;
  --brown-mid: #5c3d28;
  --brown-text: #3d2a1a;
  --green-complete: #6bb89e;
  --radius-btn: 50px;
  --shadow-card: 0 8px 40px rgba(193, 113, 79, 0.13);
 
  max-width: 860px;
  margin: 0 auto;
  padding: 90px 24px 40px;
}
 
.workspace-panel {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}
 
.panel-header-band {
  background: linear-gradient(120deg, #c8a888 0%, #dbbfa0 100%);
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
 
.phb-icon {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: rgba(253, 246, 240, 0.7);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 22px rgba(45, 31, 20, 0.09);
}
 
.phb-icon svg {
  width: 28px;
  height: 28px;
  color: var(--brown-dark);
}
 
.phb-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 4px;
}
 
.phb-desc {
  font-size: 13.5px;
  color: rgba(45, 31, 20, 0.65);
  line-height: 1.5;
}
 
.phb-title {
  margin-top: 2px;
}
 
.panel-card {
  background: white;
  border-radius: 0 0 20px 20px;
  padding: 36px;
}
 
.panel-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--brown-dark);
  margin-bottom: 6px;
}
 
/* ── Input UI ─────────────────────────────────────────────────────────────── */
.input-area {
  border: 2px dashed rgba(193, 113, 79, 0.28);
  border-radius: 14px;
  background: rgba(245, 232, 216, 0.25);
  padding: 20px;
  min-height: 160px;
  margin-bottom: 16px;
  position: relative;
  transition: border-color 0.2s, background 0.2s;
}
 
.input-area:focus-within {
  border-color: rgba(193, 113, 79, 0.55);
  background: rgba(245, 232, 216, 0.45);
}
 
.input-area textarea {
  width: 100%;
  border: none;
  background: none;
  outline: none;
  resize: none;
  font: inherit;
  font-size: 15px;
  line-height: 1.75;
  color: var(--brown-text);
  min-height: 130px;
  padding-right: 48px;
}
 
.input-area textarea::placeholder {
  color: rgba(45, 31, 20, 0.32);
}

.input-voice-button {
  position: absolute;
  right: 16px;
  bottom: 16px;
}

/* DEMO: layout for the sample button; remove with the button if unused. */
.demo-sample-row {
  margin: 0 0 12px;
}

.btn-demo-sample {
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(193, 113, 79, 0.35);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--brown-mid);
  cursor: pointer;
  font: inherit;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.btn-demo-sample:hover {
  border-color: var(--terracotta);
  color: var(--terracotta);
  background: rgba(193, 113, 79, 0.06);
}
 
.input-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
 
.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1.5px solid rgba(193, 113, 79, 0.28);
  border-radius: 10px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--brown-mid);
  transition: all 0.2s;
  user-select: none;
}
 
/* PDF uploaded state */
.upload-btn.has-file {
  border-color: var(--terracotta);
  color: var(--terracotta);
  background: rgba(193, 113, 79, 0.06);
}
 
.clip-ic {
  width: 15px;
  height: 15px;
  color: var(--brown-mid);
}
 
.upload-btn:hover {
  border-color: var(--terracotta);
  color: var(--terracotta);
}
 
.upload-btn:hover .clip-ic {
  color: var(--terracotta);
}
 
.upload-btn.has-file .clip-ic {
  color: var(--terracotta);
}
 
.dump-text-input-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 12px;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(45, 31, 20, 0.38);
}

.dump-char-count {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.dump-char-count.warn {
  color: var(--terracotta);
}

.dump-text-limit-msg {
  font-weight: 600;
  color: var(--terracotta);
}
 
/* Remove PDF button */
.btn-remove-pdf {
  background: none;
  border: none;
  color: var(--terracotta);
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s, opacity 0.2s;
}
 
.btn-remove-pdf:hover {
  background: rgba(193, 113, 79, 0.1);
}
 
.ai-hint {
  background: rgba(193, 113, 79, 0.07);
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 13px;
  line-height: 1.65;
  color: rgba(45, 31, 20, 0.65);
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border: 1px solid rgba(193, 113, 79, 0.14);
}
 
.ai-hint .icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--terracotta);
}
 
.ai-hint .icon svg {
  width: 16px;
  height: 16px;
  display: block;
}
 
.btn-create-tasks {
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-btn);
  background: var(--terracotta);
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  font: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.02em;
}
 
.btn-create-tasks:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
 
.btn-create-tasks:not(:disabled):hover {
  background: var(--terracotta-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(193, 113, 79, 0.35);
}
 
.sparkle-ic {
  width: 17px;
  height: 17px;
  color: white;
}
 
/* ── AI loading/result ────────────────────────────────────────────────────── */
.ai-loading-card {
  text-align: center;
  padding: 20px 0 8px;
}
 
.ai-loading-visual {
  margin-bottom: 24px;
}
 
.ai-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: spin 2s linear infinite;
  filter: drop-shadow(0 0 12px rgba(193, 113, 79, 0.4));
}
 
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
 
.ai-loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}
 
.ai-loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(193, 113, 79, 0.4);
  animation: dotPulse 1.4s ease-in-out infinite;
}
 
.ai-loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.ai-loading-dots span:nth-child(3) { animation-delay: 0.4s; }
 
@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
 
.ai-title {
  margin-bottom: 8px;
}
 
.ai-sub {
  color: rgba(45, 31, 20, 0.5);
  font-size: 15px;
  line-height: 1.7;
}
 
.ai-steps-preview {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
}
 
.ai-step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: rgba(45, 31, 20, 0.4);
  font-weight: 500;
}
 
/* Pure CSS cycling animation — replaces JS stepClass() logic */
.ai-step-cycle {
  opacity: 0.35;
  animation: stepPulse 2.4s ease-in-out infinite;
}
 
.ai-step-cycle[data-step="1"] { animation-delay: 0.8s; }
.ai-step-cycle[data-step="2"] { animation-delay: 1.6s; }
 
@keyframes stepPulse {
  0%, 100%  { opacity: 0.35; color: rgba(45, 31, 20, 0.4); }
  33%       { opacity: 1;    color: var(--brown-dark);      font-weight: 700; }
}
 
.aistep-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(45, 31, 20, 0.15);
}
 
/* Dot follows step highlight */
.ai-step-cycle {
  --dot-bg: rgba(45, 31, 20, 0.15);
}
 
@keyframes dotCycle {
  0%, 100%  { background: rgba(45, 31, 20, 0.15); }
  33%       { background: var(--terracotta); }
}
 
.ai-step-cycle .aistep-dot {
  animation: dotCycle 2.4s ease-in-out infinite;
}
 
.ai-step-cycle[data-step="1"] .aistep-dot { animation-delay: 0.8s; }
.ai-step-cycle[data-step="2"] .aistep-dot { animation-delay: 1.6s; }
 
.ai-result {
  text-align: center;
  padding: 16px 0 8px;
}
 
.ai-ready {
  margin-bottom: 8px;
  color: var(--green-complete);
}
 
.ai-found {
  color: rgba(45, 31, 20, 0.5);
  font-size: 15px;
  margin-bottom: 28px;
  line-height: 1.6;
}
 
.btn-review {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  padding: 16px;
  border-radius: var(--radius-btn);
  background: var(--brown-dark);
  color: var(--sand-100);
  border: none;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
}
 
.btn-review:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(45, 31, 20, 0.22);
}
 
.btn-back-dump {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--terracotta);
  font: inherit;
  padding: 12px 0 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: opacity 0.2s;
}
 
.btn-back-dump:hover { opacity: 0.7; }
 
/* ── Error ────────────────────────────────────────────────────────────────── */
.ai-error {
  text-align: center;
  padding: 24px 0 8px;
}
 
.ai-error-msg {
  color: var(--terracotta);
  font-size: 15px;
  line-height: 1.6;
}
 
@media (max-width: 520px) {
  .panel-header-band { padding: 18px 16px; }
  .panel-card { padding: 24px 18px; }
  .phb-icon { width: 42px; height: 42px; border-radius: 12px; }
}
</style>
