# Habit Tracker App
This project is a Habit Tracker web application built using Vue.js and Pinia (a state management library). The app allows users to add, edit, track, and manage their daily habits with the option to categorize them, mark them as complete, and review habit streaks.

## Features
- Add and Delete Habits: Users can create new habits and delete habits as needed.
- Habit Categories: Organize habits by categories such as "Health," "Hobbies," or custom categories.
- Habit Streaks: Track consecutive days that each habit has been completed.
- Pagination: View habits in a paginated format, enabling easy navigation for large numbers of habits.
- Local Storage Persistence: Data (habits, categories, completed habits, and settings) is saved locally and persists across sessions.
- Dark Mode Toggle: Switch between dark and light modes, with the preference saved locally.
## Tech Stack
- Vue 3: Frontend framework for building user interfaces.
- Pinia: State management for Vue.js.
- Vue Router: Client-side routing.
- Day.js: Date manipulation library used for tracking habit streaks.
## Installation
To run this project locally:

1. Clone this repository:

```
git clone https://github.com/your-username/habit-tracker-app.git
```
2. Navigate to the project folder:

```
cd habit-tracker-app
```
3. Install dependencies:

```
npm install
```
4. Run the app:

```
npm run dev
```

The app should now be running on http://localhost:3000.

## Project Structure
- components: Contains reusable UI components such as HabitItem and Calendar.
- views: Main application views, including the homepage and category editor.
- stores: Contains the Pinia store (useHabitStore) to manage application state.
## Usage
### Adding a New Habit
1. Enter a habit name in the input field (limited to 25 characters).
2. Select a category from the dropdown menu.
3. Click the "Add Habit" button to add the new habit.
### Editing and Deleting Categories
1. Go to the "Edit Categories" section.
2. Click "Edit" next to a category to update its name (limited to 25 characters).
3. Click "Save" to apply changes or "Cancel" to discard.
4. Click "Delete" to remove a category and all associated habits.
### Dark Mode
Click the dark mode toggle switch to switch between light and dark themes. This setting is saved and will persist across sessions.

## State Management
The app uses Pinia for state management. Key states include:

- habits: Array storing the list of habits.
- completedHabits: Object tracking completion status by date for each habit.
- categories: Array of habit categories.
- selectedDate: Date selected for tracking daily habits.
## Data Persistence
The app uses local storage to save user data (habits, categories, dark mode preference, etc.). This allows users to retain their data even after refreshing the page or reopening the app.

## Customization
You can add custom categories and habits as per your needs. Additionally, you can update the styles or modify the Pinia store (useHabitStore) for custom state management logic.

## Contributing
Feel free to fork this project and make your modifications. Contributions are welcome!

1. Fork the repository
2. Create a new branch (git checkout -b feature/your-feature-name)
3. Commit your changes (git commit -m 'Add new feature')
4. Push to the branch (git push origin feature/your-feature-name)
5. Create a Pull Request

## Acknowledgments
- Vue.js for providing an amazing JavaScript framework.
- Pinia for powerful yet simple state management.
- Day.js for lightweight and fast date manipulation.
