import Interceptor from './core/Interceptor';
import Runner from './core/Runner';
import Block from './core/Block';
import getMatcher from '../utils/getMatcher';
/**
 * @callback listenCallback
 * @param {object} result 接收到的消息
 */
export default class Wsiox {
  /**
   * @param {string} url websocket的地址
   * @param {object} options websocket的option选项
   */
  constructor(url, options = {}) {
    this._optionHandler(url, options);
    this.default = {
      key: options.uniqueKey || 'path'
    };
    this.options = options;
    this.interceptor = new Interceptor();
    this.runner = new Runner();
    this.blocker = new Block();
    this.websocket = new WebSocket(url, options.protocols);
    this.websocket.onmessage = (res) => { this._MsgHandler(res) };
    this.websocket.onopen = (res) => { this._OpenHandler() };
    const contentType = options.contentType || 'json';
    if (contentType === 'json') {
      this.interceptor.response.use((res) => (JSON.parse(res)));
    }
  }
  /**
   * 发送消息
   * @param {object} requestOptions websocket.send的参数
   */
  async request(requestOptions) {
    await this.blocker.ready();
    return new Promise((resolve, reject) => {
      const remove = this.on(
        requestOptions,
        (res) => {
          remove();
          resolve(res);
        },
        (res) => {
          remove();
          reject(res);
        }
      );
      this._MsgSender(requestOptions);
    });
  }

  /**
   * 监听消息
   * @param {object|function} options 监听消息的options
   * @param {string|regexp} options.condition 消息的匹配条件
   * @param {string|'path'} options.key 匹配条件所在的字段
   * @param {listenCallback} callback 接收到消息的回调函数
   * @param {listenCallback} errorCallback 接收错误到消息的回调函数
   */
  on(options, callback, errorCallback) {
    const cb = getMatcher(options, this.default.key, callback, errorCallback);
    return this.runner.push(cb);
  }
  /**
   * @description websocket.close
   */
  close() {
    try {
      const res = this.websocket.close();
      this.runner = [];
      this.blocker.setBlock();
      return res;
    } catch (e) {
      console.error('close websocket error', e);
      return false;
    }
  }
  /**
   * @private
   * @param {object} res 相应的消息
   */
  _MsgHandler(res) {
    const result = this.interceptor.response.run(res.data);
    this.runner.run(result);
  }
  /**
   * @private
   * @param {object} res 相应的消息
   */
  _MsgSender(data) {
    const msg = this.options.contentType === 'json'
      ? JSON.stringify(this.interceptor.request.run(data))
      : this.interceptor.request.run(data);
    this.websocket.send(msg);
  }
  /**
   * @private
   */
  _OpenHandler() {
    this.blocker.setReady();
  }
  /**
   * @param {string} url websocket的地址
   * @param {object} wsOptions websocket的option选项
   */
  _optionHandler(url, options) {
    if (!url) {
      throw Error('url error, url is', url);
    }
    if (url.startsWith('http:')) {
      throw Error('url error, url is', url);
    }
  }
}
