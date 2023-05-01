/** Helper for management of event handlers. Streamlines the implementation of two needs:
 *   1. `this`-binding 
 *   2. Explicit creation of bound method - required for event handler dereg. 
 *  NOTE: The idea is that `addEventListener` and `removeEventHandler` can be used with
 *  (apparently) non-bound methods (which are bound a stored behind the scences). 
 * */
const EventHandlerMixin = (Parent) => {
  class EventHandler extends Parent {
    /** Registers (bound) event handler on `target` and adds bound event handler to component. */
    addEventHandler(eventType, unBoundHandler, target = this) {
      // NOTE: The optional third arg (a component descendant element) is a little funky,
      // but defensible since the handler (and target) belong to the component.

      // Create bound handler.
      const boundHandler = unBoundHandler.bind(this);
      // Add bound handler to component for later retrival (dereg purposes).
      this[EventHandler.#genBoundHandlerName(unBoundHandler)] = boundHandler;

      target.addEventListener(eventType, boundHandler);
      return boundHandler;
    }

    /** Deregisters (bound) event handler from `target`. */
    removeEventHandler = (eventType, unBoundHandler, target = this) => {
      const boundHandlerName = EventHandler.#genBoundHandlerName(unBoundHandler);
      if (boundHandlerName in this) {
        target.removeEventListener(eventType, this[boundHandlerName]);
      };
      
    };
    // `removeEventHandler` is a conveniece feature; since a bound method is
    // added to `this` removeEventListener could be used for that method
    // (which - as a third option - is also returned by `addEventHandler`)
    // can be used on the target with the Bound suffixed handler.

    /** Returns name for bound handler. */
    static #genBoundHandlerName(handler) {
      // Done in a separate method to ensure consistency between `addEventHandler` 
      // and `removeEventHandler`.
      return `${handler.name}Bound`;
    }
  }

  return EventHandler;
};

export { EventHandlerMixin };
