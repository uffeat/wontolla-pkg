const modal = async (content, kwargs = {}) => {
  let {
    animated = true,
    blocking = true,
    buttonsConfig,
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

  // Get subs
  const dialogElement = component.get(".modal-dialog");
  const headerElement = component.get(".modal-header");
  const headlineElement = component.get(".modal-title");
  const dismissButton = component.get(".btn-close");
  const bodyElement = component.get(".modal-body");
  const footerElement = self._component.get(".modal-footer");

  // Set dismissible. Must be done before creation of Bootstrap component.
  if (dismissible) {
    component.removeAttribute("data-bs-backdrop");
    dismissButton._value = null;
    dismissButton.onclick = onclickButton;
  } else {
    component.dataset.bsBackdrop = "static";
    dismissButton.hide();
  }

  const bsComponent = new bootstrap.Modal(component);

  // Set content
  if (typeof content === "string")
    content = createElement("p", { text: content });

  body.append(self.content);
  // Provide access to modal component from content:
  content.modalParent = component;

  // Set buttons
  if (buttonsConfig) {
    
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
  if (position) dialog.classList.add(position);
  // undefined position -> Bootstrap default used.

  // Set size
  // Transform alias
  if (size === "full") size = "fullscreen";
  // Validate
  if (!["sm", "lg", "xl", "fullscreen", undefined].includes(size))
    throw `Invalid size: ${size}`;
  // Add size-controlling class
  if (size) dialog.classList.add(`modal-${size}`);
  // undefined size -> Bootstrap default used.

  function onclickButton(event) {}
};
