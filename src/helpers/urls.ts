import { isArray, isDate, isPlainObject, isURLSearchParmas } from './utils'

interface ParsedURL {
  protocol: string
  host: string
}

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

export function concatURL(
  url: string,
  params?: any,
  paramsSerializer?: (value: any) => string
): string {
  if (!params) {
    return url
  }

  let serializedParams

  const hashIndex = url.indexOf('#')
  if (hashIndex !== -1) {
    url = url.slice(0, hashIndex)
  }

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParmas(params)) {
    serializedParams = params.toString()
  } else {
    let paramsList: string[] = []
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

    serializedParams = paramsList.join('&')
  }

  url += url.indexOf('?') === -1 ? '?' : '&'
  return url + serializedParams
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedURL = resolveURL(requestURL)
  return origin.protocol === parsedURL.protocol && origin.host === parsedURL.host
}

export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\.\+\-]*:)?\/\//i.test(url)
}

export function concatBaseURL(baseURL: string, url: string): string {
  return baseURL.replace(/\/+$/, '') + '/' + url.replace(/^\/+/, '')
}

function resolveURL(url: string): ParsedURL {
  urlNode.setAttribute('href', url)
  const { protocol, host } = urlNode
  return {
    protocol,
    host
  }
}

const urlNode = document.createElement('a')
const origin = resolveURL(window.location.href)
