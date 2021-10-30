import { providerFactory } from 'mint-choco';

const state = {
  /** @type {number} */
  count: 0
};
const getters = {
  /** @return {number} */
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




