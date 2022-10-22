import Interceptor from './core/Interceptor';
import Runner from './core/Runner';
import Block from './core/Block';
import getMatcher from './utils/getMatcher';
/**
 * @callback listenCallback
 * @param {object} result 接收到的消息
 */
export default class Wsiox {
  /**
   * @param {string} url websocket的地址
   * @param {object} options websocket的option选项
   */
  constructor(url,options) {
    this._optionHandler(url,options);
    this.default = {
      key: 'path'
    }
    this.interceptor = new Interceptor();
    this.runner = new Runner();
    this.blocker = new Block();
    this.websocket = new WebSocket(url,options);
    this.websocket.onmessage = (res) => { this._MsgHandler(res) };
    this.websocket.onopen = (res) => { this._OpenHandler() };
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
        const remove = this.on(
          requestOptions,
          (res) => {
            remove();
            resolve(res);
          }
        );
        this._MsgSender(requestOptions);
      });
    } catch (e) {
      throw Error('request error',e);
    }
  }

  /**
   * 监听消息
   * @param {object} options 监听消息的options
   * @param {string|regexp|options.path} options.condition 消息的匹配条件
   * @param {string|'path'} options.key 匹配条件所在的字段
   * @param {listenCallback} callback 接收到消息的回调函数
   */
  on (options,callback) {
    const key = options.key ? options.key : this.default.key;
    const condition = options.condition || options[key];
    const cb = getMatcher(condition,key,callback);
    return this.runner.push(cb);
  }
  /**
   * @description websocket.close
   */
  close () {
    try {
      const res = this.websocket.close();
      this.runner = [];
      this.blocker.setBlock();
      return res;
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
    const result = this.interceptor.response.run(res.data);
    this.runner.run(result);
  }
  /**
   * @private
   * @param {object} res 相应的消息
   */
  _MsgSender (data) {
    this.websocket.send(this.interceptor.request.run(data));
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
    if (url.startsWith('http:')) {
      throw Error('url error, url is',url);
    }
  }
}
