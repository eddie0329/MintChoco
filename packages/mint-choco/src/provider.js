import Vue from 'vue';
import { err } from '../utils';
import { mapContextState, mapContextGetters, mapContextMutations } from './mixins';

class Provider {
  #state;
  #mutations;
  #getters;
  /** @type{string} */
  #name;

  constructor() {
    return this;
  }

  get name () {
    return this.#name;
  }

  get state() {
    return this.#state;
  }

  get mutatation() {
    return this.#mutations;
  }

  get getters() {
    return this.#getters;
  }

  get partionsTypeValidator() {
    return {
      data: {
        object: true
      },
      err(providerPartions) {
        err(
          `invalid partions: ${providerPartions} : ${typeof providerPartions}`
        );
      },
      validate(providerPartions) {
        Array.isArray(providerPartions)
          ? this.err(providerPartions)
          : this.data[typeof providerPartions] ?? this.err(providerPartions);
      }
    };
  }

  setName(name) {
    this.#name = name;
    return this;
  }

  setState(state) {
    this.partionsTypeValidator.validate(state);
    this.#state = Vue.observable(state);
    return this;
  }

  setGetters(getters) {
    this.partionsTypeValidator.validate(getters);
    const computed = {};
    Object.entries(getters).forEach(([key, value]) => {
      Object.defineProperty(computed, key, {
        get: () => {
          return value(this.#state, this.#getters);
        },
        enumerable: true
      });
    });
    this.#getters = computed;
    return this;
  }

  setMutations(mutations) {
    this.partionsTypeValidator.validate(mutations);
    this.#mutations = Object.entries(mutations).reduce((acc, [key, value]) => {
      acc[key] = payload => value(this.#state, payload);
      return acc;
    }, {});
    return this;
  }


  build(createContextProvider) {
    return {
      mapContextState,
      mapContextGetters,
      mapContextMutations,
      ContextProvider: createContextProvider({ name: this.#name, state: this.state, mutations: this.#mutations, getters: this.#getters })
    };
  }
}

const createContextProvider = ({ name, state, getters, mutations }) => ({
  name,
  provide() {
    return {
      state,
      mutations,
      getters,
    }
  },
  render(h) {
    return h('div', {}, this.$slots.default);
  }
});

export default ({ name, state, getters, mutations }) => {
  return new Provider()
    .setName(name)
    .setState(state)
    .setMutations(mutations)
    .setGetters(getters)
    .build(createContextProvider);
};
