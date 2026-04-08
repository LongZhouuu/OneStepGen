<template>
  <div class="tips-templates-page">
    <!-- Main View -->
    <template v-if="!selectedCategory && !selectedTemplate">
      <div class="page-header">
        <h1 class="page-title">Tips & Templates</h1>
        <p class="page-subtitle">Practical tools and strategies designed for workplace.</p>
      </div>

      <!-- Tips Section -->
      <section class="tips-section">
        <h2 class="section-title">Tips</h2>
        <div class="section-divider"></div>
        
        <div class="tips-grid">
          <div 
            class="tip-card" 
            v-for="category in tipsData" 
            :key="category.title"
            @click="selectCategory(category)"
          >
            <div class="tip-header">
              <div class="tip-icon" v-html="getCategoryIcon(category.title)"></div>
              <h3 class="tip-title">{{ category.title }}</h3>
            </div>
            <p class="tip-count">{{ category.items.length }} tips available</p>
            <p class="tip-description">{{ getCategoryDescription(category.title) }}</p>
          </div>
        </div>
      </section>

      <!-- Template Section -->
      <section class="template-section">
        <h2 class="section-title">Templates</h2>
        <div class="section-divider"></div>
        
        <div class="template-grid">
          <div 
            class="template-card" 
            v-for="category in templatesData" 
            :key="category.id"
            @click="selectTemplate(category)"
          >
            <div class="template-header">
              <div class="template-icon" v-html="getTemplateIcon(category.title)"></div>
              <h3 class="template-title">{{ category.title }}</h3>
            </div>
            <p class="template-count">{{ category.items.length }} templates available</p>
            <p class="template-description">{{ getTemplateDescription(category.title) }}</p>
          </div>
        </div>
      </section>
    </template>

    <!-- Tips Detail View -->
    <template v-else-if="selectedCategory">
      <div class="detail-view">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          Back to Tips & Templates
        </button>

        <div class="detail-header">
          <div class="detail-icon" v-html="getCategoryIcon(selectedCategory.title)"></div>
          <h1 class="detail-title">{{ selectedCategory.title }}</h1>
          <p class="detail-count">{{ filteredItems.length }} tips</p>
        </div>

        <!-- Subcategory Filter -->
        <div class="filter-section" v-if="selectedCategory.subcategories && selectedCategory.subcategories.length > 1">
          <div class="filter-label">Filter by subcategory:</div>
          <div class="filter-tabs">
            <button 
              class="filter-tab" 
              :class="{ active: selectedSubcategory === 'All' }"
              @click="selectedSubcategory = 'All'"
            >
              All
            </button>
            <button 
              class="filter-tab" 
              v-for="sub in selectedCategory.subcategories" 
              :key="sub"
              :class="{ active: selectedSubcategory === sub }"
              @click="selectedSubcategory = sub"
            >
              {{ sub }}
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div class="no-results" v-if="filteredItems.length === 0">
          <p>No tips found in this category.</p>
        </div>

        <!-- Tips List -->
        <div class="tips-list" v-if="filteredItems.length > 0">
          <div 
            class="tip-item" 
            v-for="item in paginatedItems" 
            :key="item.id"
            :class="{ expanded: expandedId === item.id }"
            @click="toggleExpand(item.id)"
          >
            <div class="tip-item-header">
              <span class="tip-item-badge" v-if="selectedCategory.subcategories && selectedCategory.subcategories.length > 1">
                {{ item.subcategory }}
              </span>
              <div class="tip-item-title-row">
                <h3 class="tip-item-title">{{ item.tip }}</h3>
                <svg 
                  class="expand-icon" 
                  :class="{ rotated: expandedId === item.id }"
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </div>
            </div>
            <p class="tip-item-description">{{ item.description }}</p>
            
            <!-- Expanded Content -->
            <div class="tip-item-details" v-if="expandedId === item.id">
              <div class="tip-steps" v-if="item.steps && item.steps.length">
                <h4 class="steps-title">Steps:</h4>
                <ol class="steps-list">
                  <li v-for="(step, index) in item.steps" :key="index">{{ step }}</li>
                </ol>
              </div>
              <div class="tip-example" v-if="item.example">
                <h4 class="example-title">Example:</h4>
                <p class="example-text">"{{ item.example }}"</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="currentPage = 1"
            title="First page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 17l-5-5 5-5"></path>
              <path d="M18 17l-5-5 5-5"></path>
            </svg>
          </button>
          
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>
          
          <template v-for="(page, index) in visiblePages" :key="index">
            <span v-if="page === '...'" class="page-ellipsis">...</span>
            <button 
              v-else
              class="page-btn page-number"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
          </template>
          
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>
          
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="currentPage = totalPages"
            title="Last page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 17l5-5-5-5"></path>
              <path d="M13 17l5-5-5-5"></path>
            </svg>
          </button>
        </div>
      </div>
    </template>

    <!-- Template Detail View -->
    <template v-else-if="selectedTemplate">
      <div class="detail-view">
        <button class="back-btn" @click="goBack">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
          Back to Tips & Templates
        </button>

        <div class="detail-header">
          <div class="detail-icon" v-html="getTemplateIcon(selectedTemplate.title)"></div>
          <h1 class="detail-title">{{ selectedTemplate.title }} Templates</h1>
          <p class="detail-count">{{ filteredTemplateItems.length }} templates</p>
        </div>

        <!-- Subcategory Filter -->
        <div class="filter-section" v-if="selectedTemplate.subcategories && selectedTemplate.subcategories.length > 1">
          <div class="filter-label">Filter by type:</div>
          <div class="filter-tabs">
            <button 
              class="filter-tab" 
              :class="{ active: selectedTemplateSubcategory === 'All' }"
              @click="selectedTemplateSubcategory = 'All'"
            >
              All
            </button>
            <button 
              class="filter-tab" 
              v-for="sub in selectedTemplate.subcategories" 
              :key="sub"
              :class="{ active: selectedTemplateSubcategory === sub }"
              @click="selectedTemplateSubcategory = sub"
            >
              {{ sub }}
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div class="no-results" v-if="filteredTemplateItems.length === 0">
          <p>No templates found in this category.</p>
        </div>

        <!-- Template List -->
        <div class="templates-list" v-if="filteredTemplateItems.length > 0">
          <div 
            class="template-item" 
            v-for="item in paginatedTemplateItems" 
            :key="item.id"
            :class="{ expanded: expandedTemplateId === item.id }"
            @click="toggleTemplateExpand(item.id)"
          >
            <div class="template-item-header">
              <span class="template-item-badge" v-if="selectedTemplate.subcategories && selectedTemplate.subcategories.length > 1">
                {{ item.subcategory }}
              </span>
              <div class="template-item-title-row">
                <h3 class="template-item-title">{{ item.title }}</h3>
                <svg 
                  class="expand-icon" 
                  :class="{ rotated: expandedTemplateId === item.id }"
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </div>
            </div>
            <p class="template-item-description">{{ item.description }}</p>
            
            <!-- Expanded Content -->
            <div class="template-item-details" v-if="expandedTemplateId === item.id">
              <div class="template-content">
                <h4 class="content-title">Template:</h4>
                <pre class="content-text">{{ item.content }}</pre>
              </div>
              <div class="template-actions">
                <button class="action-btn copy-btn" @click.stop="copyTemplate(item.content)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  {{ copiedId === item.id ? 'Copied!' : 'Copy' }}
                </button>
                <button class="action-btn export-btn" @click.stop="exportTemplate(item)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  {{ exportedId === item.id ? 'Exported!' : 'Export' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="templateTotalPages > 1">
          <button 
            class="page-btn" 
            :disabled="templateCurrentPage === 1"
            @click="templateCurrentPage = 1"
            title="First page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 17l-5-5 5-5"></path>
              <path d="M18 17l-5-5 5-5"></path>
            </svg>
          </button>
          
          <button 
            class="page-btn" 
            :disabled="templateCurrentPage === 1"
            @click="templateCurrentPage--"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>
          
          <template v-for="(page, index) in templateVisiblePages" :key="index">
            <span v-if="page === '...'" class="page-ellipsis">...</span>
            <button 
              v-else
              class="page-btn page-number"
              :class="{ active: templateCurrentPage === page }"
              @click="templateCurrentPage = page"
            >
              {{ page }}
            </button>
          </template>
          
          <button 
            class="page-btn" 
            :disabled="templateCurrentPage === templateTotalPages"
            @click="templateCurrentPage++"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>
          
          <button 
            class="page-btn" 
            :disabled="templateCurrentPage === templateTotalPages"
            @click="templateCurrentPage = templateTotalPages"
            title="Last page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 17l5-5-5-5"></path>
              <path d="M13 17l5-5-5-5"></path>
            </svg>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { tipsData } from '@/data/tips.js'
