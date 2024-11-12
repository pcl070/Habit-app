import { defineStore } from 'pinia'
import { watch } from 'vue'
import dayjs from 'dayjs'

export const useHabitStore = defineStore('habitStore', {
  // State initialization
  state: () => ({
    habits: [
      { id: 1, name: 'Exercise', category: 'Health' },
      { id: 2, name: 'Read', category: 'Hobbies' },
      { id: 3, name: 'Meditate', category: 'Health' },
    ],
    completedHabits: {}, // Stores completed habits by date
    selectedDate: new Date().toISOString().split('T')[0], // Current selected date
    categories: ['Health', 'Hobbies', 'Work'], // List of habit categories
    nextHabitId: 4, // Next habit ID counter
  }),

  actions: {
    // Toggles the completion status of a habit for the selected date
    toggleHabitCompletion(habitId) {
      const date = this.selectedDate
      if (!this.completedHabits[date]) {
        this.completedHabits[date] = {}
      }
      if (this.completedHabits[date][habitId]) {
        delete this.completedHabits[date][habitId] // Remove habit if completed
      } else {
        this.completedHabits[date][habitId] = true // Mark habit as completed
      }
      if (Object.keys(this.completedHabits[date]).length === 0) {
        delete this.completedHabits[date] // Remove empty dates
      }
      localStorage.setItem('completedHabits', JSON.stringify(this.completedHabits))
    },

    // Adds a new habit to the list and increments the next habit ID
    addHabit(newHabit) {
      const newId = this.nextHabitId
      this.habits.push({ id: newId, ...newHabit })
      this.nextHabitId += 1
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('nextHabitId', this.nextHabitId.toString())
    },

    // Removes a habit from the list and clears it from completed habits
    removeHabit(habitId) {
      for (const date in this.completedHabits) {
        if (this.completedHabits[date][habitId]) {
          delete this.completedHabits[date][habitId] // Remove habit from each date
        }
        if (Object.keys(this.completedHabits[date]).length === 0) {
          delete this.completedHabits[date] // Clean up empty dates
        }
      }
      this.habits = this.habits.filter((habit) => habit.id !== habitId) // Remove habit from list
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('completedHabits', JSON.stringify(this.completedHabits))
    },

    // Adds a new category if it doesn't already exist
    addCategory(newCategory) {
      if (!this.categories.includes(newCategory)) {
        this.$patch((state) => {
          state.categories.push(newCategory)
        })
        localStorage.setItem('categories', JSON.stringify(this.categories))
      }
    },

    // Edits an existing category, updating all related habits
    editCategory(oldCategory, newCategory) {
      const categoryIndex = this.categories.indexOf(oldCategory)
      if (categoryIndex !== -1) {
        this.$patch((state) => {
          state.categories.splice(categoryIndex, 1, newCategory) // Update category name
          state.habits = state.habits.map((habit) => {
            if (habit.category === oldCategory) {
              return { ...habit, category: newCategory } // Update habit category
            }
            return habit
          })
        })
        localStorage.setItem('habits', JSON.stringify(this.habits))
        localStorage.setItem('categories', JSON.stringify(this.categories))
      }
    },

    // Deletes a category and removes all habits under that category
    deleteCategory(category) {
      this.$patch((state) => {
        state.categories = state.categories.filter((cat) => cat !== category)
        state.habits = state.habits.filter((habit) => habit.category !== category)
      })
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('categories', JSON.stringify(this.categories))
    },

    // Loads data from localStorage into the store
    loadFromLocalStorage() {
      const habits = localStorage.getItem('habits')
      const completedHabits = localStorage.getItem('completedHabits')
      const categories = localStorage.getItem('categories')
      const nextHabitId = localStorage.getItem('nextHabitId')
      if (habits) this.habits = JSON.parse(habits)
      if (completedHabits) this.completedHabits = JSON.parse(completedHabits)
      if (categories) this.categories = JSON.parse(categories)
      if (nextHabitId) this.nextHabitId = parseInt(nextHabitId, 10)
    },

    // Initializes localStorage and sets up watchers to auto-save data
    initLocalStorage() {
      this.loadFromLocalStorage() // Load initial data from localStorage
      watch(
        () => this.habits,
        (newHabits) => {
          localStorage.setItem('habits', JSON.stringify(newHabits))
        },
        { deep: true },
      )
      watch(
        () => this.completedHabits,
        (newCompletedHabits) => {
          localStorage.setItem('completedHabits', JSON.stringify(newCompletedHabits))
        },
        { deep: true },
      )
      watch(
        () => this.categories,
        (newCategories) => {
          localStorage.setItem('categories', JSON.stringify(newCategories))
        },
        { deep: true },
      )
    },
  },

  getters: {
    // Checks if a habit is completed for the selected date
    isHabitCompleted: (state) => (id) => {
      const date = state.selectedDate
      return state.completedHabits[date] && state.completedHabits[date][id]
    },

    // Calculates the completion streak for a habit based on consecutive dates
    getHabitStreak: (state) => (habitId) => {
      let streak = 0
      let currentDate = dayjs().startOf('day')
      while (true) {
        const dateStr = currentDate.format('YYYY-MM-DD')
        if (state.completedHabits[dateStr] && state.completedHabits[dateStr][habitId]) {
          streak += 1
          currentDate = currentDate.subtract(1, 'day')
        } else {
          break
        }
      }
      return streak
    },
  },
})
