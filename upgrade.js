import { assets } from "./assets.js";

// ALIASES

Element.prototype.get = Element.prototype.querySelector;
Element.prototype.getAll = Element.prototype.querySelectorAll;

ShadowRoot.prototype.get = ShadowRoot.prototype.querySelector;
ShadowRoot.prototype.getAll = ShadowRoot.prototype.querySelectorAll;

document.get = document.querySelector;
document.getAll = document.querySelectorAll;

document.root = document.getElementById("appGoesHere");

document.header = document.createElement("header");
document.main = document.createElement("main");
document.footer = document.createElement("footer");

document.root.append(document.header, document.main, document.footer);

// STYLE

/** Adds "stylesheets" to document or a shadow root. */
function addSheets(...paths) {
  for (let path of paths) {
    if (!path.endsWith(".css")) {
      path = `${path}.css`;
    }
    // `_assets` is an object with `path` keys and CSS text as values.
    if (!(path in assets)) {
      throw new Error(`Invalid assets path: \`${path}\`.`);
    }
    const cssText = assets[path];
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    //sheet.replace(cssText);
    this.adoptedStyleSheets = [...this.adoptedStyleSheets, sheet];
  }
}

// Add `addSheets` as a method of `ShadowRoot.prototype`
ShadowRoot.prototype.addSheets = addSheets;
// Add `addSheets` as a method of document
document.addSheets = addSheets.bind(document);

/** Useful for adding small component-specific css snippets to document
 * Should be invoked from component module. */
document.addCss = (cssText) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
};

// Add global styles
document.addSheets(
  "uikit/core",
  "uikit/custom",
  "bootstrap/core",
  "bootstrap/custom",
  "styles/app",
  "styles/utils",
  "styles/components"
);

// SCRIPTS

const addedScripts = [];

const addScripts = (...paths) => {
  for (let path of paths) {
    if (!path.endsWith(".js")) {
      path = `${path}.js`;
    }
    if (!(path in assets)) {
      throw new Error(`Invalid assets path: \`${path}\`.`);
    }
    if (addedScripts.includes(path)) {
      console.log(`Script '${path}' already added.`);
    }
    new Function(assets[path])();
    addedScripts.push(path);
  }
};

document.addScripts = addScripts;

// Add global lib scripts
document.addScripts("uikit/core", "uikit/icons", "bootstrap/core");

// GLOBAL FUNCS

// Html

/** */
function getHtml(arg) {
  if (!arg.endsWith(".html")) {
    arg = `${arg}.html`;
  }
  if (!(arg in assets)) {
    throw new TypeError(`Invalid assets path: ${arg}.`);
  }
  return assets[arg];
}

window.getHtml = getHtml;

// Function tools

// TODO Maybe add type-checking?
// TODO May be add check of valid values (from array)?

const checkKwargs = (kwargs, ...validKeys) => {
  if (kwargs) {
    if (validKeys.length > 0) {
      // Check keys.
      const invalidKeys = Object.keys(kwargs).filter(
        (key) => !validKeys.includes(key)
      );
      if (invalidKeys.length > 0) {
        throw Error(`Invalid arg: ${invalidKeys}.`);
      }
    }
    // Return shallow copy of kwargs.
    return { ...kwargs };
  }
};

window.checkKwargs = checkKwargs;

// Promise tools

const createPromise = (executor) => {
  return new Promise(executor);
};

window.createPromise = createPromise;

const createAndAwaitPromise = async (executor) => {
  return await createPromise(executor);
};

window.createAndAwaitPromise = createAndAwaitPromise;

const createElement = (arg, props, ...children) => {
  // Creates HTML element with options to set CSS classes, add children,
  // add to parent, set inner HTML and attach shadow.

  const [tag, ...classes] = arg.split(".");

  const element = document.createElement(tag);
  element.updateProps(props);

  if (classes.length) {
    element.classList.add(...classes);
  }

  if (children.length) {
    element.append(...children);
  }

  return element;
};

window.createElement = createElement;

const createElementFromHtml = (html, props = {}) => {
  // Creates HTML element from 'outer' HTML with options,
  // add to parent and attach shadow root.

  html = getHtml(html);
  let element;

  const temp = document.createElement("div");
  temp.innerHTML = html;
  if (temp.children.length > 1) {
    // No single top-level element; add such.
    element = temp;
  } else {
    element = temp.firstElementChild;
  }

  element.updateProps(props);

  return element;
};

window.createElementFromHtml = createElementFromHtml;

// STRUCTURE.

Object.defineProperty(HTMLElement.prototype, "parent", {
  get: function () {
    return this.parentElement;
  },
  set: function (parent) {
    parent.append(this);
  },
  configurable: true,
});

