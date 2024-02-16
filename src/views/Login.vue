<template>
  <form @submit.prevent="login">
    <label for="username">Username:</label>
    <input v-model="username" type="text" required />

    <label for="password">Password:</label>
    <input v-model="password" type="password" required />

    <button type="submit">Login</button>
  </form>
</template>

<script>
import authService from '@/services/authService';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const token = await authService.login(this.username, this.password);
        // Redirect to the protected route (TaskList) upon successful login
        this.$router.push({ name: 'TaskList' });
      } catch (error) {
        console.error('Login failed:', error);
        // Handle login failure (show an error message, etc.)
      }
    },
  },
};
</script>
