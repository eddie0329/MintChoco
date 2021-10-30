<template>
  <div id="app">
    <context-provider>
      <Child1 />
    </context-provider>
  </div>
</template>

<script>
import Child1 from './components/Child1.vue';
import { ContextProvider } from './provider/count.provider';

export default {
  name: 'App',
  components: {
    ContextProvider,
    Child1
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
