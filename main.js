// Expand global namespace and enhance prototypes
import * as _upgrade from "./upgrade.js";
// Build ui frame
//import * as _app from "./app.js";
// Init routes and router
//import * as _routes from "./router/routes.js";
import { run } from "./py.js";

const button = createElement("button", {
  text: "Run Python func",
  parent: document.main,
});

button.onclick = () => {
  run(
    "double",
    (result) => {
      console.log(`JS got result: ${result}`);
    },
    42
  );
};

const button2 = createElement("button", {
  text: "Run Python func 2",
  parent: document.main,
});

button2.onclick = () => {
  const func = run(
    "double",
    () => {
    },
    42
  );
  const result = func(22)
  console.log(`JS got result from func: ${result}`);
};