/** */
const composeSubs = (component) => {
  let source;

      if (component.root) {
        source = component.root;
      } else {
        source = component;
      }

      const subs = {};
      const xElements = source.getAll(`*[data-x]`);

      xElements.forEach((element) => {
        subs[element.dataset.x] = element;
      });

      component.subs = subs;
}

export {composeSubs}
    
