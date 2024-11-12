import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AddHabitPage from '../pages/AddHabitPage.vue'
import OnboardingPage from '../pages/OnboardingPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/add-habit', component: AddHabitPage },
  { path: '/onboarding', component: OnboardingPage },
  { path: '/day/:date', name: 'day', component: HomePage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
