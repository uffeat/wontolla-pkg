import { config } from "./config.js";

class Py {
  constructor() {}

  call(name, detail = {}) {
    const eventName = `x-py-${name}`;
    detail.response = {success: null, data: null, msg: null}
    let event = window.sendEvent(eventName, detail);
    return event.detail.response;
  }
}

const py = new Py();

// Dummy for dev
if (config.dev) {
  console.log("DEV MODE");

  window.addEventListener("x-py-login", (event) => {
    console.log(`x-py-login handler running`);
    const email = event.detail.email;
    //console.log(email)
    const password = event.detail.password;
    //console.log(password)
    if (email !== "w@w" || password !== "w") {
      event.detail.response.success = false
      event.detail.response.msg = "Oh, no!!!"
    } else {
      event.detail.response.success = true
      event.detail.response.msg = "All good."
    }
  });

  window.addEventListener("x-py-logout", (event) => {
    console.log(`x-py-logout handler running`);
  });
}

export { py };
