export const makeFocusDriver = function (rootSelector) {
  let root = document.querySelector(rootSelector)
  return function (focuse$, driverName) {
    focuse$
      .map((selector) => root.querySelector(selector))
      .subscribe((element) => element.focus())
  }
}