import templatesData from '@/data/templates.JS'

const selectedCategory = ref(null)
const selectedSubcategory = ref('All')
const currentPage = ref(1)
const expandedId = ref(null)
const itemsPerPage = 6

// Template states
const selectedTemplate = ref(null)
const selectedTemplateSubcategory = ref('All')
const templateCurrentPage = ref(1)
const expandedTemplateId = ref(null)
const copiedId = ref(null)
const exportedId = ref(null)

const categoryIcons = {
  'Communication Tips': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>`,
  'Meeting Tips': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="4" width="18" height="4" rx="1"></rect>
    <rect x="3" y="10" width="18" height="4" rx="1"></rect>
    <rect x="3" y="16" width="18" height="4" rx="1"></rect>
  </svg>`,
  'Management Tips': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>`
}

const categoryDescriptions = {
  'Communication Tips': 'Use short, direct messages to reduce back-and-forth and stay focused.',
  'Meeting Tips': 'Keep meetings focused, productive, and respectful of everyone\'s time.',
  'Management Tips': 'Use timers and time blocks to make your day more predictable.'
}

// Template icons and descriptions
const templateIcons = {
  'Email': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>`,
  'Meeting': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>`,
  'Planning': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>`
}

const templateDescriptions = {
  'Email': 'Ready-to-use email templates for clear and professional communication.',
  'Meeting': 'Structured templates for meeting agendas and notes.',
  'Planning': 'Daily and weekly planning templates to organize your time.'
}

