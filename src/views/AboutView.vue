<template>
  <!-- About page: ADHD context, research data, and product rationale -->
  <main class="about-page">
    <!-- HERO -->
    <section class="hero-section section-block">
      <div class="hero-copy">
        <p class="eyebrow" style="color: #b46a2d;">ONESTEPGEN — ADHD WORKPLACE TOOL</p>
        <h1>
          Helping ADHD workers take it
          <p style="color: #b46a2d;">one step at a time</p>
        </h1>
        <p class="hero-description">
          Designed for the 1 in 14 Australians with ADHD who struggle to manage daily work tasks —
          OneStepGen breaks down complexity into manageable, focused steps.
        </p>
      </div>

      <div class="hero-brand" aria-label="OneStepGen brand mark">
        <img src="../assets/logo.png" alt="OneStepGen logo" class="brand-logo" />
      </div>
    </section>

    <!-- TABBED CONTENT -->
    <section class="section-block tab-section" style="padding-top: 0;">
      <div class="tab-header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <!-- THE PROBLEM -->
        <div v-if="activeTab === 'problem'" class="tab-panel">
          <p class="section-label">THE PROBLEM</p>

          <article class="statement-card">
            <p>
              For ADHD workers, the workplace isn't just stressful — it's structured in ways that amplify
              every challenge. Higher demands, constant distractions, and rigid timelines leave little room to cope.
            </p>
          </article>

          <div class="challenge-grid">
            <article
              v-for="challenge in challenges"
              :key="challenge.title"
              class="flip-card"
            >
              <div class="flip-card-inner">
                <div class="flip-card-face flip-card-front">
                  <h3>{{ challenge.title }}</h3>
                  <p>{{ challenge.description }}</p>
                </div>

                <div class="flip-card-face flip-card-back">
                  <p v-html="challenge.backHtml"></p>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- WHY IT GETS WORSE -->
        <div v-if="activeTab === 'impact'" class="tab-panel">
          <p class="section-label">WHY IT GETS WORSE AT WORK</p>

          <div class="reason-list">
            <article
              v-for="(reason, index) in reasons"
              :key="reason.title"
              class="reason-card"
            >
              <span class="reason-number">{{ String(index + 1).padStart(2, '0') }}</span>
              <div>
                <h3>{{ reason.title }}</h3>
                <p>{{ reason.description }}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- THE DATA -->
        <div v-if="activeTab === 'data'" class="tab-panel">
          <p class="section-label">THE DATA</p>

          <div class="stat-grid">
            <article
              v-for="stat in stats"
              :key="stat.value"
              class="flip-card stat-flip-card"
            >
              <div class="flip-card-inner">
                <div class="flip-card-face flip-card-front stat-card-front">
                  <strong style="color: #b46a2d;">{{ stat.value }}</strong>
                  <span>{{ stat.label }}</span>
                </div>

                <div class="flip-card-face flip-card-back stat-card-back">
                  <h3>{{ stat.backTitle }}</h3>
                  <p>{{ stat.backText }}</p>
                </div>
              </div>
            </article>
          </div>

          <article class="chart-card distress-card">
            <LineChart />
          </article>

          <article class="chart-card employment-card">
            <div class="chart-heading">
              <!-- <p class="section-label small-label">EMPLOYMENT CONTEXT</p> -->
              <h2>Data - Employment Rate</h2>
              <p>
                Labour force data helps show why workplace support matters for people with disability,
                including ADHD-related functional barriers.
              </p>
            </div>
            <VisualDiagram />
          </article>
        </div>

        <!-- ADHD KNOWLEDGE -->
        <div v-if="activeTab === 'knowledge'" class="tab-panel">
          <p class="section-label">ADHD KNOWLEDGE</p>

          <div class="knowledge-layout">
            <figure class="infographic-card">
              <img
                src="../assets/infoGraph.png"
                alt="1-2 out of every 20 Australians have ADHD"
              />
              <figcaption>
                <a href="https://pubmed.ncbi.nlm.nih.gov/11765286/" target="_blank">
                  The prevalence of ADHD is 7.5% under the DSM-IV diagnostic criteria
                </a>
                <p class="source-text">
                  Source:
                  <a href="https://pubmed.ncbi.nlm.nih.gov/11765286/" target="_blank">
                    Graetz et al. (2001), Journal of the American Academy of Child & Adolescent Psychiatry
                  </a>
                  |
                  <a href="https://adhdguideline.aadpa.com.au/about/about-adhd" target="_blank">
                    Australian ADHD Professionals Association (AADPA), About ADHD
                  </a>
                </p>
              </figcaption>
            </figure>

            <article class="knowledge-card">
              <h2>Data - Prevalence of ADHD</h2>

              <div class="knowledge-item">
                <h3>DSM-IV Diagnosis</h3>
                <p>
                  Symptoms are grouped into <strong>5 categories</strong>, mainly
                  <strong>Inattention</strong> and <strong>Hyperactivity / Impulsivity</strong>.
                </p>
              </div>

              <div class="knowledge-item">
                <h3>Prevalence</h3>
                <p>
                  <strong>7.5%</strong> of people have ADHD, and <strong>6.8%</strong> experience
                  functional impairment. <strong>Inattention type</strong> is the most common.
                </p>
              </div>

              <div class="knowledge-item">
                <h3>Australian Adults (DSM-5)</h3>
                <p>
                  No exact local data. Estimated prevalence: <strong>2% – 6%</strong>, similar to
                  international levels. (Simon, Czobor, Bálint, Mészáros, & Bitter, 2009; Song et al.,
                  2021; Willcutt, 2012).
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
// Tabbed about page with ADHD workplace research and statistics.
import { ref } from 'vue'
import VisualDiagram from '@/components/VisualDiagram.vue'
import LineChart from '@/components/LineChart.vue'

