class State {
  #data = {};
  #subscribers = {};
  constructor() {
    window.addEventListener('x-state-get-value', this._onGetValue.bind(this))
    window.addEventListener('x-state-set-value', this._onSetValue.bind(this))
  }

  addSubscriber(key, func) {
    if (!(key in this.#subscribers)) {
      this.#subscribers[key] = [func];
    }
    if (this.#subscribers[key].includes(func)) {
      throw `Function already a subscriber of '${key}'.`;
    }
    this.#subscribers[key].push(func);
  }

  removeSubscriber(key, func) {
    if (!(key in this.#subscribers)) {
      throw `Invalid subscription key '${key}'.`;
    }
    if (!this.#subscribers[key].includes(func)) {
      throw `Function is not a subscriber of '${key}'.`;
    }
    const index = this.#subscribers.findIndex(
      (subscriber) => subscriber === func
    );
    this.#subscribers.splice(index, 1);
  }

  getValue(key) {
    return this.#data[key];
  }

  _onGetValue(event) {
    // Dispatched event detail should be `{'myKey': null}`
    const key = Object.keys(event.detail)[0]
    // "Return" value by updating event detail
    event.detail[key] = this.getValue(key)
  }

  removeValue(key) {
    delete this.#data[key];
  }

  setValue(key, value) {
    //console.log(`setValue got value ${value} for key ${key}`)
    State.#checkKey(key);
    // Update data store
    this.#data[key] = value;

    // Run `renderMyKey(value)` on DOM elements with attr `my-key-subscriber`
    const selector = `*[${key.toKebab()}-subscriber]`;
    document.getAll(selector).forEach((element) => {
      const methodName = `render${key.capitalize()}`;
      element[methodName] && element[methodName](value);
    });

    // Run subscriber callbacks
    if (key in this.#subscribers) {
      this.#subscribers[key].forEach((func) => func(this.getValue(key)));
    }

    // Dispatch event
    let event = window.sendEvent(`x-state-change`, { key: value });
    return event.detail;
  }

  _onSetValue(event) {
    // Dispatched event detail should be `{'myKey': value}`
    const [key, value] = Object.entries(event.detail)[0]
    this.setValue(key, value)
  }

  static #checkKey(key) {
    if (key.includes("-")) {
      throw `Invalid case for key '${key}'.`;
    }
  }
}

const state = new State();

const useState = (name, element, func) => {
  // Add `my-key-subscriber` attr
  element.setAttr(`${name.toKebab()}-subscriber`);
  // Add func as `renderMyKey` method
  const methodName = `render${name.toCamel().capitalize()}`;
  element[methodName] = func;
  // Run `renderMyKey(value)`
  element[methodName](state.getValue(name));
  // NOTE: NOT `func(state.getValue(name))` since func may rely on `this`.

  // Return element for chaining and use as (potentially inline) element constructor
  return element;
};

export { state, useState };
