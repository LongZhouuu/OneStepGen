import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RewardView from '../views/RewardView.vue'
import AboutView from '../views/AboutView.vue'
import PlannerView from '../views/tools/PlannerView.vue'
import PrioritizerView from '../views/tools/PrioritizerView.vue'
import SupportView from '../views/tools/SupportView.vue'
import TipsView from '../views/tools/TipsAndTemplatesView.vue'
import TaskSwipper from '@/views/TaskSwipper.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView
  },
  {
    path: '/tools/planner',
    name: 'Planner',
    component: PlannerView
  },
  {
    path: '/tools/planner/swipper',
    name: 'TaskSwipper',
    component: TaskSwipper
  },
  {
    path: '/tools/prioritizer',
    name: 'Prioritizer',
    component: PrioritizerView
  },
  {
    path: '/tools/support',
    name: 'Support',
    component: SupportView
  },
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