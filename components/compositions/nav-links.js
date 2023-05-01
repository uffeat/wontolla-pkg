/** Management of nav links (primarily for use in nav component).  */
class NavLinks {
  #component;
  /** Init `component`. */
  constructor(component) {
    this.#component = component;
  }

  /** Returns name of active link. */
  get active() {
    const activeLink = this.#component.get("a.active");
    if (!activeLink) return;
    return activeLink.name;
  }

  /** Sets active link by name and processes active link if component has a 
   * `setActiveLink` method. */
  set active(name) {
    this.#component.setActiveLink &&
      this.#component.setActiveLink(this.get(name));
  }

   /** Adds active link by name. `props` should typically only contain `href` and
    * `text`. */
  add(name, props = {}) {
    if (this.#component.get(`a[name=${name}]`)) {
      throw `Link with name '${name}' already added.`;
    }
    const link = createElement("a", props);
    link.name = name;
    this.#component.append(link);
  }

  /** Enables (visually and functionally) link by name. */
  enable(name) {
    this.get(name).classList.remove("disabled");
  }

  /** Disables (visually and functionally) link by name. */
  disable(name) {
    this.get(name).classList.add("disabled");
  }

  /** Returns link by name. */
  get(name) {
    const link = this.#component.get(`a[name=${name}]`);
    if (!link) {
      throw `Invalid name: ${name}`;
    }
    return link;
  }

  /** Hides link by name. */
  hide(name) {
    this.get(name).hide();
  }

  /** Shows link by name. */
  show(name) {
    this.get(name).show();
  }
}

export { NavLinks };
