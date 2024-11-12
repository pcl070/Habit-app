<template>
  <div class="navigation">
    <button @click="goToPreviousDay">Previous</button>
    <span>{{ currentDate }}</span>
    <button @click="goToNextDay">Next</button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const currentDate = computed(() => route.params.date || new Date().toISOString().split('T')[0])

    const goToPreviousDay = () => {
      const previousDate = new Date(new Date(currentDate.value) - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      router.push(`/day/${previousDate}`)
    }

    const goToNextDay = () => {
      const nextDate = new Date(new Date(currentDate.value).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]
      router.push(`/day/${nextDate}`)
    }

    return { currentDate, goToPreviousDay, goToNextDay }
  },
}
</script>

<style scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>
