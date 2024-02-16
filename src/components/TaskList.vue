<template>
  <div>  
    <div class="controls">
      <button @click="toggleAddTaskForm">Add New Task</button>
      <input v-model="searchTerm" placeholder="Search tasks" />
      <select v-model="filterStatus">
        <option value="">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </div>
    <h2>Task List</h2>
    <div v-if="filteredTasks.length === 0 && searchTerm !== ''" class="no-tasks-found">
    <p>No tasks found for "{{ searchTerm }}".</p>
    </div>
    <table class="task-list" :key="tasksKey" v-if="filteredTasks.length > 0">
      <thead>
        <tr><th @click="sortTasks('title')">
      Title
      <span v-if="sortColumn === 'title'">
        <i data-feather="chevron-up" v-if="sortOrder === 'asc'"></i>
        <i data-feather="chevron-down" v-if="sortOrder === 'desc'"></i>
      </span>
    </th>
    <th @click="sortTasks('description')">
      Description
      <span v-if="sortColumn === 'description'">
        <i data-feather="chevron-up" v-if="sortOrder === 'asc'"></i>
        <i data-feather="chevron-down" v-if="sortOrder === 'desc'"></i>
      </span>
    </th>
    <th @click="sortTasks('dueDate')">
      Due Date
      <span v-if="sortColumn === 'dueDate'">
        <i data-feather="chevron-up" v-if="sortOrder === 'asc'"></i>
        <i data-feather="chevron-down" v-if="sortOrder === 'desc'"></i>
      </span>
    </th>
    <th @click="sortTasks('completed')">
      Completed
      <span v-if="sortColumn === 'completed'">
        <i data-feather="chevron-up" v-if="sortOrder === 'asc'"></i>
        <i data-feather="chevron-down" v-if="sortOrder === 'desc'"></i>
      </span>
    </th>
    <th>Actions</th>
  </tr>
      </thead>
      <tbody>
        <tr v-for="task in paginatedTasks" :key="task.id" class="task-item">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ new Date(task.dueDate).toLocaleDateString() }}</td>
          <td>{{ task.completed ? 'Yes' : 'No' }}</td>
          <td>
            <button class="edit" @click="startEditing(task.id)">Edit</button>
            <button @click="deleteTask(task.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
     <!-- Pagination Controls -->
    <div class="pagination" v-if="filteredTasks.length > 0">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
    <div v-if="showEditTaskForm" class="modal-overlay">
      <div class="modal">
        <form @submit.prevent="saveEditedTask">
          <h2>Edit Task</h2>
          <label for="editedTitle">Title:</label>
          <input type="text" v-model="editedTask.title" required />
          <label for="editedDescription">Description:</label>
          <textarea v-model="editedTask.description"></textarea>
          <label for="editedDueDate">Due Date:</label>
          <input type="date" v-model="editedTask.dueDate" />
          <label for="completed">Completed:</label>
          <input type="checkbox" v-model="editedTask.completed" />
          <button type="submit">Save Changes</button>
          <button type="button" @click="cancelEditing">Cancel</button>
        </form>
      </div>
    </div>

    <!-- Form to add a new task as a modal -->
    <div v-else-if="showAddTaskForm" class="modal-overlay">
      <div class="modal">
        <form @submit.prevent="addTask">
          <h2>Add New Task</h2>
          <label for="title">Title:</label>
          <input type="text" v-model="newTask.title" required />
          <label for="description">Description:</label>
          <textarea v-model="newTask.description"></textarea>
          <label for="dueDate">Due Date:</label>
          <input type="date" v-model="newTask.dueDate" />
          <label for="completed">Completed:</label>
          <input type="checkbox" v-model="newTask.completed" />
          <button type="submit">Add Task</button>
          <button type="button" @click="toggleAddTaskForm">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>


<!-- Rest of the script and style sections remain unchanged -->


<script>
import authService from '@/services/authService';
import axios from 'axios';
import TaskList from '@/components/TaskList.vue'; 

