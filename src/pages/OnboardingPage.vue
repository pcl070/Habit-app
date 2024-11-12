<template>
  <div>
    <Onboarding v-if="showOnboarding" @close-onboarding="closeOnboarding" />
    <HomePage v-else />
  </div>
</template>

<script>
import { ref } from 'vue'
import Onboarding from '../components/Onboarding.vue'
import HomePage from './HomePage.vue'

export default {
  components: { Onboarding, HomePage },
  setup() {
    const showOnboarding = ref(!localStorage.getItem('hasSeenOnboarding'))

    const closeOnboarding = () => {
      showOnboarding.value = false
      localStorage.setItem('hasSeenOnboarding', true) // Mark onboarding as seen
    }

    return { showOnboarding, closeOnboarding }
  },
}
</script>

<style scoped>
/* Optional dark mode adjustments for OnboardingPage */
.dark {
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
