const _toString = Object.prototype.toString
export default class RequestInterceptor {
  constructor() {
    this.queue = [];
  }
  use(filterFn) {
    const __type = _toString.call(filterFn);
    if (__type === '[object Function]') {
      this.queue.push(filterFn);
    } else {
      console.warn('param type error;');
      console.warn('require type is functon, real type is:', __type)
    }
  }
  run(input) {
    if (this.queue.length > 0) {
      return this.queue.reduce((pre, curr) => {
        return curr(pre)
      }, input)
    } else {
      return input;
    }
  }
}