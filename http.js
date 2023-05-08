class Http {
  #base;
  constructor(base) {
    this.#base = base;
  }

  async call(name, kwargs, callback) {

    const request = new Request(`https://${this.#base}/_/api/main/${name}`, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(kwargs),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await fetch(request);

    if (response.ok) {
      const result = await response.json();
      callback && callback(result);
      return result;
    }
  }
}

export { Http };
