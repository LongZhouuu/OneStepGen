<template>
  <section class="panel" aria-labelledby="helpline-title">
    <button class="back-btn" type="button" aria-label="Back to support menu" @click="$emit('back')">← Back</button>

    <h2 id="helpline-title">Helpful Resources</h2>
    <p class="sub">Trusted ADHD and mental health support services.</p>

    <article
      v-for="resource in resources"
      :key="resource.name"
      class="resource-card"
    >
      <h3 class="resource-title">{{ resource.name }}</h3>
      <p class="desc">{{ resource.description }}</p>
      <p v-if="resource.phone" class="phone">
        <span class="label">Phone:</span>
        <a
          :href="toTelLink(resource.phone)"
          class="phone-link"
          :aria-label="`Call ${resource.name} at ${resource.phone}`"
        >
          {{ resource.phone }}
        </a>
      </p>
      <a
        :href="resource.website"
        target="_blank"
        rel="noopener noreferrer"
        class="website"
        :aria-label="`Open ${resource.name} website in a new tab`"
      >
        {{ websiteLabel(resource.website) }}
        <span aria-hidden="true">-&gt;</span>
      </a>
    </article>
  </section>
</template>

<script setup>
defineEmits(['back'])

const resources = [
  {
    name: 'ADHD Australia',
    description: 'National ADHD support and resources.',
    website: 'https://adhdaustralia.org.au',
  },
  {
    name: 'ADDA (Adult ADHD Support)',
    description: 'Support and tools for adults with ADHD.',
    website: 'https://add.org',
  },
  {
    name: 'Lifeline Australia',
    description: '24/7 crisis support.',
    phone: '13 11 14',
    website: 'https://www.lifeline.org.au',
  },
  {
    name: 'Beyond Blue',
    description: 'Support for anxiety, depression, and burnout.',
    phone: '1300 22 4636',
    website: 'https://www.beyondblue.org.au',
  },
]

const toTelLink = (phone) => `tel:${phone.replace(/\s+/g, '')}`

const websiteLabel = (website) =>
  website.replace(/^https?:\/\//, '').replace(/^www\./, '')
</script>

<style scoped>
.panel {
  padding-top: 10px;
}

.back-btn {
  border: none;
  background: none;
  cursor: pointer;
  margin-bottom: 18px;
  font-size: 15px;
  border-radius: 6px;
}

.sub {
  color: #7b6a5c;
  margin-bottom: 18px;
}

.resource-card {
  background: #faf6f2;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.resource-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(72, 42, 20, 0.08);
}

.resource-title {
  display: block;
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
}

.desc {
  color: #5b4a3e;
  margin: 0 0 8px;
  font-size: 14px;
}

.phone {
  margin: 0 0 8px;
  font-size: 14px;
  color: #3a2f26;
}

.phone .label {
  color: #7b6a5c;
  margin-right: 4px;
}

.phone-link {
  color: #3a2f26;
  text-decoration: none;
  font-weight: 500;
}

.phone-link:hover,
.phone-link:focus-visible {
  text-decoration: underline;
}

.website {
  display: inline-block;
  color: #b8794f;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.website:hover,
.website:focus-visible {
  text-decoration: underline;
}

.back-btn:focus-visible,
.phone-link:focus-visible,
.website:focus-visible {
  outline: 3px solid #4d2a1d;
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .resource-card {
    transition: none;
  }

  .resource-card:hover {
    transform: none;
  }
}
</style>
