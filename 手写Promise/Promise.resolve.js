module.exports = function initResolve(Promise) {
  Promise.resolve = function (value) {
    return new Promise(resolve => {
      resolve(value)
    })
  }
}