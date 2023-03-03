module.exports = function initAll(Promise) {
  Promise.all = function (promiseArr) { // 有一个失败就返回失败,全部成功则返回所有成功的值（数组）
    let resolveArr = []
    let index = 0
    return new Promise((resolve, reject) => {
      for (let i in promiseArr) {
        promiseArr[i]
          .then((data) => {
            resolveArr[i] = data;
            index++
            if (index === promiseArr.length) {
              resolve(resolveArr);
            }
          }, reject)
      }
    })
  }
}