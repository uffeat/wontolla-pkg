import { composeSubs } from "../compositions/subs.js";
import { setStyle } from "../../libs/bootstrap/utils/classes.js";

const show = (content, kwargs = {}) => {
  const {headline = "", styleName = "primary", delay = 5000} = kwargs

  let container = document.get("div.toast-container");
  if (!container) {
    container = createElement(
      "div.toast-container.position-fixed.bottom-0.end-0.p-3",
      { parent: document.body }
    );
  }

  const component = createElementFromHtml("components/toast", { parent: container });
  composeSubs(component);
  
  setStyle(component.subs.headline, "text", styleName);
  component.subs.headline.text = headline;
  component.subs.body.text = content;

  const bsComponent = new bootstrap.Toast(component, { delay: delay });

  component.addEventListener("hidden.bs.toast", (event) => {
    event.stopPropagation();
    bsComponent.dispose();
    component.remove();
    if (!container.firstElementChild) {
      container.remove();
    }
  });

  bsComponent.show();
};

export { show };


/*
EXAMPLE

showToast("Toasted again...", { headline: "A Toast!", delay: 3000 });
showToast("Short but dangerous.", {
  headline: "A shorter Toast!",
  delay: 1000,
  styleName: "danger",
});
showToast("Toooooaaaaasssstttttt!!!!", {
  headline: "A long dark Toast!",
  delay: 5000,
  styleName: "dark",
});

*/