import {
  isURLSearchParmas,
  isFormData,
  isPlainObject,
  isArray,
  isDate,
  extend,
  deepMerge
} from '../../src/helpers/utils'

describe('helpers:utils', () => {
  describe('isXXX', () => {
    test('isDate', () => {
      expect(isDate(new Date())).toBeTruthy()
      expect(isDate('2020-05-09')).toBeFalsy()
    })

    test('isArray', () => {
      expect(isArray([])).toBeTruthy()
      expect(isArray(Array())).toBeTruthy()
      expect(isArray({})).toBeFalsy()
    })

    test('isPlainObject', () => {
      expect(isPlainObject({})).toBeTruthy()
      expect(isPlainObject(Object.create(null))).toBeTruthy()
    })

    test('isFormData', () => {
      expect(isFormData(new FormData())).toBeTruthy()
      expect(isFormData({})).toBeFalsy()
    })

    test('isURLSearchParams', () => {
      expect(isURLSearchParmas(new URLSearchParams())).toBeTruthy()
      expect(isURLSearchParmas('?a=1&b=2')).toBeFalsy()
    })
  })

  describe('extend', () => {
    test('should be mutable', () => {
      let a = Object.create(null)
      let b = {
        first: 'dolly'
      }
      extend(a, b)
      expect(a.first).toBe('dolly')
    })

    test('should override and return', () => {
      let a = { a: 123, b: 456 }
      let b = { b: 789 }
      const c = extend(a, b)
      expect(c.a).toBe(123)
      expect(c.b).toBe(789)
    })
  })

  describe('deepMerge', () => {
    test('should be immutable', () => {
      let a: any = { foo: 123 }
      let b: any = { bar: 456 }
      const c = deepMerge(a, b)
      expect(typeof a.bar).toBe('undefined')
      expect(typeof b.foo).toBe('undefined')
      expect(c).toEqual({
        foo: 123,
        bar: 456
      })
    })

    test('should deep merge and override', () => {
      let a = { a: 1, b: 2, c: 3 }
      let b = { a: 4, b: 6, d: 9 }
      const c = deepMerge(a, b)
      expect(c).toEqual({
        a: 4,
        b: 6,
        c: 3,
        d: 9
      })
    })

    test('should deep merge recursively', () => {
      let a = {
        name: {
          first: 'dolly',
          last: 'zhang'
        },
        age: 20
      }
      let b = {
        name: {
          first: 'Vera'
        },
        job: {
          previous: 'audit',
          now: 'housewife'
        }
      }
      const c = deepMerge(a, b)
      expect(c).toEqual({
        name: {
          first: 'Vera',
          last: 'zhang'
        },
        age: 20,
        job: {
          previous: 'audit',
          now: 'housewife'
        }
      })
    })

    test('should remove all references from nested objects', () => {
      let a = { foo: { bar: 123 } }
      let b = Object.create(null)
      const c = deepMerge(a, b)
      expect(c).toEqual({ foo: { bar: 123 } })
      expect(c.foo).not.toBe(a.foo)
    })

    test('should handle null and undefined arguments', () => {
      expect(deepMerge(undefined, undefined)).toEqual({})
      expect(deepMerge({ a: 1 }, undefined)).toEqual({ a: 1 })
      expect(deepMerge(undefined, { a: 1 })).toEqual({ a: 1 })

      expect(deepMerge(null, null)).toEqual({})
      expect(deepMerge({ a: 1 }, null)).toEqual({ a: 1 })
      expect(deepMerge(null, { a: 1 })).toEqual({ a: 1 })
    })
  })
})
