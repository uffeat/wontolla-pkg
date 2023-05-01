import * as _nav from "./components/components/nav.js";
import * as _navbar from "./components/components/navbar.js";

const auxNav = createElement("x-nav", { slot: "aux" });

const signupLink = createElement("a", {
  name: "signup",
  href: "#signup",
  text: "Sign up",
  parent: auxNav,
});
signupLink.setAttr("loggedin-subscriber");
signupLink.renderLoggedin = (value) => {
  if (value === true) {
    signupLink.hide()
  } else {
    signupLink.show()
  }
};
signupLink.renderLoggedin()


const loginLink = createElement("a", {
  name: "login",
  href: "#login",
  text: "Log in",
  parent: auxNav,
});
loginLink.setAttr("loggedin-subscriber");
loginLink.renderLoggedin = (value) => {
  if (value === true) {
    loginLink.hide()
  } else {
    loginLink.show()
  }
};
loginLink.renderLoggedin()


const accountLink = createElement("a", {
  name: "account",
  href: "#account",
  text: "Account",
  parent: auxNav,
});
accountLink.setAttr("loggedin-subscriber");
accountLink.renderLoggedin = (value) => {
  if (value === true) {
    accountLink.show()
  } else {
    accountLink.hide()
  }
};
accountLink.renderLoggedin()


const logoutLink = createElement("a", {
  name: "logout",
  text: "Log out",
  parent: auxNav,
}); // No href
logoutLink.setAttr("loggedin-subscriber");
logoutLink.renderLoggedin = (value) => {
  if (value === true) {
    logoutLink.show()
  } else {
    logoutLink.hide()
  }
};
logoutLink.renderLoggedin()

const mainNav = createElement("x-nav", { slot: "main" });
mainNav.links.add("blog", { href: "#blog", text: "Blog" });
mainNav.links.add("newsletter", {
  href: "#newsletter-signup",
  text: "Newsletter",
});
mainNav.links.add("about", { href: "#about", text: "About" });

const navBar = createElement(
  "x-navbar",
  { parent: document.root.get("header") },
  createElement("a.nav-link.me-auto.ps-3", {
    href: "#home",
    text: "Home",
    slot: "home",
  }),
  auxNav,
  mainNav
);


