<template>
  <div class="page-container">

    <div class="page-header">
      <h1 class="page-title">About Us</h1>

    </div>

    <div class="card shadow-sm mb-4 overview-card">
      <img src="../assets/logo.png" alt="logo" class="logo my-3">
      <div class="card-body">
        <!-- <h3 class="card-title mb-3">Overview</h3> -->
        <p class="text-muted">
        <h3>
          Our Goal
        </h3>
        <ul>
          <li>
            Design a solution to help ADHD workers manage daily work tasks
          </li>
        </ul>
        <h3>
          Key Challenges for ADHD Workers (Australia)
        </h3>
        <ul>
          <li>Difficulty with task organization</li>
          <li>Difficulty with time management</li>
          <li>Difficulty maintaining focus</li>
          <li>Difficulty following instructions</li>
        </ul>
        <h3>
          Why It Gets Worse at Work
        </h3>
        <ul>
          <li>Higher demands increase pressure</li>
          <li>Frequent distractions break focus</li>
          <li>Limited flexibility reduces coping options</li>
        </ul>
        </p>
      </div>

    </div>

    <!-- problem state + employment -->
    <div class="problem problem-employment">
      <div class="card shadow-sm mb-4 problem-main-card">
        <div class="card-body">
          <h3 class="card-title mb-3">Our Focused Problem & Challenges</h3>

          <p class="fw-semibold">Key challenges:</p>
          <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item">Difficulty organising tasks</li>
            <li class="list-group-item">Struggles with time management</li>
            <li class="list-group-item">Challenges maintaining focus</li>
            <li class="list-group-item">Difficulty following unclear instructions</li>
          </ul>

          <p class="fw-semibold">Impact:</p>
          <ul class="list-group list-group-flush mb-3">
            <li class="list-group-item">Increased stress</li>
            <li class="list-group-item">Reduced productivity</li>
            <li class="list-group-item">Lower confidence</li>
          </ul>

          <p class="fw-semibold">Workplace factors:</p>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">More distractions</li>
            <li class="list-group-item">Tighter deadlines</li>
            <li class="list-group-item">Less flexibility</li>
          </ul>
        </div>
      </div>

      <div class="card shadow-sm data">
        <div class="card-body">
          <h3 class="card-title">Data - Employment Rate</h3>
          <VisualDiagram />
        </div>
      </div>
    </div>

    <!-- ADHD knowledge -->
    <div class="problem problem-prevalence">
      <div class="card shadow-sm mb-5">
        <div class="card-body">
          <h3 class="card-title mb-3">Data - Prevalence of ADHD</h3>
          <div class="prevalence-layout">
            <figure class="figure prevalence-figure">
              <img src="../assets/infoGraph.png" class="figure-img img-fluid rounded"
                alt="1-2 out of every 20 Australians have ADHD">
              <figcaption class="figure-caption">
                <a href="https://pubmed.ncbi.nlm.nih.gov/11765286/" class="figure-caption" target="_blank">
                  The prevalence of ADHD is 7.5% under the DSM-IV diagnostic criteria
                </a>
              </figcaption>
            </figure>

            <div class="prevalence-text">

              <p>
                <strong>DSM-IV Diagnosis:</strong><br>
                Symptoms are grouped into <strong>5 categories</strong>, mainly
                <strong>Inattention</strong> and <strong>Hyperactivity / Impulsivity</strong>.
              </p>

              <p>
                <strong>Prevalence:</strong><br>
                <strong>7.5%</strong> of people have ADHD, and
                <strong>6.8%</strong> experience functional impairment.<br>
                <strong>Inattention type</strong> is the most common.
              </p>

              <p>
                <strong>Australian Adults (DSM-5):</strong><br>
                No exact local data.<br>
                Estimated prevalence: <strong>2% – 6%</strong>,
                similar to international levels. <br> (Simon, Czobor, Bálint, Mészáros, & Bitter, 2009; Song et al., 2021;
                Willcutt, 2012).
              </p>

            </div>
          </div>
          <strong class="source-text">Source: </strong>
          <a href="https://pubmed.ncbi.nlm.nih.gov/11765286/" target="_blank" class="source-text">
            Graetz et al. (2001), Journal of the American
            Academy of Child & Adolescent Psychiatry
          </a> | <br>
          <a href="https://adhdguideline.aadpa.com.au/about/about-adhd" target="_blank" class="source-text">
            Australian ADHD Professionals Association (AADPA), About ADHD
          </a>


        </div>
      </div>

    </div>

    <!-- psychological distress -->
    <div class="problem problem-distress">
      <div class="card shadow-sm mb-5">
        <div class="card-body">
          <h3 class="card-title mb-3">Data - Trend of Psychological Distress</h3>
          <LineChart />
        </div>
      </div>

      <!-- <div class="card shadow-sm mb-5">
        <div class="card-body">
          <h3 class="card-title">Data - Employment Rate</h3>
        </div>
      </div> -->
    </div>


  </div>
</template>

<script setup>
import VisualDiagram from '@/components/VisualDiagram.vue';
import LineChart from '@/components/LineChart.vue';
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 24px 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 380px;
  max-width: 100%;
  height: auto;
  opacity: 0.9;
  border-radius: 15px;
}

.page-title {
  font-size: 3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.card {
  border-radius: 12px;
}

.overview-card {
  padding: 18px 16px 12px 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 18px;
}

.card-title {
  font-weight: 600;
  color: #333;
}

.list-group-item {
  border: none;
  padding-left: 0;
  color: #555;
}

.problem {
  display: flex;
  flex-direction: row;
  align-items: start;
  margin-top: 24px;
  gap: 20px;
}

.problem-employment {
  min-height: 43.8rem;
}

.problem-prevalence,
.problem-distress {
  min-height: 34rem;
}

.problem-main-card {
  margin-right: 0;
}

.prevalence-layout {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.prevalence-figure {
  width: 58%;
}

.prevalence-text {
  display: block;
  width: 40%;
}

.source-text {
  font-size: 0.84rem;
  color: #7b8190;
  line-height: 1;
  text-align: center;
}

.data {
  width: 100%;
  height: 100%;
}



@media (max-width: 992px) {

  .overview-card,
  .problem,
  .prevalence-layout {
    flex-direction: column;
    align-items: stretch;
  }

  .problem-employment,
  .problem-prevalence,
  .problem-distress {
    min-height: auto;
  }

  .prevalence-figure,
  .prevalence-text {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 72px 20px 96px;
  }

  .page-title {
    font-size: 2.4rem;
  }

  .logo {
    width: min(100%, 280px);
  }
}
</style>
