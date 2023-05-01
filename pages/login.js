import { config } from "../config.js";
import { state } from "../state.js";
import * as _form from "../components/components/form.js";
import { show as showToast } from "../components/components/toast.js";
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

component.subs.form.addControl(emailComponent, passwordComponent);
component.subs.form.showValid = false;

component.subs.form.action = (form) => {
  // Basic validation.

  if (!form.validate()) {
    console.log(`Form did not pass basic validation.`);
    return;
  }

  // Credentials validation.

  let event = window.sendEvent("x-login", {
    email: emailComponent.value,
    password: passwordComponent.value,
  });

  if (event.detail.success === false) {
    console.log(`Invalid credentials.`);
    emailComponent.customValidity = passwordComponent.customValidity =
      "Invalid credentials";

    emailComponent.customOnInput = passwordComponent.customOnInput = () => {
      emailComponent.customValidity = passwordComponent.customValidity = true;
    };

    const msg = event.detail.msg || "Invalid credentials"
    form.alert.show(msg, {headline: 'Something went wrong', styleName: 'danger'});

    form.validate();
    return;
  }

  showToast(`${emailComponent.value} is logged in.`, {headline: "Log-in success", styleName: 'success'})
  // Reset form (in case of logout-login)
  form.resetValidation();
  form.clearData()
  // Set global state
  state.setValue("loggedin", true);
  // Return to previous page after delay
  setTimeout(() => {
    window.history.back()
  }, "800");
};

// Dummy for dev
if (config.dev) {
  window.addEventListener("x-login", (event) => {
    const email = event.detail.email
    console.log(email)
    const password = event.detail.password
    console.log(password)
    if (email !== "w@w" || password !== "w") {
      event.detail.success = false
      event.detail.msg = 'Oh, no!!!'
    }
  })
}



export { component };
