import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import {
  getStepByRouteName,
  getHighestUnlockedRouteName,
  syncWorkflowFromSession,
} from './workflow'

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
import RewardView from '../views/RewardView.vue'
import AboutView from '../views/AboutView.vue'
import PlannerView from '../views/PlannerView.vue'
// import PrioritizerView from '../views/tools/PrioritizerView.vue'
// import SupportView from '../views/tools/SupportView.vue'
// import TipsView from '../views/tools/TipsAndTemplatesView.vue'
import TaskSwipper from '../views/TaskSwipper.vue'
import AIDump from '../views/AIDump.vue'
// import PlanView from '../views/PlanView.vue'
import PrivacyView from '../views/PrivacyView.vue'
import TermsView from '../views/TermsView.vue'
import CompleteView from '@/views/CompleteView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  { path: '/workflow/ai-dump', name: 'AIDump', component: AIDump },
  // { path: '/workflow/plan', name: 'Plan', component: PlanView },
  { path: '/workflow/planner', name: 'Planner', component: PlannerView },
  { path: '/workflow/swiper', name: 'TaskSwipper', component: TaskSwipper },
  { path: '/workflow/complete', name: 'Complete', component: CompleteView },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  // {
  //   path: '/tools/planner',
  //   name: 'Planner',
  //   component: PlannerView
  // },
  // {
  //   path: '/tools/planner/swipper',
  //   name: 'TaskSwipper',
  //   component: TaskSwipper
  // },
  // {
  //   path: '/tools/prioritizer',
  //   name: 'Prioritizer',
  //   component: PrioritizerView
  // },
  // {
  //   path: '/tools/support',
  //   name: 'Support',
  //   component: SupportView
  // },
  // {
  //   path: '/tools/tips',
  //   name: 'Tips',
  //   component: TipsView
  // },
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
  scrollBehavior(to, from, savedPosition) {
    if (!from || from === to || from.fullPath === to.fullPath) {
      return { top: 0, left: 0 }
    }
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, left: 0 }
  }
})

router.beforeEach((to) => {
  const targetStep = getStepByRouteName(to.name)

  // nothing happend if not to workspace
  if (!targetStep) return true

  const session = syncWorkflowFromSession()

  // enter Step 1 AI Dump if no session set
  if (!session) {
    if (targetStep.id === 1) return true
    return { name: 'AIDump', replace: true }
  }

  // jump to maxReachedStep if field exist
  const highestRouteName = getHighestUnlockedRouteName()

  if (to.name !== highestRouteName) {
    return { name: highestRouteName, replace: true }
  }

  return true
})

export default router