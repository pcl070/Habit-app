import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import AddHabitPage from '../pages/AddHabitPage.vue'
import OnboardingPage from '../pages/OnboardingPage.vue'
import EditCategoriesPage from '../pages/EditCategoriesPage.vue' // Import the new page

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/add-habit', name: 'AddHabit', component: AddHabitPage },
  { path: '/onboarding', name: 'Onboarding', component: OnboardingPage },
  { path: '/edit-categories', name: 'EditCategories', component: EditCategoriesPage }, // New route
  { path: '/day/:date', name: 'day', component: HomePage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
