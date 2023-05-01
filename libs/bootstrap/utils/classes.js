const styles = [
  "primary",
  "secondary",
  "danger",
  "info",
  "success",
  "warning",
  "light",
  "dark",
];

const pageClasses = ["container", "max-width-lg", "my-3"];



/** Validates `style`. */
function _validateStyle(style) {
  if (!styles.includes(style)) {
    throw new Error(`Invalid style: ${style}. Valid styles: ${styles.join(", ")}.`);
  }
}

/** Removes all prefixed style classes from `element`. */
function clearStyles(element, prefix) {
  styles.forEach((s) => {
    element.classList.remove(`${prefix}-${s}`);
  });
}

/** Adds a prefixed style class to `element`.
Optional default clears prefixed style classes first. */
function setStyle(element, prefix, style, clear = true) {
  _validateStyle(style);
  if (clear) {
    clearStyles(element, prefix);
  }
  element.classList.add(`${prefix}-${style}`);
}

export {
  pageClasses,
  clearStyles,
  setStyle,
};
