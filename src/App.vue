<template>
  <header>
    <!-- Dark Mode Toggle Switch with v-model for reactivity -->
    <label class="switch">
      <input type="checkbox" v-model="darkMode" @change="toggleDarkMode" />
      <span class="slider"></span>
    </label>

    <!-- Reset Data Button -->
    <button @click="confirmResetData" class="reset-button">Reset All Data</button>
  </header>
  <!-- Router View to Display Pages -->
  <router-view />
</template>

<script>
import { ref, onMounted } from 'vue'
import { useHabitStore } from './stores'

export default {
  setup() {
    const habitStore = useHabitStore()
    const darkMode = ref(false)

    // Initialize dark mode based on localStorage value
    onMounted(() => {
      habitStore.initLocalStorage() // Initialize localStorage watchers for habitStore

      const storedMode = localStorage.getItem('darkMode')
      if (storedMode === 'enabled') {
        darkMode.value = true
        document.documentElement.classList.add('dark') // Apply .dark class to html
      }
    })

    // Function to toggle dark mode
    const toggleDarkMode = (event) => {
      darkMode.value = event.target.checked
      if (darkMode.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'enabled')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'disabled')
      }
    }

    // Function to reset all user data with confirmation
    const confirmResetData = () => {
      if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
        resetData()
      }
    }

    // Function to reset data
    const resetData = () => {
      habitStore.$reset() // Reset all data in Pinia store
      localStorage.clear() // Clear all local storage
      document.documentElement.classList.remove('dark') // Remove dark mode class
      darkMode.value = false // Reset dark mode toggle
    }

    return { darkMode, toggleDarkMode, confirmResetData }
  },
}
</script>

<style>
/* Apply CSS variables globally in both light and dark modes */
:root {
  --background-color: linear-gradient(
    18deg,
    rgb(130, 114, 201) 0%,
    rgb(152, 131, 209) 12%,
    rgb(109, 100, 156) 35%,
    rgba(174, 125, 172, 1) 67%,
    rgba(243, 218, 223, 1) 100%,
    rgba(241, 145, 109, 1) 100%
  );
  --text-color: #000;
  --button-bg-color: #f3dadf;
  --button-text-color: #000;
}

html.dark {
  --background-color: #03122f;
  --text-color: #fff;
  --button-bg-color: #19305c;
  --button-text-color: #fff;
}

html.dark .calendar {
  background-color: rgba(3, 18, 47, 1);
  background: rgb(65, 59, 97);
  background: linear-gradient(90deg, rgba(65, 59, 97, 1) 4%, rgba(174, 125, 172, 1) 94%);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #212121;
}

/* Global styles for the app */
body {
  min-height: 100vh;
  margin: 0;
  background: var(--background-color);
  background-repeat: no-repeat;
  color: var(--text-color);
  transition:
    background-color 0.3s,
    color 0.3s;
}
header {
  display: flex;
  direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 50px;
  background-color: #0000002c;
  padding: 0 15px;
}

button,
input,
select {
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
}

/* Styling for the dark mode label and checkbox */
label {
  display: flex;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
}

input[type='checkbox'] {
  margin-right: 10px;
}

.switch {
  display: block;
  --width-of-switch: 3.5em;
  --height-of-switch: 2em;
  /* size of sliding icon -- sun and moon */
  --size-of-icon: 1.4em;
  /* it is like a inline-padding of switch */
  --slider-offset: 0.3em;
  position: relative;
  width: var(--width-of-switch);
  height: var(--height-of-switch);
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f4f4f5;
  transition: 0.4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: '';
  height: var(--size-of-icon, 1.4em);
  width: var(--size-of-icon, 1.4em);
  border-radius: 20px;
  left: var(--slider-offset, 0.3em);
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(40deg, #ff0080, #ff8c00 70%);
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #303136;
}

input:checked + .slider:before {
  left: calc(100% - (var(--size-of-icon, 1.4em) + var(--slider-offset, 0.3em)));
  background: #303136;
  /* change the value of second inset in box-shadow to change the angle and direction of the moon  */
  box-shadow:
    inset -3px -2px 5px -2px #8983f7,
    inset -10px -4px 0 0 #a3dafb;
}

/* Style for the reset button */
.reset-button {
  padding: 4px 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin: 0;
  transition: ease 0.3s;
  max-height: 35px;
}

.reset-button:hover {
  background-color: #e60000;
}
</style>
