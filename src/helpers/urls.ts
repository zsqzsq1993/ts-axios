import { isArray, isDate, isPlainObject } from './utils'

/**
 * these character do not need to transfer
 * so decode them back after encodeURIComponent
 * there is no standard for that
 * axios team makes this standard
 * @param params
 */
function encode(params: string): string {
  return encodeURIComponent(params)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+') // decode space back to +
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function concatURL(url: string, params?: any): string {
  let paramsList: string[] = []

  if (!params) {
    return url
  }

  const hashIndex = url.indexOf('#')
  if (hashIndex !== -1) {
    url = url.slice(0, hashIndex)
  }

  Object.keys(params).forEach((key: string) => {
    let param = params[key]
    if (param === null || typeof param === 'undefined') {
      return
    }
    if (isArray(param)) {
      key += '[]'
    } else {
      param = [param]
    }

    param.forEach((item: any) => {
      if (isDate(item)) {
        item = item.toISOString()
      } else if (isPlainObject(item)) {
        item = JSON.stringify(item)
      }
      paramsList.push(`${encode(key)}=${encode(item)}`)
    })
  })

  url += url.indexOf('?') === -1 ? '?' : '&'
  return url + paramsList.join('&')
}
