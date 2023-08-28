const _toString = Object.prototype.toString;
export default class ResponseInterceptor {
  constructor() {
    this.queue = [];
  }
  use (resolveCb,rejectCb) {
    const __type1 = _toString.call(resolveCb);
    const __type2 = _toString.call(rejectCb);
    if (/[object .*Function]/.test(__type1)) {
      this.queue.push(resolveCb);
    } else {
      this.queue.push(null);
    }
    if (/[object .*Function]/.test(__type2)) {
      this.queue.push(rejectCb);
    } else {
      this.queue.push(null);
    }
  }
  run (result) {
    if (this.queue.length > 0) {
      let res = Promise.resolve(result);
      for (let i = 0; i < this.queue.length; i += 2) {
        const resolve = this.queue[i];
        const reject = this.queue[i + 1];
        res = res.then(
          (_res) => (resolve ? resolve(_res) : Promise.resolve(_res)),
          (_rej) => (reject ? reject(_rej) : Promise.reject(_rej)),
        )
      }
      return res;
    } else {
      return Promise.resolve(result);
    }
  }
}
