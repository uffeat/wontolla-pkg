// Expand global namespace and enhance prototypes
import * as _upgrade from "./upgrade.js";
// Build ui frame
//import * as _app from "./app.js";
// Init routes and router
//import * as _routes from "./router/routes.js";

const button = createElement('button', {text: 'Run Python func', parent: document.main})

let storedValue
const getValue = () => {
  return storedValue
}
const setValue = (value) => {
  storedValue = value
  console.log(`Value set: ${storedValue}. Type: ${typeof storedValue}`)
}

const runPy = (name, ...args) => {
  const event = window.sendEvent('run-py', {name: name, args: args})
  return event.result
}

button.onclick = () => {
  const result = runPy('double', 42)
  console.log(`JS got result: ${result}`)
}



export {getValue, setValue}