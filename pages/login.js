import { state } from "../state.js";
import * as _form from "../components/components/form.js";
import * as _textInput from "../components/components/text-input.js";
import { composeSubs } from "../components/compositions/subs.js";

const component = createElement("div.login", {
  innerHTML: getHtml("pages/login"),
});
composeSubs(component);

const emailComponent = createElement("x-text-input.col-md-6", {
  name: "email",
  type: "email",
  label: "Email",
  required: true,
});

const passwordComponent = createElement("x-text-input.col-md-6", {
  name: "password",
  type: "password",
  label: "Password",
  required: true,
});

component.subs.form.add(emailComponent, passwordComponent);
component.subs.form.showValid = false;

component.subs.form.action = (form) => {
  
  // Basic validation.

  if (!form.validate()) {
    console.log(`Form did not pass basic validation.`);
    return;
  }

  // Credentials validation.

  if (emailComponent.value !== "a@a" || passwordComponent.value !== "a") {
    console.log(`Invalid credentials.`);
    emailComponent.customValidity = passwordComponent.customValidity =
      "Invalid credentials";

    emailComponent.customOnInput = passwordComponent.customOnInput = () => {
      emailComponent.customValidity = passwordComponent.customValidity = true;
    };

    form.alert.show("Invalid credentials");

    form.validate();
    return;
  }

  form.resetValidation();
  console.log(`Form is valid.`);
  state.setValue('loggedin', true)
};

export { component };
