<template>
  <div class="habit-item">
    <input
      type="checkbox"
      :checked="isCompleted"
      @change="toggleCompletion"
      :id="`habit-${habit.id}`"
    />
    <label :for="`habit-${habit.id}`">{{ habit.name }}</label>
    <button class="btn" @click="deleteHabit">
      <svg
        viewBox="0 0 15 17.5"
        height="17.5"
        width="15"
        xmlns="http://www.w3.org/2000/svg"
        class="icon"
      >
        <path
          transform="translate(-2.5 -1.25)"
          d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
          id="Fill"
        ></path>
      </svg>
    </button>
    <span v-if="streak > 2" class="streak">🔥Current streak: {{ streak }} days</span>
  </div>
</template>

<script>
export default {
  props: {
    habit: Object,
    isCompleted: Boolean,
    streak: Number,
  },
  methods: {
    toggleCompletion() {
      this.$emit('toggle-completion', this.habit.id)
    },
    deleteHabit() {
      this.$emit('delete-habit', this.habit.id) // Emit delete event with habit ID
    },
  },
}
</script>

<style scoped>
.habit-item {
  display: flex;
  align-items: center;
  padding: 10px;
}

/* Custom checkbox styles */
input[type='checkbox'] {
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  height: 15px;
  width: 15px;
  outline: none;
  border: 0;
  margin: 0 10px 0 0; /* Adjust margin for spacing */
  cursor: pointer;
  background: var(--background, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle; /* Align with text */
}

.habit-item label {
  color: var(--text, #414856);
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s ease;
  margin-left: 5px; /* Optional: Adjust for more space */
}

/* Optional: Add these to handle specific cases where centering is still off */
.habit-item input[type='checkbox'],
.habit-item label {
  line-height: 1; /* Adjust to normalize alignment */
}

input[type='checkbox']::before,
input[type='checkbox']::after {
  content: '';
  position: absolute;
  height: 2px;
  top: auto;
  background: var(--check, #4f29f0);
  border-radius: 2px;
}

input[type='checkbox']::before {
  width: 0px;
  right: 60%;
  transform-origin: right bottom;
}

input[type='checkbox']::after {
  width: 0px;
  left: 40%;
  transform-origin: left bottom;
}

/* Apply animations for checked state */
input[type='checkbox']:checked::before {
  animation: check-01 0.4s ease forwards;
}

input[type='checkbox']:checked::after {
  animation: check-02 0.4s ease forwards;
}

input[type='checkbox']:checked + label {
  color: var(--disabled, #c3c8de);
  animation: move 0.3s ease 0.1s forwards;
}

input[type='checkbox']:checked + label::before {
  background: var(--disabled, #c3c8de);
  animation: slice 0.4s ease forwards;
}

input[type='checkbox']:checked + label::after {
  animation: firework 0.5s ease forwards 0.1s;
}

.habit-item label {
  color: var(--text, #414856);
  position: relative;
  cursor: pointer;
  display: grid;
  align-items: center;
  transition: color 0.3s ease;
}

.streak {
  margin-left: 10px;
  color: #4caf50;
  font-weight: bold;
}

/* Animations */
@keyframes move {
  50% {
    padding-left: 8px;
    padding-right: 0px;
  }
  100% {
    padding-right: 4px;
  }
}

@keyframes slice {
  0% {
    width: 8px;
  }
  60% {
    width: 100%;
    left: 4px;
  }
  100% {
    width: 100%;
    left: -2px;
  }
}

@keyframes check-01 {
  0% {
    width: 4px;
    top: auto;
    transform: rotate(0);
  }
  50% {
    width: 0px;
    top: auto;
    transform: rotate(0);
  }
  51% {
    width: 0px;
    top: 8px;
    transform: rotate(45deg);
  }
  100% {
    width: 5px;
    top: 8px;
    transform: rotate(45deg);
  }
}

@keyframes check-02 {
  0% {
    width: 4px;
    top: auto;
    transform: rotate(0);
  }
  50% {
    width: 0px;
    top: auto;
    transform: rotate(0);
  }
  51% {
    width: 0px;
    top: 8px;
    transform: rotate(-45deg);
  }
  100% {
    width: 10px;
    top: 8px;
    transform: rotate(-45deg);
  }
}

@keyframes firework {
  0% {
    opacity: 1;
    box-shadow:
      0 0 0 -2px #4f29f0,
      0 0 0 -2px #4f29f0,
      0 0 0 -2px #4f29f0,
      0 0 0 -2px #4f29f0,
      0 0 0 -2px #4f29f0,
      0 0 0 -2px #4f29f0;
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    box-shadow:
      0 -15px 0 0px #4f29f0,
      14px -8px 0 0px #4f29f0,
      14px 8px 0 0px #4f29f0,
      0 15px 0 0px #4f29f0,
      -14px 8px 0 0px #4f29f0,
      -14px -8px 0 0px #4f29f0;
  }
}

/* Delete button styles */
.btn {
  background-color: transparent;
  position: relative;
  border: none;
  cursor: pointer;
}

.btn::after {
  content: 'delete';
  position: absolute;
  top: -130%;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  height: fit-content;
  background-color: rgb(168, 7, 7);
  padding: 4px 8px;
  border-radius: 5px;
  transition: 0.2s linear;
  transition-delay: 0.2s;
  color: white;
  text-transform: uppercase;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
}

.icon {
  transform: scale(1.2);
  transition: 0.2s linear;
}

.btn:hover > .icon {
  transform: scale(1.5);
}

.btn:hover > .icon path {
  fill: rgb(168, 7, 7);
}

.btn:hover::after {
  visibility: visible;
  opacity: 1;
  top: -160%;
}
</style>
