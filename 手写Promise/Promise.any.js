module.exports = function initAny(Promise) {
  Promise.any = function (promiseArr) { // 返回最快成功的那个
    let index = 0
    return new Promise((resolve, reject) => {
      for (let i in promiseArr) {
        promiseArr[i].then(resolve, err => {
          index++
          if(index === promiseArr.length) {
            throw('全部失败了')
          }
        })
      }
    })
  }
}