const _toString = Object.prototype.toString;
const isArray = (tar) => (_toString.call(tar) === '[object Array]');
const isFn = (tar) => (_toString.call(tar) === '[object Function]');
export default class Runner {
  constructor(queue) {
    this.queue = null;
    if (isArray(queue)) {
      this.queue = queue;
    }
  }
  push(callback) {
    if (isFn(callback)) {
      const pos = this.queue.push(callback)
      return () => { this.queue.splice(pos, 1) }
    } else {
      console.warn('param type error:')
      console.warn('require type is function, current is ', _toString.call(callback))
      return () => { }
    }
  }
  run(input) {
    this.queue.forEach(callback => {
      callback(input);
    });
  }
}