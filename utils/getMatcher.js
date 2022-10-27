/**
 * 生成满足ws消息的函数
 * @param {object|function} options 消息匹配条件；满足条件的消息将会被回调函数接收；
 * @param {string} defaultKey 要匹配消息的字段； 
 * @param {boolean} isReg 是否以正则的方式匹配；
 * @param { function } callback 匹配成功的回调函数；
 * @param { function } errorCallback 匹配成功的回调函数；
 * @returns 
 */
export default function (options,defaultKey,callback,errorCallback) {
  const _toString = Object.prototype.toString;
  const isRegExp = (condition) => _toString.call(condition) === '[object RegExp]';
  const isFunc = (condition) => _toString.call(condition) === '[object Function]';
  const isString = (condition) => _toString.call(condition) === '[object String]';
  const isObject = (condition) => _toString.call(condition) === '[object Object]';
  if (!defaultKey || !options) {
    throw Error('create matcher function failure')
  }

  if (isFunc(options)) {
    return async function (res) {
      try {
        const result = await res;
        if (options(result)) {
          callback(result)
        }
      } catch (e) {
        const result = e;
        if (options(result)) {
          errorCallback ? errorCallback(result)
            : callback?.(result)
        }
      }
    }
  }
  if (!isObject(options)) {
    throw Error('wsiox on method param[0] error required Func|Object')
  }
  const key = options.key ? options.key : defaultKey;
  const condition = options.condition || options[key];
  if (!isRegExp(condition) && !isString(condition) && !isFunc(condition)) {
    throw Error("wsiox's method on param[0] error, field condition required Reg|String")
  }
  if (isFunc(condition)) {
    return async (res) => {
      try {
        const result = await res;
        if (condition(result)) {
          callback(result)
        }
      } catch (e) {
        const result = e;
        if (condition(result)) {
          errorCallback ? errorCallback(result)
            : callback?.(result)
        }
      }
    }
  } else if (isRegExp(condition)) {
    return async (res) => {
      try {
        const result = await res;
        const _key = result[key];
        if (condition.test(_key)) {
          callback(result)
        }
      } catch (e) {
        const result = e;
        const _key = result[key];
        if (condition.test(_key)) {
          errorCallback ? errorCallback(result)
            : callback?.(result)
        }
      }
    }
  } else {
    return async (res) => {
      try {
        const result = await res;
        const _key = result[key];
        if (_key === condition) {
          callback(result)
        }
      } catch (e) {
        const result = e;
        const _key = result[key];
        if (_key === condition) {
          errorCallback ? errorCallback(result)
            : callback?.(result)
        }
      }
    }
  }
}
