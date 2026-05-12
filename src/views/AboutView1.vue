<template>
  <main class="about-page">
    <!-- HERO -->
    <section class="hero-section section-block">
      <div class="hero-copy">
        <p class="eyebrow">ONESTEPGEN — ADHD WORKPLACE TOOL</p>
        <h1>Helping ADHD workers take it one step at a time</h1>
        <p class="hero-description">
          Designed for the 1 in 14 Australians with ADHD who struggle to manage daily work tasks —
          OneStepGen breaks down complexity into manageable, focused steps.
        </p>
      </div>

      <div class="hero-brand" aria-label="OneStepGen brand mark">
        <img src="../assets/logo.png" alt="OneStepGen logo" class="brand-logo" />
        <p>OneStepGen</p>
      </div>
    </section>

    <!-- THE PROBLEM -->
    <section class="section-block">
      <p class="section-label">THE PROBLEM</p>

      <article class="statement-card">
        <p>
          For ADHD workers, the workplace isn't just stressful — it's structured in ways that amplify
          every challenge. Higher demands, constant distractions, and rigid timelines leave little room to cope.
        </p>
      </article>

      <div class="challenge-grid">
        <article v-for="challenge in challenges" :key="challenge.title" class="info-card challenge-card">
          <span class="card-icon">{{ challenge.icon }}</span>
          <h3>{{ challenge.title }}</h3>
          <p>{{ challenge.description }}</p>
        </article>
      </div>
    </section>

    <!-- THE DATA -->
    <section class="section-block divider-block">
      <p class="section-label">THE DATA</p>

      <div class="stat-grid">
        <article v-for="stat in stats" :key="stat.value" class="stat-card">
          <strong>{{ stat.value }}</strong>
          <span>{{ stat.label }}</span>
        </article>
      </div>

      <article class="chart-card distress-card">
        <LineChart />
      </article>

      <article class="chart-card employment-card">
        <div class="chart-heading">
          <p class="section-label small-label">EMPLOYMENT CONTEXT</p>
          <h2>Data - Employment Rate</h2>
          <p>
            Labour force data helps show why workplace support matters for people with disability,
            including ADHD-related functional barriers.
          </p>
        </div>
        <VisualDiagram />
      </article>
    </section>

    <!-- ADHD KNOWLEDGE -->
    <section class="section-block divider-block">
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

          <p class="source-text">
            Source:
            <a href="https://pubmed.ncbi.nlm.nih.gov/11765286/" target="_blank">
              Graetz et al. (2001)
            </a>
            |
            <a href="https://adhdguideline.aadpa.com.au/about/about-adhd" target="_blank">
              AADPA, About ADHD
            </a>
          </p>
        </article>
      </div>
    </section>

    <!-- WHY IT GETS WORSE -->
    <section class="section-block divider-block">
      <p class="section-label">WHY IT GETS WORSE AT WORK</p>

      <div class="reason-list">
        <article v-for="(reason, index) in reasons" :key="reason.title" class="reason-card">
          <span class="reason-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <div>
            <h3>{{ reason.title }}</h3>
            <p>{{ reason.description }}</p>
          </div>
          <span class="reason-tag">{{ reason.tag }}</span>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import VisualDiagram from '@/components/VisualDiagram.vue'
import LineChart from '@/components/LineChart.vue'

const challenges = [
  {
    icon: '▰',
    title: 'Task organisation',
    description: 'Difficulty prioritising and sequencing work when everything feels equally urgent.'
  },
  {
    icon: '◴',
    title: 'Time management',
    description: "Time blindness makes deadlines feel abstract until they're suddenly critical."
  },
  {
    icon: '⌁',
    title: 'Maintaining focus',
    description: 'Frequent workplace interruptions make it hard to re-enter a state of deep work.'
  },
  {
    icon: '☷',
    title: 'Following instructions',
    description: 'Multi-step instructions overwhelm working memory, leading to errors and rework.'
  }
]

const stats = [
  {
    value: '7.5%',
    label: 'of people globally have ADHD (DSM-IV criteria)'
  },
  {
    value: '6.8%',
    label: 'experience functional impairment in daily life'
  },
  {
    value: '2–6%',
    label: 'estimated adult prevalence in Australia (DSM-5)'
  }
]

const reasons = [
  {
    title: 'Higher demands increase pressure',
    description:
      'Professional environments layer complexity — competing deadlines, team dependencies, and performance expectations all simultaneously.',
    tag: 'Pressure'
  },
  {
    title: 'Frequent distractions break focus',
    description:
      'Open offices, Slack notifications, and back-to-back meetings fragment attention in ways that hit ADHD workers disproportionately hard.',
    tag: 'Environment'
  },
  {
    title: 'Limited flexibility reduces coping options',
    description:
      'Fixed schedules and workflows leave little room to adapt to when focus is naturally available — a key ADHD management strategy.',
    tag: 'Structure'
  }
]
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  max-width: 980px;
  margin: 0 auto;
  padding: 64px 28px 120px;
  color: #f4eee8;
  background: #1f1f1e;
}

