import { config } from "./config.js";


// make async (await callback)

const run = (name, callback, ...args) => {
  const event = window.sendEvent("x-py", {
    name: name,
    callback: callback,
    args: args,
  });
  return event.func
};

export {run}