import { parseHeaders, processHeaders, flatternHeaders } from '../../src/helpers/headers'

describe('helpers:headers', () => {
  describe('parseHeaders', () => {
    test('should parse headers from string', () => {
      const parsed = parseHeaders(
        'Content-type: applycation/json\r\n' +
          'Connection: keep-alive\r\n' +
          'Transfer-Encoding: chunked\r\n' +
          'Date: Tue, 21 May 2019 09:23:44 GMT\r\n' +
          ':aa\r\n' +
          'key:'
      )
      expect(parsed['content-type']).toBe('applycation/json')
      expect(parsed['connection']).toBe('keep-alive')
      expect(parsed['transfer-encoding']).toBe('chunked')
      expect(parsed['date']).toBe('Tue, 21 May 2019 09:23:44 GMT')
      expect(parsed['key']).toBe('')
    })

    test('should return null if not headers', () => {
      expect(parseHeaders('')).toEqual({})
    })
  })

  describe('processHeaders', () => {
    const data = {
      a: 1,
      b: 2
    }
    const dataString = 'hello'
    test('only handle plain object', () => {
      expect(processHeaders({}, dataString)['Content-Type']).toBeUndefined()
      expect(processHeaders({}, data)['Content-Type']).toBe('application/json;charset=utf-8')
    })

    test('should normalize content-type', () => {
      const headers = {
        'content-type': 'text'
      }
      expect(processHeaders(headers, data)['Content-Type']).toBe('text')
      expect(processHeaders(headers, data)['content-type']).toBeUndefined()
      expect(processHeaders(headers, data)['content-Type']).toBeUndefined()
      expect(processHeaders(headers, data)['Content-type']).toBeUndefined()
    })

    test('do nothing if headers to be null or undefined', () => {
      expect(processHeaders(undefined, data)).toBeUndefined()
      expect(processHeaders(null, data)).toBeNull()
    })

    test('normal case', () => {
      expect(processHeaders({}, data)['Content-Type']).toBe('application/json;charset=utf-8')
    })
  })

  describe('flatternHeaders', () => {
    test('should flattern the headers and include common headers', () => {
      const headers = {
        Accept: 'application/json',
        common: {
          'X-COMMON-HEADER': 'commonHeaderValue'
        },
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        },
        post: {
          'X-POST-HEADER': 'postHeaderValue'
        }
      }

      expect(flatternHeaders(headers, 'get')).toEqual({
        Accept: 'application/json',
        'X-COMMON-HEADER': 'commonHeaderValue',
        'X-GET-HEADER': 'getHeaderValue'
      })
    })

    test('should flattern the headers without common headers', () => {
      const headers = {
        Accept: 'application/json',
        get: {
          'X-GET-HEADER': 'getHeaderValue'
        }
      }

      expect(flatternHeaders(headers, 'patch')).toEqual({
        Accept: 'application/json'
      })
    })

    test('should do nothing if headers is undefined or null', () => {
      expect(flatternHeaders(undefined, 'get')).toBeUndefined()
      expect(flatternHeaders(null, 'post')).toBeNull()
    })
  })
})
