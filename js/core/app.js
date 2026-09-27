window.WellBalance = {
  initializers: [],

  register(name, initialize) {
    this[name] = initialize;
    this.initializers.push({ name, initialize });
  },

  start() {
    this.initializers.forEach(({ name, initialize }) => {
      try {
        initialize();
      } catch (error) {
        console.error(`[WellBalance] ${name} failed to initialize.`, error);
      }
    });
  },
};
