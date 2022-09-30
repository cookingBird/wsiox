/**
 * 生成满足ws消息的函数
 * @param {string} matchCondition 消息匹配条件；满足条件的消息将会被回调函数接收；
 * @param {string} key 要匹配消息的字段； 
 * @param {boolean} isReg 是否以正则的方式匹配；
 * @param { function } callback 匹配成功的回调函数；
 * @returns 
 */
export default function (matchCondition, key, isReg, callback) {
  return (res) => {
    try {
      const _key = res[key];
      if (!_key) { console.warn("message matcher don't exist, matchCondition is ", matchCondition) }
      if (!isReg) {
        if (_key == matchCondition) {
          callback(res)
        }
      } else {
        if (new RegExp(matchCondition).test(_key)) {
          callback(res)
        }
      }
    } catch (e) {
      console.error('onmessage error!', e)
    }
  }
}