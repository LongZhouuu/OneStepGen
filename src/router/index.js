import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RewardView from '../views/RewardView.vue'
import AboutView from '../views/AboutView.vue'
import PlannerView from '../views/PlannerView.vue'
import PrioritizerView from '../views/tools/PrioritizerView.vue'
import SupportView from '../views/tools/SupportView.vue'
import TipsView from '../views/tools/TipsAndTemplatesView.vue'
import TaskSwipper from '@/views/TaskSwipper.vue'
import AIDump from '@/views/AIDump.vue'
import PlanView from '@/views/PlanView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  { path: '/workflow/ai-dump', name: 'AIDump', component: AIDump },
  { path: '/workflow/plan', name: 'Plan', component: PlanView },
  { path: '/workflow/planner', name: 'Planner', component: PlannerView },
  { path: '/workflow/swiper', name: 'TaskSwipper', component: TaskSwipper },
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
  {
    path: '/tools/tips',
    name: 'Tips',
    component: TipsView
  },
  {
    path: '/reward',
    name: 'Reward',
    component: RewardView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router