// Expand global namespace and enhance prototypes
import * as _upgrade from "./upgrade.js";
// Build ui frame
import * as _app from "./app.js";
// Init routes and router
import * as _routes from "./router/routes.js";

import { modal } from "./components/components/modal.js";

//const result = await modal('called with await', {buttons: [['OK', true]]})
//console.log(`Result: ${result}`)

const content = createElement('div', {innerHTML: `
<input type=checkbox />
`})
const checkbox = content.get('input')
const callback = (modalValue) => {
  console.log(`Callback got modal value: ${modalValue}`)
  if (checkbox.checked) return true
}

const result = await modal(content, {buttons: [['Yes', true], ['No', false]], callback})
console.log(`Result: ${result}`)
//console.log(`HERE`)


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

