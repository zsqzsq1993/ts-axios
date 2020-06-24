import axios from '../src'
import { getAjaxRequest } from './helper'
import { response } from 'express'

function testHeaderValue(headers: any, key: string, val?: any) {
  if (typeof val === 'undefined') {
    expect(headers.hasOwnProperty(key)).toBeFalsy()
    return
  }

  let found = false

  for (let k in headers) {
    if (k.toLowerCase() === key.toLowerCase()) {
      expect(headers[k]).toBe(val)
      found = true
      break
    }
  }

  if (!found) {
    throw new Error(`should find ${val} but not found.`)
  }
}

describe('headers', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should use default common headers', () => {
    const defaults = axios.defaults.headers.common
    axios('/foo')
    return getAjaxRequest().then(request => {
      const headers = request.requestHeaders
      Object.keys(headers).forEach(key => {
        expect(defaults[key] === headers[key]).toBeTruthy()
      })
    })
  })

  test('should add additional header for post', () => {
    axios.post('/foo', 'a=b')
    return getAjaxRequest().then(request => {
      const headers = request.requestHeaders
      testHeaderValue(headers, 'Content-Type', 'application/x-www-form-urlencoded')
    })
  })

  test('should add application/json if data obejct is provided', () => {
    axios.post('/foo', {
      first: 'dolly',
      last: 'zhang'
    })
    return getAjaxRequest().then(request => {
      const headers = request.requestHeaders
      testHeaderValue(headers, 'content-type', 'application/json;charset=utf-8')
    })
  })

  test('should remove content-type if data is empty', () => {
    axios.post('/foo')
    return getAjaxRequest().then(request => {
      const headers = request.requestHeaders
      testHeaderValue(headers, 'content-type', undefined)
    })
  })

  test('should preserve content-type if data is false', () => {
    axios.post('/foo', false).then(res => {
      // console.log(res.config)
    })
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
      const headers = request.requestHeaders
      testHeaderValue(headers, 'Content-Type', 'application/x-www-form-urlencoded')
    })
  })

  test('should remove content-type if data is FormData', () => {
    const data = new FormData()
    data.append('foo', 'bar')

    axios.post('/foo', data)

    return getAjaxRequest().then(request => {
      testHeaderValue(request.requestHeaders, 'Content-Type', undefined)
    })
  })
})
