import axios, { AxiosTransformer } from '../src'
import { getAjaxRequest } from './helper'

describe('transform', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transfer object to json string in default transformRequest', () => {
    axios.post('/foo', {
      a: 1
    })
    return getAjaxRequest().then(req => {
      expect(req.params).toBe('{"a":1}')
    })
  })

  test('should transfer json string to object in default transformResponse', done => {
    axios.post('/foo').then(res => {
      expect(res.data).toEqual({ a: 1 })
      done()
    })
    getAjaxRequest().then(req => {
      req.respondWith({
        status: 200,
        responseText: '{"a": 1}'
      })
    })
  })

  test('should allow override default transform', () => {
    const instance = axios.create({
      transformRequest(data) {
        return data
      }
    })
    instance.post('/foo', {
      a: 1
    })
    return getAjaxRequest().then(req => {
      expect(req.params).toEqual({ a: 1 })
    })
  })

  test('should allow array as transform', () => {
    axios({
      url: '/foo',
      method: 'POST',
      data: { a: 'hello' },
      transformRequest: (axios.defaults.transformRequest as AxiosTransformer[]).concat(data => {
        return data.replace('hello', 'hi')
      })
    })
    return getAjaxRequest().then(req => {
      expect(req.params).toBe('{"a":"hi"}')
    })
  })

  test('should allow edit headers in transform', () => {
    axios({
      url: '/foo',
      method: 'POST',
      data: { a: 'hello' },
      transformRequest(data, headers) {
        headers['hello'] = 'hi'
        return data
      }
    })
    return getAjaxRequest().then(req => {
      expect(req.requestHeaders['hello']).toBe('hi')
    })
  })
})
