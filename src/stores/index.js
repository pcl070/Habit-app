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

      // Initialize the date if it doesn’t exist
      if (!this.completedHabits[date]) {
        this.completedHabits[date] = {}
      }

      // Toggle the completion state
      if (this.completedHabits[date][habitId]) {
        // If the habit is already marked complete, uncheck it
        delete this.completedHabits[date][habitId]
      } else {
        // Mark the habit as complete
        this.completedHabits[date][habitId] = true
      }

      // Clean up empty dates to prevent stale data
      if (Object.keys(this.completedHabits[date]).length === 0) {
        delete this.completedHabits[date]
      }

      // Update local storage to sync changes
      localStorage.setItem('completedHabits', JSON.stringify(this.completedHabits))
    },
    addHabit(newHabit) {
      const newId = this.nextHabitId
      this.habits.push({ id: newId, ...newHabit })
      this.nextHabitId += 1
    },
    removeHabit(habitId) {
      console.log(`Deleting habit with ID: ${habitId}`)

      // Remove the habit from all dates in completedHabits
      for (const date in this.completedHabits) {
        if (this.completedHabits[date][habitId]) {
          console.log(`Removing completed entry for habit ${habitId} on date ${date}`)
          delete this.completedHabits[date][habitId]
        }

        // Remove the date if no habits are completed on that date
        if (Object.keys(this.completedHabits[date]).length === 0) {
          console.log(`Deleting empty date entry for ${date}`)
          delete this.completedHabits[date]
        }
      }

      // Remove the habit itself from the habits array
      this.habits = this.habits.filter((habit) => habit.id !== habitId)

      // Sync data to localStorage
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('completedHabits', JSON.stringify(this.completedHabits))
      localStorage.setItem('nextHabitId', this.nextHabitId.toString())
    },
    loadFromLocalStorage() {
      const habits = localStorage.getItem('habits')
      const completedHabits = localStorage.getItem('completedHabits')
      const nextHabitId = localStorage.getItem('nextHabitId')
      if (habits) this.habits = JSON.parse(habits)
      if (completedHabits) this.completedHabits = JSON.parse(completedHabits)
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
        () => this.nextHabitId,
        (newNextHabitId) => {
          localStorage.setItem('nextHabitId', newNextHabitId.toString())
        },
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
