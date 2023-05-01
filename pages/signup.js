import * as _form from "../components/components/form.js";
import * as _textInput from "../components/components/text-input.js";
import { composeSubs } from "../components/compositions/subs.js";

const component = createElement("div.signup", {
  innerHTML: getHtml("pages/signup"),
});
composeSubs(component);

const passwordComponent = createElement("x-text-input.col-md-6", {
  name: "password",
  type: "password",
  label: "Password",
  required: true,
});

const passwordComponent2 = createElement("x-text-input.col-md-6", {
  name: "password2",
  type: "password",
  label: "Password (repeat)",
  required: true,
});

component.subs.form.addControl(passwordComponent, passwordComponent2);
component.subs.form.showValid = false;

component.subs.form.action = (form) => {

  // Basic validation.

  if (!form.validate()) {
    console.log(`Form is invalid.`);
    return;
  }

  // Password validation.

  let validator = () => {
    if (passwordComponent.value === passwordComponent2.value) {
      passwordComponent.customValidity =
        passwordComponent2.customValidity = true;
      return true;
    } else {
      passwordComponent.customValidity = passwordComponent2.customValidity =
        "Passwords do not match";
      return false;
    }
  };

  if (!validator()) {
    console.log(`Passwords do not match.`);

    passwordComponent.customOnInput = passwordComponent2.customOnInput =
    validator;

    form.validate();
    return;
  }

  form.resetValidation();
  console.log(`Form is valid.`);
};

export { component };
