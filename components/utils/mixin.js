/* Returns a composite class with an inheritance hierarchy derived from Base and mixin functions. */
const mixin = (BaseClass, ...mixins) => {
  if (mixins.length === 0) return BaseClass

  let CompositeClass;

  // Ensure that constructor of first added mixin class is invoked first
  mixins = mixins.reverse();
  // NOTE: Subsequently added mixin classes can overload previously added mixin classes.

  // Create first composite class (extended from BaseClass):
  CompositeClass = mixins[0](BaseClass);

  // Successively update composite class (extended from previous version of composite class):
  for (let index = 1; index < mixins.length; index++) {
    CompositeClass = mixins[index](CompositeClass);
  }
  return CompositeClass;
};

export { mixin };
