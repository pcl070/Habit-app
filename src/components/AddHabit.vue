<template>
  <div class="add-habit">
    <input v-model="habitName" placeholder="Enter new habit name" />
    <button @click="addHabit">Add Habit</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    onAddHabit: Function,
  },
  setup(props) {
    const habitName = ref('')

    const addHabit = () => {
      if (habitName.value.trim()) {
        props.onAddHabit(habitName.value.trim())
        habitName.value = ''
      }
    }

    return { habitName, addHabit }
  },
}
</script>

<style scoped>
.add-habit {
  padding: 10px;
  display: flex;
  flex-direction: column;
}
</style>
