// main.js or main.ts

import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/components/Home.vue'; // Import the Home component
import TaskList from '@/components/TaskList.vue'; // Import the TaskList component
import '/Users/munna/source/repos/UI/node_modules/feather-icons/dist/icons';
import '/Users/munna/source/repos/UI/node_modules/feather-icons/dist/feather';




const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/tasks', component: TaskList },
    // Add more routes as needed
  ],
});

const app = createApp(App);
app.use(router);

app.mount('#app');
