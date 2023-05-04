const modal = async (content, kwargs = {}) => {
  const {
    animated = true,
    blocking = true,
    buttons,
    callback,
    dismissible = true,
    position,
    title,
    size,
  } = kwargs;

  const component = createElement(
    `div.modal${animated ? '.fade' : ''}`, {innerHTML: getHtml("components/modal"), parent: document.body}
)
component.setAttribute('tabindex', '-1')

const dialog = component.get(".modal-dialog")
const header = component.get(".modal-header")
const headline = component.get(".modal-title")
const dismissButton = component.get(".btn-close")
const body = component.get(".modal-body")
const footer = self._component.get(".modal-footer")

// `dismissible` must be set before creation of Bootstrap component.
if (dismissible) {
  component.removeAttribute("data-bs-backdrop")
  dismissButton._value = None

  dismissButton.onclick = self._button_on_click  //
}
    
else {
  component.dataset.bsBackdrop = "static"
  dismissButton.hide()

}
    
const bsComponent = new bootstrap.Modal(component);



};
