<template>
  <button @click="logout">Logout</button>
</template>

<script>
import authService from '@/services/authService';

export default {
  methods: {
    logout() {
      authService.logout();
      // Redirect to the login page upon logout
      this.$router.push({ name: 'Login' });
    },
  },
};
</script>
