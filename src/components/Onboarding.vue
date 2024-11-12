<template>
  <div class="onboarding-page">
    <h1>Welcome to the Habit Tracker!</h1>
    <p>Learn how to track your habits and stay consistent.</p>
    <button @click="skipOnboarding">Get Started</button>
  </div>
</template>

<script>
export default {
  methods: {
    skipOnboarding() {
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.onboarding-page {
  padding: 20px;
  text-align: center;
}
</style>
