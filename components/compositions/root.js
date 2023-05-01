/** */
const composeRoot = (component, kwargs = {}) => {
  // Create shallow copy of kwargs.
  kwargs = { ...kwargs };
  // Destructure.
  const { cssClasses = [], html, tag = "div" } = kwargs;

  component.root = createElement(`${tag}.root`);
  component.root.classList.add(...cssClasses);

  if (html) {
    component.root.innerHTML = getHtml(html);
  }

  component.addRoot = function () {
    if (!this.contains(this.root)) {
      this.append(this.root);
    }
  };
}

export { composeRoot };
