import { getWidthIndex } from "../../libs/bootstrap/utils/breakpoints.js";
import { mixin } from "../utils/mixin.js";
import * as _nav from "../components/nav.js";
import { composeSubs } from "../compositions/subs.js";

/** Bootstrap-based responsive navbar container component with two tiers of nav bars. 
 * Works with the nav component. */
class Navbar extends mixin(HTMLElement) {
  #bsCollapse;
  constructor() {
    super();
    /** Creates shadow, inits compositions, adds event handlers. */
    this.addShadow({
      sheets: ["bootstrap/core", "bootstrap/custom", "styles/utils"],
      html: "components/navbar",
    });
    composeSubs(this);
    // Init Bootstrap component. Collapse control via `data-bs-target` doesn't 
    // work in the shadow, so we need to be able to explicitly control collapse.
    
   
    this.#bsCollapse = new bootstrap.Collapse(this.subs.navbarCollapse);
    
    
    // Set up toggle button.
    this.subs.toggleButton.onclick = (event) => {
      this.#bsCollapse.toggle();
    };
    // Event delegation to links so that link clicks close collapse bar.
    this.onclick = (event) => {
      if (event.target.tagName === "A") {
        this.close();
      }
    };
    // Patch-up added nav components to suit main nav.
    this.root.get(`slot[name=main]`).onslotchange = (event) => {
      event.target.assignedNodes().forEach((element) => {
        if (element.tagName === "X-NAV") {
          element.collapsible = true;
          element.subs.nav.classList.add("py-3", "py-md-0");
        }
      });
    };
    // Patch-up added nav components to suit main nav.
    this.root.get(`slot[name=aux]`).onslotchange = (event) => {
      event.target.assignedNodes().forEach((element) => {
        if (element.tagName === "X-NAV") {
          //element.classes.add("ms-auto");
        }
      });
    };
  }

  /** Toggles collapse bar open/close. */
  toggle() {
    if (getWidthIndex() < 3) {
      this.#bsCollapse.toggle();
    }
  }

  /** Open collapse bar. */
  open() {
    // Abort if no collapse bar due to width.
    if (getWidthIndex() > 2) return;
    // Abort if collapse bar already open.
    if (this.subs.navbarCollapse.classList.contains("show")) return;
    this.#bsCollapse.show();
  }

  /** Closes collapse bar. */
  close() {
    // Abort if no collapse bar due to width.
    if (getWidthIndex() > 2) return;
    // Abort if collapse bar already closed.
    if (!this.subs.navbarCollapse.classList.contains("show")) return;
    this.#bsCollapse.hide();
  }
}

window.customElements.define("x-navbar", Navbar);

/* EXAMPLE USE OF NAV AND NAVBAR FROM JS

const navbar = X.element.create("x-navbar", {
  parent: document.root,
});


const navbar = X.element.create("x-navbar", {
  parent: document.root,
});

const mainNav = X.element.create("x-nav", {
  parent: navbar,
});

mainNav.links.add("firstLink", { text: "First link" });
mainNav.links.add("secondLink", { text: "Second link" });
mainNav.links.add("thirdLink", { text: "Third link" });
mainNav.links.disable("thirdLink");
mainNav.links.active = 'firstLink'

mainNav.addEventListener("x-active-change", (event) => {
  console.log(`New acti
const auxNav = X.element.create("x-nav", {slot: 'aux',
  parent: navbar,
});
auxNav.links.add("linkA", { text: "Link A" });
auxNav.links.add("linkB", { text: "Link B" });
*/

/* EXAMPLE USE OF NAV AND NAVBAR FROM HTML

const container = X.element.create('div', {parent: document.root, html: `
<x-navbar>
  <x-nav slot="aux">
    <a name="linkA" href="#">Link A</a>
    <a name="linkB" href="#">Link B</a>
  </x-nav>
  <x-nav>
    <a name="link1" href="#">Link 1</a>
    <a name="link2" href="#">Link 2</a>
    <a name="link3" href="#">Link 3</a>
  </x-nav>
</x-navbar>
`})
*/

/* NOTES ON APPLIED PATTERN
- No 'shadow-in-shadow'.
- The basic nav component is explicitly used as a building blocks
  for the navbar component but is NOT an internal pat of the navbar component
  (other than with respect to css class and attribute adaptation).
*/
