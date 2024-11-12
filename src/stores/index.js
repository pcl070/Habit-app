import { defineStore } from 'pinia'
import { watch } from 'vue'
import dayjs from 'dayjs'

export const useHabitStore = defineStore('habitStore', {
  state: () => ({
    habits: [
      { id: 1, name: 'Exercise', category: 'Health' },
      { id: 2, name: 'Read', category: 'Hobbies' },
      { id: 3, name: 'Meditate', category: 'Health' },
    ],
    completedHabits: {},
    selectedDate: new Date().toISOString().split('T')[0],
    categories: ['Health', 'Hobbies', 'Work'],
    nextHabitId: 4,
  }),
  actions: {
    toggleHabitCompletion(habitId) {
      const date = this.selectedDate

      if (!this.completedHabits[date]) {
        this.completedHabits[date] = {}
      }

      if (this.completedHabits[date][habitId]) {
        delete this.completedHabits[date][habitId]
      } else {
        this.completedHabits[date][habitId] = true
      }

      if (Object.keys(this.completedHabits[date]).length === 0) {
        delete this.completedHabits[date]
      }

      localStorage.setItem('completedHabits', JSON.stringify(this.completedHabits))
    },
    addHabit(newHabit) {
      const newId = this.nextHabitId
      this.habits.push({ id: newId, ...newHabit })
      this.nextHabitId += 1
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('nextHabitId', this.nextHabitId.toString())
    },
    removeHabit(habitId) {
      for (const date in this.completedHabits) {
        if (this.completedHabits[date][habitId]) {
          delete this.completedHabits[date][habitId]
        }

        if (Object.keys(this.completedHabits[date]).length === 0) {
          delete this.completedHabits[date]
        }
      }

      this.habits = this.habits.filter((habit) => habit.id !== habitId)
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('completedHabits', JSON.stringify(this.completedHabits))
    },
    addCategory(newCategory) {
      if (!this.categories.includes(newCategory)) {
        this.$patch((state) => {
          state.categories.push(newCategory)
        })
        localStorage.setItem('categories', JSON.stringify(this.categories))
      }
    },
    editCategory(oldCategory, newCategory) {
      const categoryIndex = this.categories.indexOf(oldCategory)
      if (categoryIndex !== -1) {
        this.$patch((state) => {
          state.categories.splice(categoryIndex, 1, newCategory)
          state.habits = state.habits.map((habit) => {
            if (habit.category === oldCategory) {
              return { ...habit, category: newCategory }
            }
            return habit
          })
        })
        localStorage.setItem('habits', JSON.stringify(this.habits))
        localStorage.setItem('categories', JSON.stringify(this.categories))
      }
    },
    deleteCategory(category) {
      this.$patch((state) => {
        state.categories = state.categories.filter((cat) => cat !== category)
        state.habits = state.habits.filter((habit) => habit.category !== category)
      })
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('categories', JSON.stringify(this.categories))
    },
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
    initLocalStorage() {
      this.loadFromLocalStorage()
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
    isHabitCompleted: (state) => (id) => {
      const date = state.selectedDate
      return state.completedHabits[date] && state.completedHabits[date][id]
    },
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
