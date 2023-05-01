import { config } from "./config.js";
import { state, useState } from "./state.js";
import * as _nav from "./components/components/nav.js";
import * as _navbar from "./components/components/navbar.js";
import { show as showToast } from "./components/components/toast.js";



// Generic state render funcs

function hideOnLoggedin(value) {
  if (value === true) {
    this.hide();
  } else {
    this.show();
  }
}

function showOnLoggedin(value) {
  if (value === true) {
    this.show();
  } else {
    this.hide();
  }
}

// Explicitly create logout link

const logoutLink = useState(
  "loggedin",
  createElement("a", {
    name: "logout",
    text: "Log out",
  }),
  showOnLoggedin
)
logoutLink.onclick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  let msg
  if (config.dev) {
    msg = `Logged out`
  } else {
    msg = `${state.getValue('user')} logged out.`
  }
  window.sendEvent("x-logout")
  state.setValue("loggedin", false);
  showToast(msg, {headline: "Log-out success", styleName: 'success'})
}

//window.sendEvent("x-login"

// Create complete navbar component

const navBar = createElement(
  "x-navbar",
  { parent: document.root.get("header") },
  // home link
  createElement("a.nav-link.me-auto.ps-3", {
    href: "#home",
    text: "Home",
    slot: "home",
  }),
  // main nav
  createElement(
    "x-nav",
    { slot: "main" },
    // main nav links
    createElement("a", { name: "blog", href: "#blog", text: "Blog" }),
    createElement("a", {
      name: "newsletter",
      href: "#newsletter-signup",
      text: "Newsletter",
    }),
    createElement("a", { name: "about", href: "#about", text: "About" })
  ),
  // aux nav
  createElement(
    "x-nav",
    { slot: "aux" },
    // aux nav links (stateful)
    useState(
      "loggedin",
      createElement("a", {
        name: "signup",
        href: "#signup",
        text: "Sign up",
      }),
      hideOnLoggedin
    ),
    useState(
      "loggedin",
      createElement("a", {
        name: "login",
        href: "#login",
        text: "Log in",
      }),
      hideOnLoggedin
    ),
    useState(
      "loggedin",
      createElement("a", {
        name: "account",
        href: "#account",
        text: "Account",
      }),
      showOnLoggedin
    ),
    logoutLink
  )
);