export default {
  data() {
    return {
      tasks: [],
      tasksKey: 0,
      authService,
      newTask: {
        title: '',
        description: '',
        dueDate: '',
        completed: false,
      },
      searchTerm: '',
      filterStatus: '',
      editingTaskId: null,
      editedTask: {
        title: '',
        description: '',
        dueDate: '',
        completed: false,
      },
      showAddTaskForm: false,
      showEditTaskForm: false,
      sortColumn: null,
      sortOrder: 'asc',
      itemsPerPage: 5,
      currentPage: 1,
    };
  },
  methods: {
    fetchTasks() {
      const apiUrl = 'https://localhost:44323/api/Task';

      axios.get(apiUrl)
        .then(response => {
          this.tasks = response.data;
        })
        .catch(error => {
          console.error('Error fetching tasks:', error);
        });
    },

    sortTasks(column) {
  if (this.sortColumn === column) {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortOrder = 'asc';
  }

  this.tasks.sort((a, b) => {
    const aValue = column === 'completed' ? (a[column] ? 1 : 0) : a[column];
    const bValue = column === 'completed' ? (b[column] ? 1 : 0) : b[column];

    if (this.sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
},

    
    addTask() {
      const apiUrl = 'https://localhost:44323/api/Task';

      axios.post(apiUrl, this.newTask)
        .then(response => {
          this.tasks.push(response.data);
          this.resetNewTask();
          this.toggleAddTaskForm(); // Close the popup
        })
        .catch(error => {
          console.error('Error adding task:', error);
        });
    },
    toggleAddTaskForm() {
      this.showAddTaskForm = !this.showAddTaskForm;
    },
    toggleEditTaskForm() {
      this.showEditTaskForm = !this.showEditTaskForm;
    },
    resetNewTask() {
      this.newTask = {
        title: '',
        description: '',
        dueDate: '',
        completed: false,
      };
    },
    editTask(id) {
      this.startEditing(id);
    },
    deleteTask(id) {
      const confirmed = window.confirm("Are you sure you want to delete this task?");
    
    if (!confirmed) {
      return; // Do nothing if the user cancels the operation
    }
      const apiUrl = `https://localhost:44323/api/Task/${id}`;

      axios.delete(apiUrl)
        .then(() => {
          this.tasks = this.tasks.filter(task => task.id !== id);
        })
        .catch(error => {
          console.error('Error deleting task:', error);
        });
    },
    completeTask(id) {
      const apiUrl = `https://localhost:44323/api/Task/${id}/complete`;

      axios.patch(apiUrl)
        .then(() => {
          const taskIndex = this.tasks.findIndex(task => task.id === id);
          this.$set(this.tasks, taskIndex, { ...this.tasks[taskIndex], completed: true });
        })
        .catch(error => {
          console.error('Error completing task:', error);
        });
    },
    incompleteTask(id) {
      const apiUrl = `https://localhost:44323/api/Task/${id}/incomplete`;

      axios.patch(apiUrl)
        .then(() => {
          const taskIndex = this.tasks.findIndex(task => task.id === id);
          this.$set(this.tasks, taskIndex, { ...this.tasks[taskIndex], completed: false });
        })
        .catch(error => {
          console.error('Error marking task incomplete:', error);
        });
    },
    
    startEditing(id) {
      this.editingTaskId = id;
      const taskToEdit = this.tasks.find(task => task.id === id);
      this.editedTask = { ...taskToEdit };
      this.showEditTaskForm = true;
    },
    saveEditedTask() {
    const apiUrl = `https://localhost:44323/api/Task/${this.editingTaskId}`;

   axios.put(apiUrl, this.editedTask)
    .then(() => {
      const taskIndex = this.tasks.findIndex(task => task.id === this.editingTaskId);
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = { ...this.editedTask };
      }
      this.cancelEditing();
      this.tasksKey++;
      // Fetch updated tasks after saving changes
      this.fetchTasks();
    })
    .catch(error => {
      console.error('Error editing task:', error);
    })
    .finally(() => {
      this.showEditTaskForm = false; // Explicitly close the edit modal
    });
    },

    cancelEditing() {
      this.editingTaskId = null;
      this.editedTask = { title: '', description: '', dueDate: '' ,completed: false,};
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
   },
   computed: {
    filteredTasks() {
      let filteredTasks = [...this.tasks];

      if (this.searchTerm) {
        const searchTermLower = this.searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(searchTermLower) ||
          task.description.toLowerCase().includes(searchTermLower)
        );
      }

      if (this.filterStatus) {
        filteredTasks = filteredTasks.filter(task =>
          (this.filterStatus === 'completed' && task.completed) ||
          (this.filterStatus === 'incomplete' && !task.completed)
        );
      }

      return filteredTasks;
    },
    paginatedTasks() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredTasks.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.filteredTasks.length / this.itemsPerPage);
    },
   },
   mounted() {
    this.fetchTasks();
    feather.replace();
  },
};
</script>

<style scoped>

/* Table Styel */
.task-list {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.task-list th, .task-list td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.task-list th {
  background-color: #f2f2f2;
}

.task-item {
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Adjusted styles for better width and alignment */
.task-list td {
  max-width: 200px; /* Adjust the maximum width as needed */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Pagination Controls */
.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination button {
  padding: 8px 12px;
  cursor: pointer;
}

.pagination button:disabled {
  color: #999;
  cursor: not-allowed;
}



/* pop up */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 300px; /* Adjust the width as needed */
  height: 75%; /* Adjust the height as needed */
  z-index: 999; /* Ensure the modal appears above the overlay */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Header styling with dark yellow background */
.modal h2 {
  background-color: darkgoldenrod;
  color: white;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  text-align: center; /* Center-align the text */
}

/* Add space between input fields */
.modal label {
  margin-bottom: 8px;
}

/* Center-align text in input fields */
.modal input,
.modal textarea,
.modal select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  margin-bottom: 10px;
}

/* Button styling for Cancel and Save */
.modal button {
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
}

.modal button.cancel {
  background-color: blue;
  color: white;
}

.modal button.save {
  background-color: yellow;
  color: black;
}

/* Updated styles for the controls */
.controls {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.controls button {
  padding: 10px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: green;
  color: white;
  margin-right: 10px;
}

.controls input {
  padding: 8px;
  box-sizing: border-box;
  margin-right: 10px;
}

.controls select {
  padding: 8px;
  box-sizing: border-box;
}

/* Add styles for "No tasks found" message */
.no-tasks-found {
  position: fixed;
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%);
  background-color: #526d9d4a;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-weight: bold;
}


</style>



