<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Minesweeper/>
  </div>
</template>

<script>
import Minesweeper from "@/components/Minesweeper";

export default {
  name: 'App',
  components: {
    Minesweeper,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
}
</style>