function getCategoryIcon(title) {
  return categoryIcons[title] || ''
}

function getCategoryDescription(title) {
  return categoryDescriptions[title] || ''
}

function getTemplateIcon(title) {
  return templateIcons[title] || ''
}

function getTemplateDescription(title) {
  return templateDescriptions[title] || ''
}

function selectCategory(category) {
  selectedCategory.value = category
  selectedSubcategory.value = 'All'
  currentPage.value = 1
  expandedId.value = null
}

function goBack() {
  selectedCategory.value = null
  selectedSubcategory.value = 'All'
  currentPage.value = 1
  expandedId.value = null
  selectedTemplate.value = null
  selectedTemplateSubcategory.value = 'All'
  templateCurrentPage.value = 1
  expandedTemplateId.value = null
}

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

// Template functions
function selectTemplate(template) {
  selectedTemplate.value = template
  selectedTemplateSubcategory.value = 'All'
  templateCurrentPage.value = 1
  expandedTemplateId.value = null
}

function toggleTemplateExpand(id) {
  expandedTemplateId.value = expandedTemplateId.value === id ? null : id
}

function copyTemplate(content) {
  navigator.clipboard.writeText(content)
  copiedId.value = expandedTemplateId.value
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

function exportTemplate(item) {
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
    <head>
      <meta charset="utf-8">
      <title>${item.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h1 { color: #333; margin-bottom: 10px; }
        p.description { color: #666; margin-bottom: 20px; }
        pre { background: #f5f5f5; padding: 15px; white-space: pre-wrap; font-family: inherit; }
      </style>
    </head>
    <body>
      <h1>${item.title}</h1>
      <p class="description">${item.description}</p>
      <pre>${item.content}</pre>
    </body>
    </html>
  `
  
  const blob = new Blob([htmlContent], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${item.title.replace(/\s+/g, '_')}.doc`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  exportedId.value = item.id
  setTimeout(() => {
    exportedId.value = null
  }, 2000)
}

const filteredItems = computed(() => {
  if (!selectedCategory.value) return []
  
  let items = selectedCategory.value.items
  
  // Filter by subcategory
  if (selectedSubcategory.value !== 'All') {
    items = items.filter(item => item.subcategory === selectedSubcategory.value)
  }
  
  return items
})

const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)
    
    if (current <= 3) {
      end = 4
    }
    if (current >= total - 2) {
      start = total - 3
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    pages.push(total)
  }
  
  return pages
})

watch(selectedSubcategory, () => {
  currentPage.value = 1
  expandedId.value = null
})

// Template computed properties
const filteredTemplateItems = computed(() => {
  if (!selectedTemplate.value) return []
  
  let items = selectedTemplate.value.items
  
  if (selectedTemplateSubcategory.value !== 'All') {
    items = items.filter(item => item.subcategory === selectedTemplateSubcategory.value)
  }
  
  return items
})

const templateTotalPages = computed(() => {
  return Math.ceil(filteredTemplateItems.value.length / itemsPerPage)
})

const paginatedTemplateItems = computed(() => {
  const start = (templateCurrentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTemplateItems.value.slice(start, end)
})

const templateVisiblePages = computed(() => {
  const total = templateTotalPages.value
  const current = templateCurrentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    
    if (current > 3) {
      pages.push('...')
    }
    
    let start = Math.max(2, current - 1)
    let end = Math.min(total - 1, current + 1)
    
    if (current <= 3) {
      end = 4
    }
    if (current >= total - 2) {
      start = total - 3
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 2) {
      pages.push('...')
    }
    
    pages.push(total)
  }
  
  return pages
})

watch(selectedTemplateSubcategory, () => {
  templateCurrentPage.value = 1
  expandedTemplateId.value = null
})
</script>

<style scoped>
.tips-templates-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 24px 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  font-size: 3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 1.3rem;
  color: #666;
}

/* Section Styles */
.tips-section,
.template-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.section-divider {
  height: 2px;
  background: linear-gradient(to right, #ccc, transparent);
  margin-bottom: 32px;
}

/* Tips Grid */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.tip-card {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  min-height: 140px;
  cursor: pointer;
}

.tip-card:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.tip-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6d8c;
  flex-shrink: 0;
}

.tip-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 24px;
}

