import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

import EditCategoriesPage from '../pages/EditCategoriesPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/edit-categories', name: 'EditCategories', component: EditCategoriesPage },
  { path: '/day/:date', name: 'day', component: HomePage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
