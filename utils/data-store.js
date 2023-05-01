class DataStore {
  #store = {};
  constructor() {}

  get(key) {
    return this.#store[key];
  }

  remove(key) {
    delete this.#store[key];
  }

  set(key, value) {
    this.#store[key] = value;
  }

  getKeys() {
    return Object.keys(this.#store)
    
  }
}

export { DataStore };
