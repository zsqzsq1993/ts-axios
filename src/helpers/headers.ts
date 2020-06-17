import { isPlainObject, deepMerge } from './utils'

function normalizeHeader(headers: any, normalizedName: string): void {
  Object.keys(headers).forEach((key: string) => {
    if (key !== normalizedName && key.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[key]
      delete headers[key]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  if (isPlainObject(data)) {
    normalizeHeader(headers, 'Content-Type')
    if (headers && !headers['Content-Types']) {
      headers['Content-Type'] = 'application/json; charset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  const parsed = Object.create(null)
  if (headers) {
    headers.split('\r\n').forEach(line => {
      let [key, value] = line.split(':')
      if (key) {
        key = key.trim().toLowerCase()
      } else {
        return
      }
      if (value) {
        value = value.trim()
      }
      parsed[key] = value
    })
  }
  return parsed
}

export function flatternHeaders(headers: any, method: string): any {
  if (!headers) {
    return headers
  } else {
    let retHeaders = Object.create(null)
    const methods = ['get', 'head', 'delete', 'options', 'post', 'put', 'patch', 'common']
    retHeaders = deepMerge(headers.common, headers[method], headers)
    methods.forEach(method => {
      delete retHeaders[method]
    })
    return retHeaders
  }
}
