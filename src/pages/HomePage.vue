<template>
  <div class="homepage">
    <Calendar />
    <div>
      <div class="habit-list">
        <HabitItem
          v-for="habit in habits"
          :key="habit.id"
          :habit="habit"
          :isCompleted="isHabitCompleted(habit.id)"
          :streak="habitStreak(habit.id)"
          @toggle-completion="toggleHabitCompletion"
          @delete-habit="removeHabit"
        />
      </div>
      <router-link to="/add-habit">
        <button class="icon-btn add-btn">
          <div class="add-icon"></div>
          <div class="btn-txt">Add Habit</div>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHabitStore } from '../stores'
import Calendar from '../components/Calendar.vue'
import HabitItem from '../components/HabitItem.vue'

export default {
  components: { Calendar, HabitItem },
  setup() {
    const habitStore = useHabitStore()
    const route = useRoute()

    const habits = computed(() => habitStore.habits)
    const isHabitCompleted = (id) => habitStore.isHabitCompleted(id)
    const toggleHabitCompletion = (id) => habitStore.toggleHabitCompletion(id)
    const habitStreak = (id) => habitStore.getHabitStreak(id)

    // Define the removeHabit method to remove a habit by its ID
    const removeHabit = (habitId) => {
      // Find the index of the habit to remove
      const habitIndex = habitStore.habits.findIndex((habit) => habit.id === habitId)
      if (habitIndex !== -1) {
        habitStore.habits.splice(habitIndex, 1)
      }
    }
    // Watch for changes in the date parameter
    watch(
      () => route.params.date,
      (newDate) => {
        if (newDate) {
          habitStore.selectedDate = newDate // Update the selected date in the store
        }
      },
      { immediate: true },
    )

    return { habits, isHabitCompleted, toggleHabitCompletion, habitStreak, removeHabit }
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
}
.habit-list {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.navigation-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.navigation-buttons button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
}

/* Add new habit button */

.icon-btn {
  width: 50px;
  height: 50px;
  border: 1px solid #cdcdcd;
  background: var(--button-bg-color);
  border-radius: 25px;
  overflow: hidden;
  position: relative;
  transition: width 0.2s ease-in-out;
  font-weight: 500;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
}

.add-btn:hover {
  width: 120px;
}

.add-btn::before,
.add-btn::after {
  transition:
    width 0.2s ease-in-out,
    border-radius 0.2s ease-in-out;
  content: '';
  position: absolute;
  height: 4px;
  width: 10px;
  top: calc(50% - 2px);
  background: seagreen;
}

.add-btn::after {
  right: 14px;
  overflow: hidden;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn::before {
  left: 14px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.icon-btn:focus {
  outline: none;
}

.btn-txt {
  opacity: 0;
  transition: opacity 0.2s;
}

.add-btn:hover::before,
.add-btn:hover::after {
  width: 4px;
  border-radius: 2px;
}

.add-btn:hover .btn-txt {
  opacity: 1;
}

.add-icon::after,
.add-icon::before {
  transition: all 0.2s ease-in-out;
  content: '';
  position: absolute;
  height: 20px;
  width: 2px;
  top: calc(50% - 10px);
  background: seagreen;
  overflow: hidden;
}

.add-icon::before {
  left: 22px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.add-icon::after {
  right: 22px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.add-btn:hover .add-icon::before {
  left: 15px;
  height: 4px;
  top: calc(50% - 2px);
}

.add-btn:hover .add-icon::after {
  right: 15px;
  height: 4px;
  top: calc(50% - 2px);
}
</style>
