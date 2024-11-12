<template>
  <div class="homepage">
    <Calendar />
    <div>
      <!-- Sorting and Filtering Section -->
      <div class="filter-sort-section">
        <label for="categoryFilter">Filter by Category:</label>
        <select v-model="filterCategory" id="categoryFilter">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <!-- Button to edit categories -->
        <button @click="goToEditCategories" class="edit-categories-btn">Edit Categories</button>
      </div>

      <!-- Habit List with Pagination -->
      <div class="habit-list">
        <HabitItem
          v-for="habit in paginatedHabits"
          :key="habit.id"
          :habit="habit"
          :isCompleted="isHabitCompleted(habit.id)"
          :streak="habitStreak(habit.id)"
          @toggle-completion="toggleHabitCompletion"
          @delete-habit="removeHabit"
        />
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>

      <!-- Add habit section -->
      <div class="add-habit-section">
        <input v-model="newHabitName" placeholder="Enter new habit name" class="habit-input" />
        <!-- Character limit warning -->
        <span :class="{ 'warning-text': true, visible: newHabitName.length > 25 }"
          >Habit name should be 25 characters or less!</span
        >
        <!-- Category selection-->
        <select v-model="selectedCategory" class="habit-category">
          <option disabled value="">Select Category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <button @click="addHabit" :disabled="newHabitName.length > 25" class="icon-btn add-btn">
          <div class="add-icon"></div>
          <div class="btn-txt">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="var(--button-text-color)"
            >
              <path
                d="M4 12H20M12 4V20"
                stroke="var(--button-text-color)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHabitStore } from '../stores'
import Calendar from '../components/Calendar.vue'
import HabitItem from '../components/HabitItem.vue'

export default {
  components: { Calendar, HabitItem },
  setup() {
    const router = useRouter()
    const habitStore = useHabitStore()
    const route = useRoute()

    const habits = computed(() => habitStore.habits)
    const categories = computed(() => habitStore.categories)
    const isHabitCompleted = (id) => habitStore.isHabitCompleted(id)
    const toggleHabitCompletion = (id) => habitStore.toggleHabitCompletion(id)
    const habitStreak = (id) => habitStore.getHabitStreak(id)

    // State for new habit input
    const newHabitName = ref('')
    const selectedCategory = ref('')

    // Watcher to enforce capitalization of the first letter
    watch(newHabitName, (value) => {
      if (value) {
        newHabitName.value = value.charAt(0).toUpperCase() + value.slice(1)
      }
    })
    // Adding a habit
    const addHabit = () => {
      if (newHabitName.value.trim() && selectedCategory.value) {
        habitStore.addHabit({
          name: newHabitName.value.trim(),
          category: selectedCategory.value,
        })
        newHabitName.value = ''
        selectedCategory.value = ''
      } else {
        alert('Please enter a habit name and select a category')
      }
    }

    // Go to Edit Categories page
    const goToEditCategories = () => {
      router.push({ name: 'EditCategories' })
    }

    // Pagination and Filtering State
    const filterCategory = ref('')
    const currentPage = ref(1)
    const habitsPerPage = 5

    const filteredHabits = computed(() => {
      return filterCategory.value
        ? habits.value.filter((habit) => habit.category === filterCategory.value)
        : habits.value
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredHabits.value.length / habitsPerPage)
    })

    const paginatedHabits = computed(() => {
      const start = (currentPage.value - 1) * habitsPerPage
      const end = start + habitsPerPage
      return filteredHabits.value.slice(start, end)
    })

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    watch(filterCategory, () => {
      currentPage.value = 1
    })

    const removeHabit = (habitId) => {
      habitStore.removeHabit(habitId)
    }

    watch(
      () => route.params.date,
      (newDate) => {
        if (newDate) {
          habitStore.selectedDate = newDate
        }
      },
      { immediate: true },
    )

    return {
      habits,
      categories,
      isHabitCompleted,
      toggleHabitCompletion,
      habitStreak,
      removeHabit,
      newHabitName,
      selectedCategory,
      addHabit,
      filterCategory,
      currentPage,
      totalPages,
      paginatedHabits,
      nextPage,
      prevPage,
      goToEditCategories,
    }
  },
}
</script>

<style scoped>
.homepage {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 30px;
  min-height: 95vh;
  padding: 10px;
}

.habit-list {
  display: flex;
  flex-direction: column;
  min-width: 350px;
}

.add-habit-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

.habit-input,
.habit-category,
#categoryFilter {
  padding: 8px;
  border-radius: 15px;
  border: 1px solid;
  border-color: var(--buton-bord-color);
}
#categoryFilter {
  margin-left: 5px;
}

.filter-sort-section {
  margin: 15px 0;
}

.warning-text {
  color: rgb(0, 0, 0);
  font-size: 12px;
  margin-top: 60px;
  position: absolute;
  border: #212121 solid 1px;
  padding: 0 4px;
  border-radius: 15px;
  background-color: rgba(255, 0, 0, 0.521);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.warning-text.visible {
  opacity: 1;
}

button {
  border: 1px solid;
  border-color: var(--buton-bord-color);
  padding: 8px 10px;
  border-radius: 15px;
  box-shadow: #212121 2px 2px 5px;
  transition: ease 0.1s;
  margin-left: 10px;
}

button:disabled {
  background-color: rgb(219, 135, 135);
  cursor: not-allowed;
}

button:hover:enabled {
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 850px) {
  .homepage {
    flex-direction: column;
  }
}
</style>
