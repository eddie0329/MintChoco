<template>
  <div>
    <h1>COUNT: {{ count }}</h1>
    <h2>DOUBLE: {{ double }}</h2>
    <button @click="inc(2)">+</button>
    <button @click="dec(2)">-</button>
  </div>
</template>

<script>
import { mapContextState, mapContextGetters, mapContextMutations } from '../provider/count.provider';

export default {
  mixins: [
    mapContextState(['count']),
    mapContextGetters({ double: 'double' }),
    mapContextMutations({ inc: 'increment', dec: 'decrement' })
  ]
};
</script>

<style></style>
