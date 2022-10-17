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
   * @param {object} wsOptions websocket的option选项
   */
  constructor(url,wsOptions) {
    this._optionHandler(url,wsOptions);
    this.interceptor = interceptor;
    this.websocket = new WebSocket(url,wsOptions);
    this.websocket.onmessage = this._MsgHandler;
    this.websocket.onopen = this._OpenHandler;
    this.runner = new Runner();
    this.blocker = new Block();
    this.default = {};
  }
  /**
   * 发送消息
   * @param {object} requestOptions websocket.send的参数
   * @param {object} responseOptions 监听消息的options
   * @param {string} responseOptions.condition 消息的匹配字符串
   * @param {string} responseOptions.key 消息的关键字段
   * @param {string} responseOptions.isReg 是否使用正则匹配消息
   */
  async request (requestOptions,responseOptions) {
    await this.blocker.ready();
    try {
      return new Promise((resolve,reject) => {
        const param = this.interceptor.request(requestOptions);
        const remove = this.on(responseOptions,(res) => {
          remove();
          resolve(this.interceptor.response(res));
        });
        this.websocket.send(param);
      });
    } catch (e) {
      throw Error('request error',e);
    }
  }
  /**
   * 监听消息
   * @param {object} options 监听消息的options
   * @param {string|regexp} options.condition 消息的匹配字符串
   * @param {string} options.key 消息的关键字段
   * @param {listenCallback} callback 接收到消息的回调函数
   */
  on (options,callback) {
    const { condition,key } = options;
    return this.runner.push(
      getMatcher(condition,key || this.default.key || 'url',callback)
    );
  }
  /**
   * @description websocket.close
   */
  close () {
    try {
      return this.websocket.close();
    } catch (e) {
      console.error('close websocket error',e);
      return false;
    }
  }
  /**
   * @private
   * @param {object} res 相应的消息
   */
  _MsgHandler (res) {
    this.runner.run(res);
  }
  /**
   * @private
   */
  _OpenHandler () {
    this.blocker.setReady();
  }
  /**
   * @param {string} url websocket的地址
   * @param {object} wsOptions websocket的option选项
   */
  _optionHandler (url,options) {
    if (!url) {
      throw Error('url error, url is',url);
    }
  }
}
