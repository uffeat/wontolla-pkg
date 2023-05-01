const breakpoints = {
  // Less than `sm` (i.e., "xs") has index 0
  sm: 576,  // index 1
  md: 768,  // index 2
  lg: 992,  // index 3
  xl: 1200,  // index 4
  xxl: 1400,  // index 5
}



/** Returns index for current breakpoint band. */
function getWidthIndex() {
  const width = document.documentElement.clientWidth;
  if (width <= breakpoints.sm) return 1
  if (width <= breakpoints.md) return 2
  if (width <= breakpoints.lg) return 3
  if (width <= breakpoints.xl) return 4
  return 5
}

export {getWidthIndex}