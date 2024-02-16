import { createRouter, createWebHistory } from 'vue-router';
import TaskList from '@/views/TaskList.vue';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'TaskList',
    component: TaskList,
    meta: { requiresAuth: true }, // Add this meta field for routes that require authentication
  },
  // Add more routes if needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check if the user is authenticated before accessing the route
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if the user is authenticated
    if (!store.state.isAuthenticated) {
      // If not authenticated, redirect to login or show a message
      next('/login'); // You can replace '/login' with the path to your login route
    } else {
      // If authenticated, proceed to the route
      next();
    }
  } else {
    // If the route doesn't require authentication, proceed as usual
    next();
  }
});

export default router;
