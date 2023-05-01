import { uid } from "../../utils/uid.js";
import { mixin } from "../utils/mixin.js";
import { composeSubs } from "../compositions/subs.js";
import { composeRoot } from "../compositions/root.js";
import { EventHandlerMixin } from "../mixins/event-handler.js";
import { SyncAttrMixin } from "../mixins/sync-attr.js";

class TextInput extends mixin(HTMLElement, EventHandlerMixin, SyncAttrMixin) {
  #customInvalidFeedback;
  #customOnInput;
  #liveValidation;
  constructor() {
    super();
    // Init compositions
    composeRoot(this, {
      html: "components/text-input",
      cssClasses: ["form-floating", "mb-3"],
    });
    composeSubs(this);
    // Link label and input
    this.subs.input.id = uid.gen("textInput");
    this.subs.label.setAttr("for", this.subs.input.id);
    // Set defaults
  }

  connectedCallback() {
    this.addRoot();
    // Make component DOM-searchable by name
    this.syncAttr("name");
  }

  get customInvalidFeedback() {
    return this.#customInvalidFeedback;
  }

  set customInvalidFeedback(customInvalidFeedback) {
    this.#customInvalidFeedback = customInvalidFeedback;
  }

  get customOnInput() {
    return this.#customOnInput;
  }

  set customOnInput(customOnInput) {
    this.#customOnInput = customOnInput;
  }

  get customValidity() {
    return this.subs.input.validity.customError;
  }

  set customValidity(customValidity) {
    if (customValidity === true) {
      this.subs.input.setCustomValidity("");
      this.customInvalidFeedback = "";
    } else if (customValidity === false) {
      this.subs.input.setCustomValidity(" ");
      this.customInvalidFeedback = "";
    } else {
      // customValidity is a string.
      this.subs.input.setCustomValidity(customValidity);
      this.customInvalidFeedback = customValidity;
    }
  }

  get invalidFeedback() {
    return this.subs.invalidFeedback.text;
  }

  set invalidFeedback(invalidFeedback) {
    this.subs.invalidFeedback.text = invalidFeedback;
  }

  get label() {
    return this.subs.label.text;
  }

  set label(label) {
    this.subs.label.text = label;
    this.subs.input.placeholder = label;
  }

  get liveValidation() {
    return this.#liveValidation;
  }

  set liveValidation(liveValidation) {
    this[liveValidation ? "addEventHandler" : "removeEventHandler"](
      "input",
      this._oninput,
      this.subs.input
    );

    this.#liveValidation = liveValidation;
  }

  get name() {
    return this.subs.input.name;
  }

  set name(name) {
    this.subs.input.name = name;
    // Make component DOM-searchable by name
    this.syncAttr("name");
  }

  get required() {
    return this.subs.input.required;
  }

  set required(required) {
    this.subs.input.required = required;
    this.subs.requiredMessage.classList[required ? "remove" : "add"]("d-none");
  }

  get type() {
    return this.subs.input.type;
  }

  set type(type) {
    this.subs.input.type = type;
  }

  get valid() {
    return this.subs.input.validity.valid;
  }

  set valid(_) {
    throw `'valid' is read-only.`;
  }

  get value() {
    return this.subs.input.value;
  }

  set value(value) {
    this.subs.input.value = value;
  }

  setInvalidFeedbackFromValidity() {
    console.log(`setInvalidFeedbackFromValidity running`);

    if (this.subs.input.validity.valueMissing) {
      this.invalidFeedback = "Required";
    } else if (this.subs.input.validity.typeMismatch) {
      this.invalidFeedback = "Invalid format";
    } else if (this.subs.input.validity.customError) {
      this.invalidFeedback = this.customInvalidFeedback || "Invalid";
    }
  }

  _oninput() {
    console.log(`oninput running`);
    this.customOnInput && this.customOnInput();
    this.setInvalidFeedbackFromValidity();
  }
}

window.customElements.define("x-text-input", TextInput);
