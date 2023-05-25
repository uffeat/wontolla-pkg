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

component.subs.form.addControls(emailComponent, passwordComponent);


component.subs.form.showValid = false;

component.subs.form.action = (form) => {
  // Basic validation.

  if (!form.validate()) {
    console.log(`Form did not pass basic validation.`);
    return;
  }

  // Credentials validation.

  const validateCredentials = (email, password) => {
    return email === 'w@w' && password === 'w'
  }

  if (!validateCredentials(form.getValue('email'), form.getValue('password'))) {
    console.log(`Invalid credentials.`);
    form.getControl('email').customValidity = form.getControl('password').customValidity =
      "Invalid credentials";

      form.getControl('email').customOnInput = form.getControl('password').customOnInput = () => {
        form.getControl('email').customValidity = form.getControl('password').customValidity = true;
    };

    const msg = "Invalid credentials"
    form.alert.show(msg, {headline: 'Something went wrong', styleName: 'danger'});

    form.validate();
    return;
  }

  showToast(`${form.getValue('email')} is logged in.`, {headline: "Log-in success", styleName: 'success'})
  // Set global state
  state.setValue("loggedin", true);
  state.setValue("user", {email: form.getValue('email')});
  // Reset form (in case of logout-login)
  form.resetValidation();
  form.clearData()
  // Return to previous page after delay
  setTimeout(() => {
    window.history.back()
  }, "800");
};





export { component };