.tip-count {
  font-size: 0.9rem;
  color: #4a6d8c;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.tip-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

/* Template Grid */
.template-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.template-card {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  min-height: 140px;
  cursor: pointer;
}

.template-count {
  font-size: 0.9rem;
  color: #4a6d8c;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.template-card:hover {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.template-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.template-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6d8c;
  flex-shrink: 0;
}

.template-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 24px;
}

.template-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}

/* Detail View */
.detail-view {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #4a6d8c;
  font-size: 1rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 32px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  color: #2a4d6c;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.detail-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a6d8c;
}

.detail-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.detail-count {
  color: #888;
  font-size: 1rem;
  margin-left: auto;
}

/* Filter Section */
.filter-section {
  margin-bottom: 24px;
}

.filter-label {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
}

.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.8);
}

.filter-tab.active {
  background: #4a6d8c;
  color: white;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 24px;
  color: #888;
  font-size: 1rem;
}

/* Tips List */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.tip-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 20px 24px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tip-item:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.tip-item.expanded {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tip-item-header {
  margin-bottom: 8px;
}

.tip-item-badge {
  display: inline-block;
  font-size: 0.75rem;
  padding: 3px 10px;
  background: rgba(74, 109, 140, 0.1);
  color: #4a6d8c;
  border-radius: 10px;
  margin-bottom: 8px;
}

.tip-item-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.tip-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.expand-icon {
  color: #888;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.tip-item-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

/* Expanded Content */
.tip-item-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; max-height: 0; }
  to { opacity: 1; max-height: 500px; }
}

.tip-steps {
  margin-bottom: 16px;
}

.steps-title,
.example-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a6d8c;
  margin: 0 0 8px 0;
}

.steps-list {
  margin: 0;
  padding-left: 20px;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.8;
}

.steps-list li {
  margin-bottom: 4px;
}

.tip-example {
  background: rgba(74, 109, 140, 0.05);
  border-radius: 8px;
  padding: 12px 16px;
}

.example-text {
  font-size: 0.9rem;
  color: #555;
  font-style: italic;
  margin: 0;
  line-height: 1.5;
}

/* Templates List */
.templates-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
}

.template-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 20px 24px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.template-item:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.template-item.expanded {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.template-item-header {
  margin-bottom: 8px;
}

.template-item-badge {
  display: inline-block;
  font-size: 0.75rem;
  padding: 3px 10px;
  background: rgba(74, 109, 140, 0.1);
  color: #4a6d8c;
  border-radius: 10px;
  margin-bottom: 8px;
}

.template-item-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.template-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.template-item-description {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.template-item-details {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  animation: slideDown 0.3s ease;
}

.template-content {
  margin-bottom: 16px;
}

.content-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a6d8c;
  margin: 0 0 8px 0;
}

.content-text {
  background: rgba(74, 109, 140, 0.05);
  border-radius: 8px;
  padding: 16px;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
}

.template-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn {
  background: #4a6d8c;
}

.copy-btn:hover {
  background: #3a5d7c;
}

.export-btn {
  background: #5a8a5a;
}

.export-btn:hover {
  background: #4a7a4a;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #555;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.9);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.active {
  background: #4a6d8c;
  color: white;
}

.page-number {
  font-size: 0.95rem;
  font-weight: 500;
}

.page-ellipsis {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .tips-grid,
  .template-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }

  .detail-header {
    flex-wrap: wrap;
  }

  .detail-count {
    width: 100%;
    margin-left: 56px;
  }

  .filter-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
  }

  .filter-tab {
    flex-shrink: 0;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 8px;
  }
}

@media (max-width: 992px) and (min-width: 769px) {
  .tips-grid,
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