const activeTab = ref('problem')

const tabs = [
  {
    id: 'problem',
    label: 'The Problem'
  },
  {
    id: 'impact',
    label: 'Workplace Impact'
  },
  {
    id: 'data',
    label: 'The Data'
  },
  {
    id: 'knowledge',
    label: 'ADHD Knowledge'
  }
]

const challenges = [
  {
    title: 'Task organisation',
    description: 'Difficulty prioritising and sequencing work when everything feels equally urgent.',
    backHtml:
      'ADHD workers may find it hard to <strong>organise tasks</strong>, <strong>set priorities</strong>, and <strong>break large projects</strong> into manageable steps. When several responsibilities feel <strong>equally urgent</strong>, they may become <strong>overwhelmed</strong> or unsure where to begin.'
  },
  {
    title: 'Time management',
    description: "Time blindness makes deadlines feel abstract until they're suddenly critical.",
    backHtml:
      'ADHD can affect a person’s ability to <strong>estimate time</strong>, <strong>meet deadlines</strong>, or <strong>transition between activities</strong>. This may lead to <strong>rushing</strong>, <strong>procrastination</strong>, or underestimating the time needed for work.'
  },
  {
    title: 'Maintaining focus',
    description: 'Frequent workplace interruptions make it hard to re-enter a state of deep work.',
    backHtml:
      'Workers with ADHD may struggle to <strong>stay focused</strong>, especially during <strong>repetitive</strong>, <strong>lengthy</strong>, or <strong>low-interest tasks</strong>. Distractions such as <strong>noise</strong>, <strong>emails</strong>, or <strong>background conversations</strong> can easily interrupt their concentration and workflow.'
  },
  {
    title: 'Following instructions',
    description: 'Multi-step instructions overwhelm working memory, leading to errors and rework.',
    backHtml:
      'ADHD workers may find it challenging to remember <strong>multi-step instructions</strong>, especially when they are given <strong>verbally</strong> or <strong>too quickly</strong>. They may <strong>miss details</strong>, <strong>lose track of steps</strong>, or need information repeated in a clearer format.'
  }
]

const stats = [
  {
    value: '7.5%',
    label: 'of people globally have ADHD (DSM-IV criteria)',
    backTitle: 'What this means',
    backText: 'ADHD is not rare. A meaningful number of people may need task support in study or workplace settings.'
  },
  {
    value: '6.8%',
    label: 'experience functional impairment in daily life',
    backTitle: 'Why it matters',
    backText: 'Many people with ADHD experience real difficulties with planning, focus, organisation, and daily routines.'
  },
  {
    value: '2–6%',
    label: 'estimated adult prevalence in Australia (DSM-5)',
    backTitle: 'Local context',
    backText: 'Even without exact local data, the estimate suggests ADHD support is relevant for many Australian adults.'
  }
]

const reasons = [
  {
    title: 'Higher demands increase pressure',
    description:
      'Professional environments layer complexity — competing deadlines, team dependencies, and performance expectations all simultaneously.'
  },
  {
    title: 'Frequent distractions break focus',
    description:
      'Open offices, Slack notifications, and back-to-back meetings fragment attention in ways that hit ADHD workers disproportionately hard.'
  },
  {
    title: 'Limited flexibility reduces coping options',
    description:
      'Fixed schedules and workflows leave little room to adapt to when focus is naturally available — a key ADHD management strategy.'
  }
]
</script>

