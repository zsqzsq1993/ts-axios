import axios from '../src'
import { getAjaxRequest } from './helper'

describe('instance', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should make http request without verb', () => {
    const instance = axios.create()
    instance('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test(`should make a http get request`, () => {
    const instance = axios.create()
    instance.get('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test(`should make a http head request`, () => {
    const instance = axios.create()
    instance.head('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('HEAD')
    })
  })

  test(`should make a http options request`, () => {
    const instance = axios.create()
    instance.options('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('OPTIONS')
    })
  })

  test(`should make a http delete request`, () => {
    const instance = axios.create()
    instance.delete('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('DELETE')
    })
  })

  test(`should make a http post request`, () => {
    const instance = axios.create()
    instance.post('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('POST')
    })
  })

  test(`should make a http put request`, () => {
    const instance = axios.create()
    instance.put('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('PUT')
    })
  })

  test(`should make a http patch request`, () => {
    const instance = axios.create()
    instance.patch('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('PATCH')
    })
  })

  test(`should have default headers`, () => {
    const instance = axios.create()
    expect(typeof instance.defaults.headers).toBe('object')
    expect(typeof instance.defaults.headers.common).toBe('object')
  })

  test('should have interceptors', () => {
    axios.interceptors.request.use(config => {
      config.timeout = 2000
      return config
    })
    const instance = axios.create()
    instance.interceptors.request.use(config => {
      config.withCredentials = true
      return config
    })
    instance('/foo')
    return getAjaxRequest().then(request => {
      expect(request.withCredentials).toBeTruthy()
      expect(request.timeout).toBe(0)
    })
  })

  test('should get the concat URL', () => {
    const url = axios.getUri({
      baseURL: 'https://github',
      url: 'zsqzsq1993',
      params: {
        first: 'dolly',
        last: 'zhang'
      }
    })
    expect(url).toBe('https://github/zsqzsq1993?first=dolly&last=zhang')
  })
})
