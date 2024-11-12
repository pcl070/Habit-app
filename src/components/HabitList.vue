<template>
  <div class="habit-list">
    <div class="habit-item" v-for="habit in habits" :key="habit.id">
      <HabitItem
        :habit="habit"
        :isCompleted="isHabitCompleted(habit.id)"
        @toggle-completion="toggleCompletion"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import HabitItem from './HabitItem.vue'

export default {
  components: { HabitItem },
  setup() {
    const store = useStore()
    const habits = computed(() => store.state.habits)
    const isHabitCompleted = (id) => store.getters.isHabitCompleted(id)
    const toggleCompletion = (id) => store.commit('toggleHabitCompletion', id)

    return { habits, isHabitCompleted, toggleCompletion }
  },
}
</script>

<style scoped></style>
