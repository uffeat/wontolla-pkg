class FuncStore {
  #reg = {};
  constructor() {
    this._reg = {};
  }

  add(key, func) {
    if (key in this.#reg) {
      throw `A function is already registered with key: ${key}.`;
    }
    this.#reg[key] = func;
  }

  remove(key) {
    delete this.#reg[key];
  }

  update(key, func) {
    this.#reg[key] = func;
  }

  get(key) {
    return this.#reg[key];
  }

  run(key, ...args) {
    if (!(key in this.#reg)) {
      throw `No function registered with key: ${key}.`;
    }
    return this.#reg[key](...args);
  }

  getKeys() {
    return Object.keys(this.#reg);
  }
}

export { FuncStore };
