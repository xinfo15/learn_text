export default function (vm, key, target) {
  Object.defineProperty(vm, key, {
    get() {
      return target[key]
    },
    set(newVal) {
      target[key] = newVal
    },
  })
}