HTMLElement.prototype.clear = function (slot) {
  if (slot === undefined) {
    while (this.firstChild) {
      this.firstChild.remove();
    }
  } else {
    [...this.children].forEach((child) => {
      if ((slot === "" && !child.slot) || child.slot === slot) {
        child.remove();
      }
    });
  }
  return this; // Allows chaining.
};

// SHADOW

/**
 * Attaches a shadow root to an HTML element.
 * @param {object} kwargs - An object containing optional arguments.
 * @param {boolean} [kwargs.delegatesFocus=false] - Whether the shadow root delegates focus.
 * @param {string} [kwargs.html=null] - The HTML string to add to the shadow root.
 * @param {Array} [kwargs.sheets=null] - An array of asset keys to add as stylesheets to the shadow root.
 * @returns {ShadowRoot} The newly created shadow root.
 */
function addShadow(kwargs = {}) {
  // Create shallow copy kwargs object. Ensures that original object passed as a parameter remains unchanged;
  // useful in preventing unintended side effects.
  kwargs = { ...kwargs };
  // Destructure.
  const { delegatesFocus = false, html, sheets } = kwargs;

  this.attachShadow({
    mode: "open",
    delegatesFocus: delegatesFocus,
  });

  if (html) {
    this.shadowRoot.innerHTML = getHtml(html);
  }

  if (sheets) {
    // `sheets` is an array of assets keys ("paths").
    // Add stylesheets from `_assets` to shadow root:
    this.shadowRoot.addSheets(...sheets);
  }
  // Add alias for consistency with non-shadow components.
  this.root = this.shadowRoot;

  // Return shadow root to respect native pattern.
  return this.shadowRoot;
}

// Add `addShadow` as a method of `HTMLElement.prototype`.
HTMLElement.prototype.addShadow = addShadow;

// PROPS.

/** Updates element and element.style properties. */
HTMLElement.prototype.updateProps = function (props) {
  if (props && Object.keys(props).length >= 0) {
    for (const [prop, value] of Object.entries(props)) {
      // Allow new private prop.
      if (prop.startsWith("_")) {
        this[prop] = value;
      } else if (prop in this) {
        this[prop] = value;
      } else if (prop in this.style) {
        this.style[prop] = value;
      } else {
        throw new Error(`Invalid property: '${prop}'.`);
      }
    }
  }
  return this; // Allows chaining and in-line application.
};

Object.defineProperty(Node.prototype, "text", {
  get: function () {
    return this.textContent;
  },
  set: function (text) {
    this.textContent = text;
  },
  configurable: true,
});

// ATTRS

function setAttr(name, value) {
  if (value === null) {
    this.removeAttribute(name);
  } else if (value === undefined) {
    this.setAttribute(name, "");
  } else {
    this.setAttribute(name, value);
  }
  return this; // Allows chaining and in-line application.
}

HTMLElement.prototype.setAttr = setAttr;
ShadowRoot.prototype.setAttr = setAttr;

// EVENTS

function sendEvent(name, detail) {
  let event;
  if (detail) {
    event = new CustomEvent(name, { detail });
  } else {
    event = new Event(name);
  }
  this.dispatchEvent(event);
  return event;
}

HTMLElement.prototype.sendEvent = sendEvent;
ShadowRoot.prototype.sendEvent = sendEvent;
window.sendEvent = sendEvent;

// COMPOSITION WITH CLASSES

HTMLElement.prototype.compose = function (Composition, ...args) {
  this[Composition.name.toLowerCase()] = new Composition(this, ...args);
};

// SHOW/HIDE

function show() {
  this.classList.remove("d-none");
  return this; // Allows chaining and in-line application.
}

HTMLElement.prototype.show = show;
ShadowRoot.prototype.show = show;

function hide() {
  this.classList.add("d-none");
  return this; // Allows chaining and in-line application.
}

HTMLElement.prototype.hide = hide;
ShadowRoot.prototype.hide = hide;

// STRING

// NOTE: The added string methods below do NOT change the original string.

const capitalize = (text) => {
  if (text.length > 0) {
    text = text[0].toUpperCase() + text.slice(1);
  }
  return text;
};

String.prototype.capitalize = function () {
  return capitalize(this);
};

const uncapitalize = (text) => {
  if (text.length > 0) {
    text = text[0].toLowerCase() + text.slice(1);
  }
  return text;
};

String.prototype.uncapitalize = function () {
  return uncapitalize(this);
};

const toCamel = (kebab) => {
  return kebab.replace(/-([a-z])/g, function (match, capture) {
    return capture.toUpperCase();
  });
};

String.prototype.toCamel = function () {
  return toCamel(this);
};

const toKebab = (camel) => {
  return camel.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

String.prototype.toKebab = function () {
  return toKebab(this);
};
