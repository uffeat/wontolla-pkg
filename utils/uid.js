class Uid {
  #uids = {};
  constructor() {}

  gen(prefix) {
    if (prefix in this.#uids) {
      this.#uids[prefix]++;
    } else {
      this.#uids[prefix] = 0;
    }
    return `${prefix}${this.#uids[prefix]}`
  }
}

const uid = new Uid()

export {uid}