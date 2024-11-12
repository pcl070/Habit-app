<template>
  <div class="habit-item">
    <!-- Left-aligned content wrapper -->
    <div class="habit-content">
      <!-- Custom Checkbox Wrapper -->
      <div class="checkbox-wrapper">
        <input
          type="checkbox"
          class="check"
          :checked="isCompleted"
          @change="toggleCompletion"
          :id="`habit-${habit.id}`"
        />
        <label :for="`habit-${habit.id}`" class="label">
          <svg width="45" height="45" viewBox="0 0 95 95">
            <rect x="30" y="20" width="50" height="50" fill="none"></rect>
            <g transform="translate(0,-952.36222)">
              <path
                d="m 56,963 c -102,122 6,9 7,9 17,-5 -66,69 -38,52 122,-77 -7,14 18,4 29,-11 45,-43 23,-4"
                stroke="var(--delete-button-color)"
                stroke-width="3"
                fill="none"
                class="path1"
              ></path>
            </g>
          </svg>
          <span>{{ habit.name }}</span>
        </label>
      </div>

      <!-- Streak Display -->
      <span v-if="streak > 2" class="streak">🔥 {{ streak }} days</span>
    </div>

    <!-- Delete Button aligned to the right -->
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
      this.$emit('delete-habit', this.habit.id)
    },
  },
}
</script>

<style scoped>
.habit-item {
  display: flex;
  justify-content: space-between; /* Push delete button to right */
  align-items: center;
  padding: 10px;
}

.habit-content {
  display: flex;
  align-items: center;
  gap: 10px; /* Space between elements on the left side */
}

.checkbox-wrapper input[type='checkbox'] {
  visibility: hidden;
  display: none;
}

.checkbox-wrapper * {
  box-sizing: border-box;
  user-select: none;
}

.checkbox-wrapper {
  position: relative;
  display: block;
  overflow: hidden;
}

.checkbox-wrapper .label {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px; /* Space between checkbox and label text */
}

.checkbox-wrapper .check {
  width: 50px;
  height: 50px;
  position: absolute;
  opacity: 0;
}

.checkbox-wrapper .label svg {
  vertical-align: middle;
  stroke: var(--delete-button-color);
}

.checkbox-wrapper .path1 {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  transition: 0.5s stroke-dashoffset;
  opacity: 0;
}

.checkbox-wrapper .check:checked + label svg g path {
  stroke-dashoffset: 0;
  opacity: 1;
}

.streak {
  color: #5aa55e;
  font-weight: bold;
}

/* Delete button styles */
.btn {
  background-color: transparent;
  position: relative;
  border: none;
  cursor: pointer;
  box-shadow: none;
  padding: 0;
  margin-right: 8px;
  fill: var(--delete-button-color);
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
