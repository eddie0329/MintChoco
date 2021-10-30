<img src="./images/logo.png" width="100" height="100">

## 🤔 What is MintChoco?

MintChoco is new Vue state management system inspired by `React context api and reducer patterns`.

## 💡 Example

See more detail in [here](https://github.com/eddie0329/MintChoco/tree/master/packages/example)


First of all, need to define context with providerFactory like below.

```javascript
// provider/counter.provider.js file
import { providerFactory } from 'mint-choco';

const state = {
  count: 0
};
const getters = {
  double: state => state.count * 2
};
const mutations = {
  increment(state, payload) {
    state.count += payload;
  },
  decrement(state, payload) {
    state.count -= payload;
  }
};

const {
  ContextProvider,
  mapContextMutations,
  mapContextGetters,
  mapContextState
} = providerFactory({
  name: 'CounterProvider',
  state,
  getters,
  mutations
});

export {
  ContextProvider,
  mapContextMutations,
  mapContextGetters,
  mapContextState
};
```

FurtherMore, need to register context provider.

```javascript
<template>
  <context-provider>
    <Child1>
      <Child2>
        <Child3/>
      </Child2>
    </Child1>
  </context-provider>
</template>

<script>
import { ContextProvider } from './provider/count.provider';

export default {
  components: { ContextProvider }
}
</scirpt>
```

At Last, simple use values with mapper

```javascript
// Child3
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
    mapContextState(['count']), // can also be like -> mapContextState({ count: count }) 
    mapContextGetters({ double: 'double' }), // can also be like -> mapContextGetters(['double'])
    mapContextMutations({ inc: 'increment', dec: 'decrement' }) // can also be like -> mapContextMutations(['increment', 'decrement'])
  ]
};
</script>
```

## 📝 Todos:

- Need description with js doc
