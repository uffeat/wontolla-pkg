import { onhashchange, routes } from "./router.js";
import { pageClasses } from "../libs/bootstrap/utils/classes.js";
import { removeHash } from "../utils/url.js";

const setPage = async (name, kwargs = {}) => {
  const { noHash } = kwargs;
  noHash && removeHash();
  const { component } = await import(`../pages/${name}.js`);
  component.classList.add(...pageClasses);
  document.main.clear().append(component);
};

routes.add("account", () => {
  setPage("account");
});

routes.add("blog-post", (kwargs, ...args) => {
  console.log(
    `blog-post route running with kwargs '${kwargs}' and args '${args}'.`
  );
});

routes.add("home", () => {
  setPage("home");
});

routes.add("login", () => {
  setPage("login", { noHash: true });
});

routes.add("modal", () => {
  setPage("modal");
});

routes.add("rpc", () => {
  setPage("rpc");
});

routes.add("signup", () => {
  setPage("signup", { noHash: true });
});

// Set up `onhashchange` AFTER setting up routes.
window.onhashchange = onhashchange;
onhashchange(null, "home");
