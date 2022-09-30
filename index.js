import Interceptor from './core/interceptor';
import Runner from './core/Runner';
import Block from './core/Block';
import getMatcher from './utils/getMatcher';
const interceptor = new Interceptor();
/**
 * @callback listenCallback
 * @param {object} result 接收到的消息
 */
export default class Wsiox {
  /**
   * @constructor
   * @param {string} url websocket的地址
   * @param {onject} wsOptions websocket的option选项
   */
  constructor(url, wsOptions) {
    this._optioHandler(url, wsOptions);
    this.interceptor = interceptor;
    this.websockt = new WebSocket(url, wsOptions);
    this.websockt.onmessage = this._MsgHandler;
    this.websockt.onopen = this._OpenHandler;
    this.runner = new Runner();
    this.blocker = new Block();
  }
  /**
   * 发送消息
   * @param {object} requestOptions websocket.send的参数
   * @param {object} responseOptions 监听消息的options
   * @param {string} responseOptions.condition 消息的匹配字符串
   * @param {string} responseOptions.key 消息的关键字段
   * @param {string} responseOptions.isReg 是否使用正则匹配消息
   */
  async request(requestOptions, responseOptions) {
    await this.blocker.ready();
    try {
      return new Promise((resolve, reject) => {
        const param = this.interceptor.request(requestOptions);
        const remove = this.on(responseOptions, (res) => {
          remove();
          const { code } = res;
          if (code != 200) {
            reject(res);
          } else {
            resolve(this.interceptor.response(res));
          }
        });
        this.websockt.send(param);
      });
    } catch (e) {
      throw Error('request error', e);
    }
  }
  /**
   * 监听消息
   * @param {object} options 监听消息的options
   * @param {string} options.condition 消息的匹配字符串
   * @param {string} options.key 消息的关键字段
   * @param {string} options.isReg 是否使用正则匹配消息
   * @param {listenCallback} callback 接收到消息的回调函数
   */
  on(options, callback) {
    const { condition, key = 'url', isReg = false } = options;
    return this.runner.push(getMatcher(condition, key, isReg, callback));
  }
  /**
   * @description websocket.close
   */
  clsoe() {
    try {
      return this.websockt.close();
    } catch (e) {
      console.error('clsoe websocket error', e);
      return false;
    }
  }
  /**
   * @private
   * @param {object} res 相应的消息
   */
  _MsgHandler(res) {
    this.runner.run(res);
  }
  /**
   * @private
   */
  _OpenHandler() {
    this.blocker.setReady();
  }
  /**
   * @param {string} url websocket的地址
   * @param {onject} wsOptions websocket的option选项
   */
  _optioHandler(url, options) {
    if (!url) {
      throw Error('url error, url is', url);
    }
  }
}
