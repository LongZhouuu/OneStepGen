import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import {
  getStepByRouteName,
  getHighestUnlockedRouteName,
  getWorkflowCurrentStep,
  getStepById,
  syncWorkflowFromSession,
} from './workflow'

// Let scrollBehavior control position; disable the browser's automatic restore.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
import RewardView from '../views/RewardView.vue'
import AboutView from '../views/AboutView.vue'
import PlannerView from '../views/PlannerView.vue'
import TaskSwipper from '../views/TaskSwipper.vue'
import AIDump from '../views/AIDump.vue'
import PrivacyView from '../views/PrivacyView.vue'
import TermsView from '../views/TermsView.vue'
import CompleteView from '@/views/CompleteView.vue'

// Vue Router setup: app routes, scroll behavior, and workflow step access guards.

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  { path: '/workflow/ai-dump', name: 'AIDump', component: AIDump },
  { path: '/workflow/planner', name: 'Planner', component: PlannerView },
  { path: '/workflow/swiper', name: 'TaskSwipper', component: TaskSwipper },
  { path: '/workflow/complete', name: 'Complete', component: CompleteView },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/reward',
    name: 'Reward',
    component: RewardView
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: PrivacyView
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll to top on navigation unless restoring history or following a hash.
  scrollBehavior(to, from, savedPosition) {
    if (!from || from === to || from.fullPath === to.fullPath) {
      return { top: 0, left: 0 }
    }
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, left: 0 }
  }
})

/**
 * Workflow route guard:
 * - Non-workflow routes: pass through.
 * - No session: only step 1 (AIDump).
 * - Entering from outside workflow: resume last viewed step (capped by maxReachedStep).
 * - Inside workflow: any step id ≤ maxReachedStep; otherwise redirect to furthest unlocked.
 */
router.beforeEach((to, from) => {
  const targetStep = getStepByRouteName(to.name)

  if (!targetStep) return true

  const session = syncWorkflowFromSession()

  // only Step 1 is allowed to jump to if there is no session data in localstorage
  if (!session) {
    if (targetStep.id === 1) return true
    return { name: 'AIDump', replace: true }
  }

  const fromStep = getStepByRouteName(from.name)
  const highestRouteName = getHighestUnlockedRouteName()
  const maxReachedStep = session.maxReachedStep ?? 1

  // if entering workflow from outside, resume the last viewed step,
  //  but use maxReachedStep only to limit/unlock available steps
  if (!fromStep) {
    const savedCurrentStep = getWorkflowCurrentStep()
    const safeStepId = Math.min(savedCurrentStep, maxReachedStep)

    const resumeRouteName = getStepById(safeStepId)?.routeName ?? highestRouteName

    if (to.name !== resumeRouteName) {
      return { name: resumeRouteName, replace: true }
    }

    return true
  }

  // elif moving inside workspace, allow going to any unlocked step
  if (targetStep.id <= maxReachedStep) {
    return true
  }

  // trying to access locked future step
  return { name: highestRouteName, replace: true }
})

export default router
