<template>
  <div class="edit-categories-page">
    <h2>Edit Categories</h2>
    <div class="frame">
      <!-- Add new category -->
      <div class="add-category-section">
        <input v-model="newCategoryName" placeholder="Enter new category" />
        <button @click="addCategory">Add Category</button>
      </div>

      <!-- List of existing categories with edit and delete options -->
      <ul class="categories-list">
        <li v-for="category in categories" :key="category" class="category-item">
          <!-- Display category name or an input field based on editing state -->
          <div class="category-content">
            <span v-if="editingCategory !== category">{{ category }}</span>
            <input v-if="editingCategory === category" v-model="editedCategoryName" />
          </div>
          <div class="category-buttons">
            <button v-if="editingCategory !== category" @click="startEdit(category)">Edit</button>
            <button
              v-if="editingCategory !== category"
              class="btn"
              @click="deleteCategory(category)"
            >
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
            <button v-if="editingCategory === category" @click="saveCategory(category)">
              Save
            </button>
            <button v-if="editingCategory === category" @click="cancelEdit">Cancel</button>
          </div>
        </li>
      </ul>

      <button @click="goBack" class="back-btn">Back to Homepage</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHabitStore } from '../stores'

export default {
  setup() {
    const router = useRouter()
    const habitStore = useHabitStore()

    const categories = computed(() => habitStore.categories)
    const newCategoryName = ref('')
    const editingCategory = ref(null) // Track the category being edited
    const editedCategoryName = ref('') // Temporary storage for the edited category name

    const addCategory = () => {
      if (newCategoryName.value.trim()) {
        habitStore.addCategory(newCategoryName.value.trim())
        newCategoryName.value = ''
      }
    }

    const startEdit = (category) => {
      editingCategory.value = category
      editedCategoryName.value = category
    }

    const saveCategory = (oldCategory) => {
      if (editedCategoryName.value.trim() && editedCategoryName.value !== oldCategory) {
        habitStore.editCategory(oldCategory, editedCategoryName.value.trim())
      }
      editingCategory.value = null
      editedCategoryName.value = ''
    }

    const cancelEdit = () => {
      editingCategory.value = null
      editedCategoryName.value = ''
    }

    const deleteCategory = (category) => {
      if (
        confirm(
          `Are you sure you want to delete the category "${category}"? This will delete all associated habits.`,
        )
      ) {
        habitStore.deleteCategory(category)
      }
    }

    const goBack = () => {
      router.push({ name: 'Home' })
    }

    return {
      categories,
      newCategoryName,
      addCategory,
      editingCategory,
      editedCategoryName,
      startEdit,
      saveCategory,
      cancelEdit,
      deleteCategory,
      goBack,
    }
  },
}
</script>

<style scoped>
body {
  font-family: Arial, Helvetica, sans-serif;
}
h2 {
  font-family: Arial, Helvetica, sans-serif;
}
.frame {
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

ul {
  min-width: 500px;
}
.edit-categories-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 95vh;
  padding: 20px;
}

.add-category-section {
  margin-bottom: 20px;
}
.add-category-section input {
  padding: 8px;
  border-radius: 15px;
  border: 1px solid;
  border-color: var(--buton-bord-color);
  box-shadow: #212121 2px 2px 5px;
}
.categories-list {
  list-style-type: none;
  padding: 0;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.category-content {
  flex-grow: 1;
  border-bottom: 1px solid;
  border-color: var(--buton-bord-color);
  padding-bottom: 8px;
}
.category-content input {
  border: none;
  background-color: transparent;
  font-size: 17px;
  padding: 0;
}
.category-content input:focus-visible {
  border: none;
  outline: none;
}

.category-buttons {
  display: flex;
}

button {
  border: 1px solid;
  padding: 8px 12px;
  margin: 0 10px;
  border-radius: 15px;
  box-shadow: #212121 2px 2px 5px;
  transition: ease 0.3s;
  border-color: var(--buton-bord-color);
}

button:hover {
  cursor: pointer;
}

/* Delete button styles */
.btn {
  background-color: transparent;
  position: relative;
  border: none;
  cursor: pointer;
  box-shadow: none;
  padding: 0;
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

/* mobile view styles */

@media only screen and (max-width: 800px) {
  .frame {
    padding: 25px 10px;
  }
  .categories-list {
    min-width: 90%;
  }
  .category-item {
    gap: 5px;
  }
}
</style>
