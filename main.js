// Expand global namespace and enhance prototypes
import * as _upgrade from "./upgrade.js";
// Build ui frame
import * as _app from "./app.js";
// Init routes and router
import * as _routes from "./router/routes.js";

import { modal } from "./components/components/modal.js";

const call = async (name, kwargs, callback) => {
  const request = new Request(
    `https://wontolla-client.anvil.app/_/api/call/${name}`,
    {
      method: "POST",
      body: JSON.stringify(kwargs),
    }
  );

  const response = await fetch(request);
  //console.log(response);

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
};

const result = await call("test", {'email':"uffeat@gmail.com"});
console.log(`Result: ${JSON.stringify(result)}`);

call("test", {'email':"uffeat@gmail.com"}, (result) =>
  console.log(`Callback got result: ${JSON.stringify(result)}`)
);

/*

//const result = await modal('called with await', {buttons: [['OK', true]]})
//console.log(`Result: ${result}`)

const content = createElement("div", {
  innerHTML: `
<input type=checkbox />
`,
});
const checkbox = content.get("input");
const callback = (modalValue) => {
  console.log(`Callback got modal value: ${modalValue}`);
  if (checkbox.checked) return true;
};

const result = await modal(content, {
  buttons: [
    ["Yes", true],
    ["No", false],
    ["42", 42],
  ],
  callback,
  dismissible: false,
  //headline: 'Modal mojo',
  //position: 'sb',
  size: "lg",
});
console.log(`Result: ${result}`);
//console.log(`HERE`)

//modal(content, {buttons: [['Yes', true], ['No', false]], callback, promise: false})

*/

/*
const content = createElement('div', {innerHTML: `
<input type=checkbox />
`})
const checkbox = content.get('input')

content.addEventListener('x-modal-hide-request', (event) => {
  console.log(`Modal wants to close with value: ${event.detail}`)
})
modal(content, {buttons: [['OK', true]]})
*/
