const _toString = Object.prototype.toString;
export default class ResponseInterceptor {
  constructor() {
    this.queue = [];
  }
  use(resolveCb, rejectCb) {
    const __type1 = _toString.call(resolveCb);
    const __type2 = _toString.call(rejectCb);
    if (__type1 === '[object Function]') {
      this.queue.push(resolveCb);
    } else {
      this.queue.push(null);
      console.warn('param1 type error;');
      console.warn('require type is functon, real type is:', __type)
    }
    if (__type2 === '[object Function]') {
      this.queue.push(rejectCb);
    } else {
      this.queue.push(null);
      console.warn('param2 type error;');
      console.warn('require type is functon, real type is:', __type)
    }
  }
  run(initParam) {
    if (this.queue.length > 0) {
      let res = Promise.resolve(initParam);
      for (let i = 0; i < this.queue.length; i += 2) {
        const resolve = queue[i];
        const reject = queue[i + 1];
        res.then(
          (_res) => (resolve ? resolve(_res) : _res),
          (_rej) => (reject ? reject(_rej) : _rej),
        )
      }
      return res;
    } else {
      return Promise.resolve(initParam);
    }
  }
}