export default class Block {
  constructor() {
    this.isReady = fasle;
    this.queue = [];
  }
  ready() {
    if (this.isReady) {
      return Promise.resolve(true);
    } else {
      return new Promise((resolve, reject) => {
        this.queue.push(resolve, reject);
      })
    }
  }
  setReady() {
    this.isReady = true;
    while (this.queue.length) {
      const _resolve = this.queue.shift();
      const _reject = this.queue.shift();
      _resolve();
    }
  }
  setBlock() {
    this.isReady = false;
  }
  setReject(){
    this.isReady = false;
    while (this.queue.length) {
      const _resolve = this.queue.shift();
      const _reject = this.queue.shift();
      _reject();
    }
  }
}