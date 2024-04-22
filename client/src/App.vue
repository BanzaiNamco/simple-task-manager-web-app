<template>
  <TaskManager />
</template>

<script>
import TaskManager from './components/TaskManager.vue';

export default {
  name: 'App',
  components: {
    TaskManager
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color:white;
  margin-top: 60px;
}

body {
  background-color: #282c34;
  color: white;
}
</style>