<style scoped>
.about-page {
  --page-bg: #f7efe5;
  --surface: #fffaf4;
  --surface-soft: #f2dfca;
  --surface-muted: #ead2b8;
  --text-main: #2f2f2f;
  --text-muted: #6f665f;
  --text-soft: #8a7b70;
  --border: rgba(137, 94, 63, 0.2);
  --accent: #b66f46;
  --accent-soft: #e7c4aa;

  min-height: 100vh;
  width: min(980px, calc(100% - 48px));
  margin: 0 auto;
  padding: 14vh 0 10vh;
  color: var(--text-main);
  background: transparent;
}

.section-block {
  margin-bottom: 4.6vh;
}

.divider-block {
  border-top: 2.4px solid var(--border);
  padding-top: 2vh;
}

.eyebrow,
.section-label {
  margin: 0 0 28px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #b46a2d;
  text-transform: uppercase;
}

.small-label {
  margin-bottom: 12px;
  font-size: 0.68rem;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-copy h1 {
  max-width: 560px;
  margin: 0 0 22px;
  font-size: clamp(2.4rem, 5.4vw, 4.4rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
  font-weight: 800;
  color: var(--text-main);
}

.hero-copy h1 p {
  margin: 0;
}

.hero-description {
  max-width: 620px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: var(--text-muted);
}

.hero-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  gap: 14px;
  font-weight: 700;
  width: 20%;
}

.hero-brand p {
  margin: 0;
}

.brand-logo {
  width: 24vw;
  object-fit: contain;
  padding: 14px;
  border-radius: 28px;
  background: white;
  box-shadow: 0 18px 46px rgba(126, 84, 52, 0.18);
  position: relative;
  left: -40%;
}

/* Tabs */
.tab-section {
  border-top: 2.4px solid var(--border);
  padding-top: 2vh;
}

.tab-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 32px;
  padding: 10px;
  /* border: 1px solid var(--border); */
  border-bottom: 2.4px solid var(--border);
  /* border-radius: 18px; */
  /* background: rgba(255, 250, 244, 0.72);  */
  /* box-shadow: 0 12px 32px rgba(126, 84, 52, 0.06); */
}

.tab-button {
  border: 0 solid transparent;
  border-radius: 999px;
  padding: 1.6vh 2.6vw;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background: rgba(231, 196, 170, 0.28);
  color: var(--text-main);
}

.tab-button.active {
  background: #b46a2d;
  color: #ffffff;
  border: none;
  border-color: rgba(137, 94, 63, 0.18);
  box-shadow: 0 8px 18px rgba(126, 84, 52, 0.12);
}

.tab-content {
  min-height: 420px;
}

