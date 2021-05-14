const cookie = {
  expireSec: 3600 * 24 * 7,
  __parseCookie: function (cookieStr) {
    const res = {}
    if (!cookieStr.endsWith(';')) {
      cookieStr += ';'
    }

    while (cookieStr.length > 1) {
      const ie = cookieStr.indexOf('=')
      const is = cookieStr.indexOf(';')

      const key = cookieStr.substring(0, ie)
      const value = cookieStr.substring(ie + 1, is)
      res[key.trim()] = value

      cookieStr = cookieStr.substring(is + 1)
    }
    return res
  },
  get: function (name) {
    return this.__parseCookie(document.cookie)[name]
  },
  set: function (name, value, expireSeconds) {
    let expireDate = null
    if (expireSeconds === undefined) {
      expireDate = new Date(Date.now() + 7 * 24 * 3600 * 1000)
    } else {
      expireDate = new Date(Date.now() + expireSeconds)
    }

    const tmpCookie = name + '=' + value + '; Expires=' + expireDate + '; SameSite=Strict; Path=/'
    document.cookie = tmpCookie
  }
}

export default cookie;
