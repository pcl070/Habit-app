<template>
  <div class="add-habit-page">
    <h2>Add a New Habit</h2>
    <input v-model="habitName" placeholder="Enter habit name" />
    <select v-model="selectedCategory">
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    <div class="button-group">
      <button @click="addHabit">Add Habit</button>
      <button @click="cancel" class="cancel-button">Cancel</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useHabitStore } from '../stores'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const habitStore = useHabitStore()
    const habitName = ref('')
    const categories = habitStore.categories || []
    const selectedCategory = ref(categories[0] || '')
    const router = useRouter()

    const addHabit = () => {
      if (habitName.value.trim()) {
        habitStore.addHabit({ name: habitName.value.trim(), category: selectedCategory.value })
        habitName.value = ''
        router.push('/') // Navigate to the main page after adding
      }
    }

    const cancel = () => {
      router.push('/') // Navigate to the main page when canceled
    }

    return { habitName, selectedCategory, categories, addHabit, cancel }
  },
}
</script>

<style scoped>
.add-habit-page {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  border: none;
}

.cancel-button {
  background-color: #f44336;
}

.cancel-button:hover {
  background-color: #d32f2f;
}
</style>