.tab-panel {
  animation: fadeIn 0.22s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.statement-card {
  padding: 2.8vh 2vw;
  border-radius: 14px;
  background: rgba(255, 250, 245, 0.78);
  box-shadow: 0 14px 34px rgba(126, 84, 52, 0.08);
}

.statement-card p {
  margin: 0;
  max-width: 820px;
  color: var(--text-main);
  font-size: 1.05rem;
  line-height: 1.75;
  font-weight: 700;
  font-style: italic;
}

.challenge-grid,
.stat-grid {
  display: grid;
  gap: 24px;
  margin-top: 28px;
}

.challenge-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.stat-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* Flip card effect */
.flip-card {
  min-height: 18vh;
  perspective: 1000px;
  cursor: pointer;
}

.stat-flip-card {
  min-height: 170px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  min-height: 18vh;
  transition: transform 0.65s ease;
  transform-style: preserve-3d;
}

.stat-flip-card .flip-card-inner {
  min-height: 170px;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-face {
  position: absolute;
  inset: 0;
  padding: 2vw;
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(126, 84, 52, 0.07);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip-card-front {
  background: rgba(255, 250, 244, 0.86);
}

.flip-card-back {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--accent-soft);
  transform: rotateY(180deg);
}

.flip-card-face h3 {
  margin: 0 0 8px;
  color: var(--text-main);
  font-size: 1rem;
  font-weight: 800;
}

.flip-card-face p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.55;
}

.flip-card-back p {
  color: #5f3b28;
}

.flip-card-back :deep(strong) {
  color: var(--text-main);
  font-weight: 800;
}

/* Stat card front */
.stat-card-front {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card-front strong {
  display: block;
  margin-bottom: 6px;
  color: var(--text-main);
  font-size: 2.35rem;
  line-height: 1;
  letter-spacing: -0.04em;
}

.stat-card-front span {
  display: block;
  color: var(--text-muted);
  font-size: 0.84rem;
  line-height: 1.3;
}

.stat-card-back {
  background: var(--accent-soft);
}

.info-card,
.chart-card,
.knowledge-card,
.infographic-card,
.reason-card {
  border: 1px solid var(--border);
  background: rgba(255, 250, 244, 0.86);
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(126, 84, 52, 0.07);
}

.card-icon {
  display: inline-flex;
  margin-bottom: 24px;
  color: var(--accent);
  font-size: 1.2rem;
}

.reason-card h3,
.knowledge-item h3 {
  margin: 0 0 8px;
  color: var(--text-main);
  font-size: 1rem;
  font-weight: 800;
}

.reason-card p,
.knowledge-card p,
.chart-heading p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.55;
}

.chart-card {
  margin-top: 28px;
  padding: 28px;
  overflow: hidden;
}

.chart-heading {
  margin-bottom: 20px;
}

.chart-heading h2,
.knowledge-card h2 {
  margin: 0 0 10px;
  color: var(--text-main);
  font-size: 1.25rem;
  font-weight: 600;
}

.knowledge-layout {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 24px;
}

.infographic-card {
  margin: 0;
  padding: 22px;
}

.infographic-card img {
  width: 100%;
  display: block;
  border-radius: 10px;
}

.infographic-card figcaption {
  margin-top: 14px;
  font-size: 0.8rem;
  line-height: 1.4;
}

.knowledge-card {
  padding: 28px;
}

.knowledge-item + .knowledge-item {
  margin-top: 24px;
}

.source-text {
  margin-top: 24px;
  color: var(--text-soft);
  font-size: 0.78rem;
  line-height: 1.5;
}

.source-text a,
.infographic-card a {
  color: #6f665f;
}

.source-text a:hover,
.infographic-card a:hover {
  text-decoration: underline;
}

.reason-list {
  display: grid;
  gap: 16px;
}

.reason-card {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  gap: 20px;
  align-items: start;
  padding: 24px;
}

.reason-number {
  color: var(--text-soft);
  font-size: 0.78rem;
  font-weight: 800;
}

/* Keep existing chart components, but let them blend with the original warm theme. */
:deep(.psychologicalDistress),
:deep(.labourComparision) {
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
  color: var(--text-main) !important;
}

:deep(.psychologicalDistress .row),
:deep(.labourComparision .row) {
  margin-bottom: 1rem !important;
}

:deep(.psychologicalDistress h5),
:deep(.labourComparision label) {
  color: var(--text-main) !important;
}

:deep(.psychologicalDistress .chart-hint),
:deep(.labourComparision .text-md-end),
:deep(.psychologicalDistress .source-text),
:deep(.labourComparision .source-text) {
  color: var(--text-soft) !important;
}

:deep(.psychologicalDistress .chart-page),
:deep(.labourComparision .chart-page) {
  padding: 0 !important;
}

:deep(.psychologicalDistress .chart-box),
:deep(.labourComparision .chart-box) {
  background: #fffaf4 !important;
  border: 1px solid var(--border) !important;
  border-radius: 12px !important;
}

@media (max-width: 900px) {
  .hero-section,
  .knowledge-layout {
    grid-template-columns: 1fr;
  }

  .hero-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }

  .hero-brand {
    justify-self: start;
    width: auto;
  }

  .brand-logo {
    width: min(260px, 70vw);
    left: 0;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }

  .stat-flip-card,
  .stat-flip-card .flip-card-inner {
    min-height: 160px;
  }
}

@media (max-width: 720px) {
  .about-page {
    width: min(100% - 32px, 980px);
    padding: 88px 0 88px;
  }

  .section-block {
    margin-bottom: 56px;
  }

  .tab-header {
    gap: 8px;
    padding: 8px;
  }

  .tab-button {
    flex: 1;
    padding: 10px 12px;
    font-size: 0.76rem;
  }

  .challenge-grid {
    grid-template-columns: 1fr;
  }

  .flip-card,
  .flip-card-inner {
    min-height: 180px;
  }

  .stat-flip-card,
  .stat-flip-card .flip-card-inner {
    min-height: 170px;
  }

  .flip-card-face {
    padding: 22px;
  }

  .statement-card,
  .chart-card,
  .knowledge-card,
  .infographic-card,
  .reason-card {
    padding: 22px;
  }

  .reason-card {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>