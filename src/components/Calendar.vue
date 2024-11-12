<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="previousMonth">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="var(--button-text-color)"
        >
          <path
            d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"
          />
        </svg>
      </button>
      <h2>{{ monthYear }}</h2>
      <button @click="nextMonth">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="var(--button-text-color)"
        >
          <path
            d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z"
          />
        </svg>
      </button>
    </div>
    <div class="calendar-grid">
      <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
      <div
        v-for="day in daysInMonth"
        :key="day.format('YYYY-MM-DD')"
        :class="[
          'calendar-day',
          { 'disabled-day': isFutureDay(day), 'selected-day': isSelectedDay(day) },
        ]"
        @click="!isFutureDay(day) && goToDay(day)"
      >
        <div class="progress-circle" :style="getProgressStyle(day)">
          <span>{{ day.date() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useHabitStore } from '../stores'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const habitStore = useHabitStore()
    const router = useRouter()
    const route = useRoute()
    const today = dayjs().startOf('day')

    // Track the currently selected date
    const selectedDate = ref(today.format('YYYY-MM-DD'))

    // Initialize `currentMonth` to match the selected date if available, or fallback to today's month
    const currentMonth = ref(dayjs(route.params.date || today).startOf('month'))

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const daysInMonth = computed(() => {
      const startOfMonth = currentMonth.value.startOf('month').startOf('week')
      const endOfMonth = currentMonth.value.endOf('month').endOf('week')
      const days = []

      for (let day = startOfMonth; day.isBefore(endOfMonth); day = day.add(1, 'day')) {
        days.push(day)
      }
      return days
    })

    const monthYear = computed(() => currentMonth.value.format('MMMM YYYY'))

    const goToDay = (day) => {
      const formattedDate = day.format('YYYY-MM-DD')
      selectedDate.value = formattedDate
      router.push({ name: 'day', params: { date: formattedDate } })
    }

    const previousMonth = () => {
      currentMonth.value = currentMonth.value.subtract(1, 'month')
    }

    const nextMonth = () => {
      currentMonth.value = currentMonth.value.add(1, 'month')
    }

    const isFutureDay = (day) => {
      return day.isAfter(today)
    }

    const isSelectedDay = (day) => {
      return day.format('YYYY-MM-DD') === selectedDate.value
    }

    const getProgressStyle = (day) => {
      const date = day.format('YYYY-MM-DD')
      const totalHabits = habitStore.habits.length

      const completedHabits = habitStore.completedHabits[date]
        ? Object.keys(habitStore.completedHabits[date]).filter((habitId) =>
            habitStore.habits.some((habit) => habit.id === parseInt(habitId)),
          ).length
        : 0

      const progressPercentage = totalHabits ? (completedHabits / totalHabits) * 100 : 0

      return {
        background: `conic-gradient(#6E659C ${progressPercentage}%, #e0e0e0 ${progressPercentage}%)`,
        borderRadius: '50%',
        opacity: isFutureDay(day) ? 0.3 : 1,
      }
    }

    // Watch for changes in the route parameter `date` to update `selectedDate` and `currentMonth`
    watch(
      () => route.params.date,
      (newDate) => {
        if (newDate) {
          selectedDate.value = newDate
          currentMonth.value = dayjs(newDate).startOf('month')
        }
      },
      { immediate: true },
    )

    return {
      daysInMonth,
      monthYear,
      weekdays,
      goToDay,
      previousMonth,
      nextMonth,
      isFutureDay,
      isSelectedDay,
      getProgressStyle,
    }
  },
}
</script>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background: rgb(65, 59, 97);
  background: var(--light-elements-color);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #212121;
  box-shadow: #212121 5px 2px 10px;
}
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;
}
.calendar-header button {
  border: 2 px solid #212121;
  padding: 10px;
  border-radius: 15px;
  box-shadow: #212121 2px 2px 5px;
  transition: ease 0.1s;
}
.calendar-header button:hover {
  cursor: pointer;
  padding: 8px;
  margin: 0 2px;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  width: 100%;
}
.weekday {
  text-align: center;
  font-weight: bold;
  padding: 5px 0;
}
.calendar-day {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
}
.disabled-day {
  pointer-events: none;
  opacity: 0.5;
}
.progress-circle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  background: #e0e0e0;
  border-radius: 50%;
  font-size: 14px;

  /* Add transition for background change */
  transition: background 0.3s ease; /* This line animates the progress */
}
.progress-circle span {
  position: relative;
  z-index: 1;
}

/* Add style for the selected day with an inner border effect */
.selected-day .progress-circle {
  transition: 0.3s;
  box-shadow: inset 0 0 0 2px rgb(125, 125, 228); /* Creates an inner blue border */
}

/*Mobile display styles*/

@media (max-width: 700px) {
  .calendar {
    padding: 20px 0;
  }
  .calendar-header button {
    margin: 0 5px;
  }
}
</style>
