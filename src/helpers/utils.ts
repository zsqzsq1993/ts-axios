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

export function extend<T, U>(to: T, from: U): T & U {
  for (let key in from) {
    const value = from[key]
    ;(to as T & U)[key] = value as any
  }
  return to as T & U
}
