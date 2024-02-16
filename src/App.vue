<template>
  <div>
    <nav>
      <router-link class ="Tex" to="/">Home</router-link>
      <router-link class ="Tex" to="/tasks">Task List</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  // Your component logic goes here
};
</script>

<style scoped>
/* Scoped styles for the navigation links */
nav {
  background-color: #197aa2;
  padding: 10px;
  height: 50px;
  text-align: end;
}

router-link {
  margin-right: 10px;
  color: white;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
.Tex{
  padding-left: 10px;
  color: white;
  font-weight: bold;
}

</style>
