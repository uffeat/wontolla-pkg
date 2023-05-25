import { mixin } from "../utils/mixin.js";
import { composeSubs } from "../compositions/subs.js";
import { composeRoot } from "../compositions/root.js";
import * as _alert from "../components/alert.js";

class Form extends mixin(HTMLElement) {
  #action;
  constructor() {
    super();
    composeRoot(this, { html: "components/form", cssClasses: ["container"] });
    composeSubs(this);
    // `this.subs.form` has class `row`; added control can be styled with col-classes.

    // Expose selected subs to public interface (other than via `subs`)
    this.alert = this.subs.alert;
    this.aux = this.subs.aux;

    // Set event handlers
    this.subs.submitButton.addEventListener("click", (event) => {
      if (this.action) {
        this.action(this);
      }
    });

    // Set init state
    this.alert.hide();
  }

  connectedCallback() {
    this.addRoot();
  }

  get action() {
    return this.#action;
  }

  set action(action) {
    this.#action = action;
  }

  // CONTROLS

  get controls() {
    return this.root.getAll(".x-control");
  }

  set controls(controls) {
    this.clearControls;
    this.addControl(...controls);
  }

  addControl(control, ...cssClasses) {
    if (cssClasses.length === 0) {
      cssClasses=["col-md-6"]
    }
    control.classList.add("x-control", ...cssClasses);
    this.subs.form.append(control);
  }

  addControls(...controls) {
    controls = controls.map((control) => {
      control.classList.add("x-control", "col-md-6");
      return control;
    });
    this.subs.form.append(...controls);
  }

  clearControls() {
    this.subs.form.clear();
  }

  getControl(name) {
    return this.subs.form.get(`.x-control[name=${name}]`);
  }

  // DATA/VALUES

  get data() {
    const data = {};
    this.controls.forEach((control) => {
      data[control.name] = control.value;
    });
    return data;
  }

  set data(data) {
    this.controls.forEach((control) => {
      if (control.name in data) {
        control.value = data[control.name];
      }
    });
  }

  clearData() {
    this.controls.forEach((control) => {
      control.value = null;
    });
  }

  getValue(name) {
    const control = this.getControl(name);
    if (control) return control.value;
  }

  setValue(name, value) {
    const control = this.getControl(name);
    if (control) {
      control.value = value;
    }
  }

  // VALIDATION

  get showValid() {
    return !this.subs.form.classList.contains("no-show-valid");
  }

  set showValid(showValid) {
    this.subs.form.classList[showValid ? "remove" : "add"]("no-show-valid");
  }

  get valid() {
    return this.subs.form.checkValidity();
  }

  set valid(_) {
    throw `'valid' is read-only.`;
  }

  resetValidation() {
    this.alert.hide();
    this.subs.form.classList.remove("was-validated");
  }

  validate() {
    this.subs.form.classList.add("needs-validation");
    this.subs.form.checkValidity();

    this.controls.forEach((control) => {
      if (!control.valid) {
        control.setInvalidFeedbackFromValidity();
        control.liveValidation = true;
      } else {
        control.liveValidation = false;
      }
    });

    this.subs.form.classList.add("was-validated");
    return this.valid;
  }
}

window.customElements.define("x-form", Form);
