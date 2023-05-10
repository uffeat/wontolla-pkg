class Rpc {
  #base;
  constructor(base) {
    this.#base = base;
  }

  async call(name, kwargs, callback) {
    const request = new Request(`https://${this.#base}/${name}`, {
      method: "POST",
      body: JSON.stringify(kwargs),
    });

    const response = await fetch(request);

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");

      if (contentType.includes("application/json")) {
        const result = await response.json();
        callback && callback(result);
        return result;
      } else if (contentType.includes("text/plain")) {
        const result = await response.text();

        try {
          const resultJson = JSON.parse(result);
          callback && callback(resultJson);
          return resultJson;
        } catch {
          callback && callback(result);
          return result;
        }
      }
    }
  }
}

export { Rpc };
