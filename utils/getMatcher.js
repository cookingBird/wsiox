/**
 * 生成满足ws消息的函数
 * @param {string} condition 消息匹配条件；满足条件的消息将会被回调函数接收；
 * @param {string} key 要匹配消息的字段； 
 * @param {boolean} isReg 是否以正则的方式匹配；
 * @param { function } callback 匹配成功的回调函数；
 * @returns 
 */
export default function (condition,key,callback) {
  const _toString = Object.prototype.toString;
  if (!key || !condition) {
    console.error("condition is ",condition);
    console.error("key is ",key);
    throw Error('matched failure')
  }
  return async (res) => {
    try {
      const result = await res;
      const _key = result[key];
      const isReg = _toString.call(condition) === '[object RegExp]';
      if (!isReg) {
        if (_key === condition) {
          callback(result)
        }
      } else {
        if (condition.test(_key)) {
          callback(result)
        }
      }
    } catch (e) {
      console.error('onmessage error!',e)
    }
  }
}