.section-block {
  margin-bottom: 72px;
}

.divider-block {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 56px;
}

.eyebrow,
.section-label {
  margin: 0 0 28px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: #a79d93;
}

.small-label {
  margin-bottom: 12px;
  font-size: 0.68rem;
}

.hero-section {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 64px;
  align-items: center;
  padding-top: 8px;
}

.hero-copy h1 {
  max-width: 520px;
  margin: 0 0 22px;
  font-size: clamp(2.6rem, 6vw, 4.8rem);
  line-height: 0.96;
  letter-spacing: -0.055em;
  font-weight: 800;
  color: #fff8f1;
}

.hero-description {
  max-width: 440px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: #d4cbc2;
}

.hero-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  gap: 16px;
  color: #d7cfc7;
  font-weight: 700;
}

.brand-logo {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 28px;
  background: #cda98c;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.26);
}

.statement-card {
  padding: 34px 40px;
  border-radius: 10px;
  border-left: 3px solid #d4b193;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.statement-card p {
  margin: 0;
  max-width: 820px;
  color: #fff4ea;
  font-size: 1.05rem;
  line-height: 1.75;
  font-weight: 700;
  font-style: italic;
}

.challenge-grid,
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 28px;
}

.info-card,
.stat-card,
.chart-card,
.knowledge-card,
.infographic-card,
.reason-card {
  border: 1px solid rgba(255, 255, 255, 0.13);
  background: rgba(255, 255, 255, 0.035);
  border-radius: 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.challenge-card {
  padding: 28px;
  min-height: 168px;
}

.card-icon {
  display: inline-flex;
  margin-bottom: 24px;
  color: #c58d70;
  font-size: 1.2rem;
}

.challenge-card h3,
.reason-card h3,
.knowledge-item h3 {
  margin: 0 0 8px;
  color: #fff8f1;
  font-size: 1rem;
  font-weight: 800;
}

.challenge-card p,
.reason-card p,
.knowledge-card p,
.chart-heading p {
  margin: 0;
  color: #d2c9c0;
  font-size: 0.92rem;
  line-height: 1.55;
}

.stat-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.stat-card {
  padding: 28px;
}

.stat-card strong {
  display: block;
  margin-bottom: 6px;
  color: #fff8f1;
  font-size: 2.35rem;
  line-height: 1;
  letter-spacing: -0.04em;
}

.stat-card span {
  display: block;
  color: #d4cbc2;
  font-size: 0.84rem;
  line-height: 1.3;
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
  color: #fff8f1;
  font-size: 1.25rem;
  font-weight: 800;
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
  border-radius: 8px;
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
  color: #a79d93;
  font-size: 0.78rem;
  line-height: 1.5;
}

.source-text a,
.infographic-card a {
  color: #d4b193;
  text-decoration: none;
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
  color: #9b9289;
  font-size: 0.78rem;
  font-weight: 800;
}

.reason-tag {
  align-self: start;
  padding: 5px 12px;
  border-radius: 999px;
  background: #f0d6c5;
  color: #6a3826;
  font-size: 0.72rem;
  font-weight: 700;
}

/* Make the existing chart components fit the new About page visual system. */
:deep(.psychologicalDistress),
:deep(.labourComparision) {
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
  color: #f4eee8;
}

:deep(.psychologicalDistress .row),
:deep(.labourComparision .row) {
  margin-bottom: 1rem !important;
}

:deep(.psychologicalDistress h5),
:deep(.labourComparision label) {
  color: #fff8f1;
}

:deep(.psychologicalDistress .chart-hint),
:deep(.labourComparision .text-md-end),
:deep(.psychologicalDistress .source-text),
:deep(.labourComparision .source-text) {
  color: #a79d93 !important;
}

:deep(.psychologicalDistress .chart-page),
:deep(.labourComparision .chart-page) {
  padding: 0;
}

:deep(.psychologicalDistress .chart-box),
:deep(.labourComparision .chart-box) {
  background: rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

@media (max-width: 900px) {
  .hero-section,
  .knowledge-layout {
    grid-template-columns: 1fr;
  }

  .hero-brand {
    justify-self: start;
  }

  .stat-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .about-page {
    padding: 48px 18px 88px;
  }

  .section-block {
    margin-bottom: 56px;
  }

  .challenge-grid {
    grid-template-columns: 1fr;
  }

  .statement-card,
  .chart-card,
  .knowledge-card,
  .infographic-card,
  .reason-card,
  .stat-card,
  .challenge-card {
    padding: 22px;
  }

  .reason-card {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .reason-tag {
    justify-self: start;
  }
}
</style>
