import { modal } from "../components/components/modal.js";


const component = createElement('div.row.modal-page', {}, createElement('h2', {text: 'Modal'}))


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

//modal(content, {buttons: [['Yes', true], ['No', false]], callback, promise: false})





export {component}