<template>
  <div class="tips-templates-page">
    <!-- Main View -->
    <template v-if="!selectedCategory">
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
          <div class="template-card">
            <div class="template-header">
              <div class="template-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h3 class="template-title">Email Template</h3>
            </div>
            <p class="template-description">A ready-to-send email structure for clear and concise communication.</p>
          </div>

          <div class="template-card">
            <div class="template-header">
              <div class="template-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <h3 class="template-title">Meeting Note</h3>
            </div>
            <p class="template-description">A simple format to capture key points and action items in any meeting.</p>
          </div>

          <div class="template-card">
            <div class="template-header">
              <div class="template-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 class="template-title">Weekly Planning</h3>
            </div>
            <p class="template-description">Plan your week in one page — priorities, tasks, and time blocks included.</p>
          </div>
        </div>
      </section>
    </template>

    <!-- Detail View -->
    <template v-else>
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

        <!-- Search Box -->
        <div class="search-section">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              class="search-input" 
              placeholder="Search tips by keyword..."
              v-model="searchKeyword"
            />
            <button class="search-clear" v-if="searchKeyword" @click="searchKeyword = ''">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Subcategory Filter (only for Management Tips) -->
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
          <p>No tips found matching your search.</p>
        </div>

        <!-- Tips List -->
        <div class="tips-list">
          <div class="tip-item" v-for="item in paginatedItems" :key="item.id">
            <div class="tip-item-header">
              <span class="tip-item-badge" v-if="selectedCategory.subcategories && selectedCategory.subcategories.length > 1">
                {{ item.subcategory }}
              </span>
              <h3 class="tip-item-title">{{ item.tip }}</h3>
            </div>
            <p class="tip-item-description">{{ item.description }}</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"></path>
            </svg>
          </button>
          
          <button 
            class="page-btn page-number"
            v-for="page in visiblePages"
            :key="page"
            :class="{ active: currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import tipsData from '@/data/tips.json'

const selectedCategory = ref(null)
const selectedSubcategory = ref('All')
const searchKeyword = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

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

function getCategoryIcon(title) {
  return categoryIcons[title] || ''
}

function getCategoryDescription(title) {
  return categoryDescriptions[title] || ''
}

function selectCategory(category) {
  selectedCategory.value = category
  selectedSubcategory.value = 'All'
  currentPage.value = 1
}

function goBack() {
  selectedCategory.value = null
  selectedSubcategory.value = 'All'
  searchKeyword.value = ''
  currentPage.value = 1
}

const filteredItems = computed(() => {
  if (!selectedCategory.value) return []
  
  let items = selectedCategory.value.items
  
  // Filter by subcategory
  if (selectedSubcategory.value !== 'All') {
    items = items.filter(item => item.subcategory === selectedSubcategory.value)
  }
  
  // Filter by search keyword
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    items = items.filter(item => 
      item.tip.toLowerCase().includes(keyword) || 
      item.description.toLowerCase().includes(keyword)
    )
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
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, 5)
    } else {
      start = Math.max(1, total - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

watch(selectedSubcategory, () => {
  currentPage.value = 1
})

watch(searchKeyword, () => {
  currentPage.value = 1
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
  margin-bottom: 32px;
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

/* Search Section */
.search-section {
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 12px 16px;
  gap: 12px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.search-icon {
  color: #888;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  outline: none;
}

.search-input::placeholder {
  color: #aaa;
}

.search-clear {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.search-clear:hover {
  color: #555;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 24px;
  color: #888;
  font-size: 1rem;
}

/* Tips List - Grid Layout */
.tips-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.tip-item {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 180px;
}

.tip-item:hover {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.tip-item-header {
  margin-bottom: 12px;
}

.tip-item-badge {
  display: inline-block;
  font-size: 0.8rem;
  padding: 3px 8px;
  background: rgba(74, 109, 140, 0.1);
  color: #4a6d8c;
  border-radius: 10px;
  margin-bottom: 8px;
}

.tip-item-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.4;
}

.tip-item-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  max-height: 120px;
  padding-right: 8px;
}

.tip-item-description::-webkit-scrollbar {
  width: 4px;
}

.tip-item-description::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.tip-item-description::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}

.tip-item-description::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
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

/* Responsive */
@media (max-width: 768px) {
  .tips-grid,
  .template-grid,
  .tips-list {
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

  .tip-item {
    min-height: auto;
  }
}

@media (max-width: 992px) and (min-width: 769px) {
  .tips-grid,
  .template-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
