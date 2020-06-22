import { RequestConfig } from '../type'

const toString = Object.prototype.toString

export function isArray(value: any): boolean {
  return Array.isArray(value)
}

export function isPlainObject(value: any): value is Object {
  return toString.call(value) === '[object Object]'
}

export function isDate(value: any): value is Date {
  return toString.call(value) === '[object Date]'
}

export function isFormData(value: any): value is FormData {
  return value !== 'undefined' && value instanceof FormData
}

export function isURLSearchParmas(value: any): value is URLSearchParams {
  return value !== 'undefined' && value instanceof URLSearchParams
}

export function extend<T, U>(to: T, from: U): T & U {
  for (let key in from) {
    const value = from[key]
    ;(to as T & U)[key] = value as any
  }
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  let merged = Object.create(null)

  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const value = obj[key]
        if (isPlainObject(value)) {
          if (isPlainObject(merged[key])) {
            merged[key] = deepMerge(merged[key], value)
          } else {
            merged[key] = deepMerge({}, value)
          }
        } else {
          merged[key] = value
        }
      })
    }
  })
  return merged
}
