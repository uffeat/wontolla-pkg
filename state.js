
class State {
  #data = {}
  #subscribers = {}
  constructor() {

  }

  addSubscriber(key, func) {
    if (!(key in this.#subscribers)) {
      this.#subscribers[key] = [func]
    }
    if (this.#subscribers[key].includes(func)) {
      throw `Function already a subscriber of '${key}'.`
    }
    this.#subscribers[key].push(func)
  }

  removeSubscriber(key, func) {
    if (!(key in this.#subscribers)) {
      throw `Invalid subscription key '${key}'.`
    }
    if (!this.#subscribers[key].includes(func)) {
      throw `Function is not a subscriber of '${key}'.`
    }
    const index = this.#subscribers.findIndex(subscriber => subscriber === func);
    this.#subscribers.splice(index, 1);
  }

  getValue(key) {
    return this.#data[key];
  }

  removeValue(key) {
    delete this.#data[key];
  }

  setValue(key, value) {
    State.#checkKey(key)
    this.#data[key] = value;
    const selector = `*[${key.toKebab()}-subscriber]`
    document.getAll(selector).forEach(element => {
      const methodName = `render${key.capitalize()}`
      element[methodName] && element[methodName](this.getValue(key))
    })
    if (!(key in this.#subscribers)) {
      return
    }
    this.#subscribers[key].forEach(func => func(this.getValue(key)))
  }

  static #checkKey(key) {
    if (key.includes('-')) {
      throw `Invalid case for key '${key}'.`
    }
  }
}

const state = new State()

export {state}