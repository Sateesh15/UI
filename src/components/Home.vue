<template>
  <div>
    <h1>Hello from Home.vue</h1>
    <div>
    <i data-feather="heart"></i>
  </div>
  </div>
</template>

<script>
export default {
  mounted() {
    // Initialize Feather Icons after your component has mounted
    feather.replace();
  },
};
</script>

<style>
/* Your style code goes here */
</style>
