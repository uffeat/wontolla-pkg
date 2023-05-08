import { genSearchParams } from "./utils/url.js";

class Http {
  #base;
  constructor(base) {
    this.#base = base;
  }

  async call(name, kwargs, callback) {

    const request = new Request(`https://${this.#base}/_/api/main/${name}`, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kwargs),
    });

    const response = await fetch(request);

    if (response.ok) {
      const result = await response.json();
      callback && callback(result);
      return result;
    }
  }

  async get(name, kwargs, callback) {

    console.log(`https://${this.#base}/_/api/get/${name}${genSearchParams(kwargs)}`)

    const request = new Request(`https://${this.#base}/_/api/get/${name}${genSearchParams(kwargs)}`, {
      method: "GET",
      mode: "no-cors",
    });

    const response = await fetch(request);

    console.log(response)

    if (response.ok) {
      const result = await response.json();
      callback && callback(result);
      return result;
    }
  }
}

export { Http };
