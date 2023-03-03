const initResolve = require('./Promise.resolve')
const initReject = require('./Promise.reject')
const initAll = require('./Promise.all')
const initRace = require('./Promise.race')
const initAny = require('./Promise.any')
const initAllSettled = require('./Promise.allSettled')
class myPromise {
  constructor(executor) {
    this.status = 'pending' // 状态
    this.value = null // 成功的值
    this.reason = null // 失败的原因
    this.onFulfilledCallbacks = []  // 存储成功的回调
    this.onRejectedCallbacks = []  // 存储失败的回调

    const resolve = (value) => {
      if (this.status === 'pending') { // 状态只能改变一次
        this.status = 'fulfilled' // 执行resolve 状态变为成功
        this.value = value  // 保存值
        queueMicrotask(() => {
          this.onFulfilledCallbacks.forEach(cb => cb())
        })
      }
    }
    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason

        queueMicrotask(() => {
          this.onRejectedCallbacks.forEach(cb => cb())
        })
      }
    }

    executor(resolve, reject)
  }

  then(onFulfilled, onRejected) {
    return new myPromise((resolve, reject) => {  // 只要调用then 必定返回一个Promise实例(链式调用)
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function () { }
      onRejected = typeof onRejected === 'function' ? onRejected : function () { }
      if (this.status === 'pending') {
        this.onFulfilledCallbacks.push(() => {
          // 判断onFulfilled这个函数是不是又返回了一个promise
          // 如果返回了promise，则返回的promise的状态就是onFulfilled这个函数的状态
          // 如果没有返回promise，则状态为成功 成功的值就是返回的值
          let x = onFulfilled(this.value)
          x instanceof myPromise ? x.then(resolve, reject) : resolve(x)
        })
        this.onRejectedCallbacks.push(() => {
          // 同理
          let x = onRejected(this.reason)
          x instanceof myPromise ? x.then(resolve, reject) : resolve(x)
        })
      } else if (this.status === 'fulfilled') {
        queueMicrotask(() => {
          let x = onFulfilled(this.value)
          x instanceof myPromise ? x.then(resolve, reject) : resolve(x)
        })
      } else if (this.status === 'rejected') {
        queueMicrotask(() => {
          let x = onRejected(this.reason)
          x instanceof myPromise ? x.then(resolve, reject) : resolve(x)
        })
      }
    })
  }
  catch(fn) {
    return this.then(null, fn)
  }
}
initResolve(myPromise)
initReject(myPromise)
initAll(myPromise)
initRace(myPromise)
initAny(myPromise)
initAllSettled(myPromise)

const p1 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(1)
  }, 300);
})
const p2 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    reject(2)
  }, 200);
})
const p3 = new myPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(3)
  }, 100);
})

myPromise.allSettled([p1, p2, p3]).then((data) => {
  console.log(data);
})