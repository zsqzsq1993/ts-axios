import { transformResponse, transformRequest } from '../../src/helpers/data'

describe('helpers:data', () => {
  describe('transformRequest', () => {
    test('should return JSON string if plain object', () => {
      const a = { b: 'hello' }
      expect(transformRequest(a)).toBe('{"b":"hello"}')
    })

    test('should do nothing if not plain object', () => {
      const a = new Date()
      expect(transformRequest(a)).toBe(a)
    })
  })

  describe('transformResponse', () => {
    test('should transfer to plain object if JSON string', () => {
      expect(transformResponse('{"b": "hello"}')).toEqual({ b: 'hello' })
    })

    test('should do nothing if string but not JSON string', () => {
      const a = '{a: "hello"}'
      expect(transformResponse(a)).toEqual(a)
    })

    test('should do nothing if not string', () => {
      const a = { b: 1 }
      expect(transformResponse(a)).toEqual(a)
    })
  })
})
