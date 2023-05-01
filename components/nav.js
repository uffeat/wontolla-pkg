import { mixin } from "../utils/mixin.js";
import { composeSubs } from "../compositions/subs.js";
import { NavLinks } from "../compositions/nav-links.js";

/** Small global style patch to compensate for unexpected Bootstrap behaviour. */
document.addCss(`
.nav-link:hover {
  text-decoration: none;
}
`);

/** Bootstrap-based nav container component. 
 * Can work with (be added to) the navbar component. */
class Nav extends mixin(HTMLElement) {
  // Classes to be added to the active link.
  static #ACTIVE_CLASSES = ["active"];
  #links;
  /** Creates shadow, inits compositions, adds event handlers. */
  constructor() {
    super();
    this.addShadow({
      sheets: ["bootstrap/core", "bootstrap/custom", "styles/utils"],
      html: "components/nav",
    });
    composeSubs(this);
    // Patch-up added nav links.
    this.subs.slot.onslotchange = (event) => {
      event.target.assignedNodes().forEach((element) => {
        if (element.tagName === "A") {
          element.classList.add("nav-link");
        }
      });
    };
    // Event delegation to links for setting active link.
    this.onclick = (event) => {
      if (event.target.tagName === "A") {
        this.setActiveLink(event.target);
      }
    };
  }

  /** Retuns `links` controller composition. */
  get links() {
    // `links` is just a conveniece feature; links can still be added to the 
    // component in the standard way (still without need to add `nav-links` class).
    if (this.#links) return this.#links;
    this.#links = new NavLinks(this);
    return this.#links;
  }

  /** Makes `links` read-only. */
  set links(_) {
    throw `'links' is read-only.`;
  }

  /** Makes `links` write-only. */
  get collapsible() {
    // No practical need for reading,
    throw `'collapsible' is write-only.`;
  }

  /** Sets the `collapsible` attribute. */
  set collapsible(collapsible) {
    // `collapsible` is for the use of the nav component in the navbar component.
    // NOTE: The navbar component automatically sets `collapsible` as needed,
    // so never a need to use explicitly.
    // No need for attr -> prop sync.
    // No need for work - `collapsible` controls css.
    this.setAttr("collapsible", collapsible);
  }

  /** Makes `links` write-only. */
  get vertical() {
    // No practical need for reading,
    throw `'vertical' is write-only.`;
  }

  /** Sets the `vertical` attribute. */
  set vertical(vertical) {
    // No need for attr -> prop sync.
    // No need for work - `vertical` controls css.
    this.setAttr("vertical", vertical);
  }

  /** Sets active link and fires `x-active-change` with detail. */
  setActiveLink(link) {
    const oldActiveLink = this.get("a.active");
    if (oldActiveLink) {
      oldActiveLink.classList.remove(...Nav.#ACTIVE_CLASSES);
      oldActiveLink.setAttr("aria-current", null);
    }
    link.classList.add(...Nav.#ACTIVE_CLASSES);
    link.setAttr("aria-current", "page");
    // Detail holds link element and - for conveniece - also directly the link's name.
    this.sendEvent("x-active-change", { link, name: link.name });
  }
}

window.customElements.define("x-nav", Nav);
