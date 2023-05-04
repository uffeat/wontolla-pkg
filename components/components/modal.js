import { setStyle } from "../../libs/bootstrap/utils/classes.js";

const modal = (content, kwargs = {}) => {
  let {
    animated = true,
    buttons,
    callback,
    dismissible = true,
    headline,
    position,
    size,
  } = kwargs;

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
  const footerElement = component.get(".modal-footer");

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
        parent: footerElement,
      });
      button._value = value;
      style && setStyle(button, "btn", style, false);
      button.onclick = (event) => {
        event.stopPropagation();
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

  return new Promise((resolve, _reject) => {
    component.addEventListener("hidden.bs.modal", (event) => {
      // If modalValue is not undefined, callback has already been invoked in onclick.
      if (callback && modalValue === undefined) callback();
      resolve(modalValue);
      component.remove();
      bsComponent.dispose();
    });
  });
  // NOTE If modal is called without 'await', callback still works.
};

export { modal };
