// Expand global namespace and enhance prototypes
import * as _upgrade from "./upgrade.js";
// Build ui frame
import * as _app from "./app.js";
// Init routes and router
import * as _routes from "./router/routes.js";

let storedValue


const getValue = () => {
  return storedValue
}

const setValue = (value) => {
  storedValue = value
  console.log(`Value set: ${storedValue}. Type: ${typeof storedValue}`)
}



export {getValue, setValue}