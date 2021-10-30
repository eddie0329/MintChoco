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

export default createContextProvider;
