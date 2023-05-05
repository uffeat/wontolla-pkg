import { setStyle } from "../../libs/bootstrap/utils/classes.js";

const modal = (content, kwargs = {}) => {
  let {
    animated = true,
    buttons,
    callback,
    dismissible = true,
    headline,
    position,
    promise = true,
    size,
  } = checkKwargs(
    kwargs,
    "animated",
    "buttons",
    "callback",
    "callback",
    "dismissible",
    "headline",
    "position",
    "promise",
    "size"
  );
  // 'promise' flag only relevant for use in Anvil

  const component = createElement(`div.modal${animated ? ".fade" : ""}`, {
    innerHTML: getHtml("components/modal"),
    parent: document.body,
  });
  component.setAttribute("tabindex", "-1");
  let modalValue;

  // Get subs
  const dialogElement = component.get(".modal-dialog");
  const headerElement = component.get(".modal-header");
  const headlineElement = component.get(".modal-title");
  const dismissButton = component.get(".btn-close");
  const bodyElement = component.get(".modal-body");
  // Enable easy access to buttons from content (e.g., content.modalParent.footerElement.get('button[value=true]'))
  component.footerElement = component.get(".modal-footer");
  
  if (!buttons) component.footerElement.classList.add('border', 'border-top-0')

  if (!dismissible && !headline) headerElement.classList.add('border', 'border-bottom-0')

  // Set dismissible. Must be done before creation of Bootstrap component.
  if (dismissible) {
    component.removeAttribute("data-bs-backdrop");
  } else {
    component.dataset.bsBackdrop = "static";
    dismissButton.hide();
  }

  const bsComponent = new bootstrap.Modal(component);

  // Set content
  if (typeof content === "string")
    content = createElement("p", { text: content });
  bodyElement.append(content);
  // Provide access to close modal from content:
  component.addEventListener("x-close-modal", (event) => {
    modalValue = event.detail;
    bsComponent.hide();
  });
  // Provide general access to modal elements from content
  content.modalParent = component;

  // Set buttons
  if (buttons) {
    for (let b of buttons) {
      const [text, value, style] = b;
      if (value === undefined)
        throw `The value 'undefined' is reserved for modal dismissal.`;
      const button = createElement(`button.btn`, {
        text,
        value,
        parent: component.footerElement,
      });
      // Preserve non-text type-casted value
      // Text-type-casted value was added as button prop for identification purposes.
      button._value = value;
      style && setStyle(button, "btn", style, false);
      button.onclick = (event) => {
        event.stopPropagation();
        // Use '_value' to get non-text type-casted value
        modalValue = button._value;
        // Abort hide if callback returns falsy
        if (callback && !callback(modalValue)) {
          // Reset modalValue; modal may subsequently be closed by backdrop or dismiss button
          // click, which should result in a modalValue of 'undefined'.
          modalValue = undefined;
          return;
        }
        bsComponent.hide();
      };
    }
  }

  // Set headline
  headlineElement.text = headline || "";

  // Set position
  // Transform alias
  if (position === "center") position = "modal-dialog-centered";
  // Validate
  if (!["modal-dialog-centered", "sb", undefined].includes(position))
    throw `Invalid position: ${position}`;
  // Add position-controlling class
  if (position) dialogElement.classList.add(position);
  // undefined position -> Bootstrap default used.

  // Set size
  // Transform alias
  if (size === "full") size = "fullscreen";
  // Validate
  if (!["sm", "lg", "xl", "fullscreen", undefined].includes(size))
    throw `Invalid size: ${size}`;
  // Add size-controlling class
  if (size) dialogElement.classList.add(`modal-${size}`);
  // undefined size -> Bootstrap default used.

  bsComponent.show();

  // Only relevant for use in Anvil
  if (!promise) {
    component.addEventListener("hidden.bs.modal", (event) => {
      // If modalValue is not undefined, callback has already been invoked in onclick.
      if (callback && modalValue === undefined) callback();
      component.remove();
      bsComponent.dispose();
    });
    return;
  }

  return new Promise((resolve, _reject) => {
    component.addEventListener("hidden.bs.modal", (event) => {
      // If modalValue is not undefined, callback has already been invoked in onclick.
      if (callback && modalValue === undefined) callback(modalValue);
      resolve(modalValue);
      component.remove();
      bsComponent.dispose();
    });
  });
  // NOTE If modal is called without 'await', callback still works.
};

export { modal };

/*
NOTES
The 'promise' kwarg is relevant for use in Anvil only. Anvil blocks promise returns.
In JS, blocking/non-blockin behaviour can be controlled with 'async' call of modal.

The 'callback' func kwargs can serve two purposes:
1. Process modalValue when modal used non-blocking.
2. Control modal behaviour when a modal button is clicked.
   Callback funcs should take a single 'value' arg and return a truthy/falsy value.
   If a callback has been set, the callback is invoked at modal button click,
   with the modalValue passed into it. The modal only proceeds to closing
   if the callback returns a truthy value. In this way, modal content can control
   conditional closing of the modal.

Re dismissible modals:
  Backdrop or dismiss button click results in 'undefined' modalValue.
  While this value is passed into any callback, backdrop and dismiss button clicks
  escape any modal-controlling of the a callback (#2 above). Hence, if a callback
  should tightly contol modal closing, do not make the modal dismissible.
*/
