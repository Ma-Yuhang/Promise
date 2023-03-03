module.exports = function initRace(Promise) {
  Promise.race = function (promiseArr) { // 返回最快成功的那个
    return new Promise((resolve, reject) => {
      for (const i in promiseArr) {
        promiseArr[i].then(resolve, reject)
      }
    })
  }
}