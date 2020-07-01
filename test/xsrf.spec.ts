import axios from '../src'
import { getAjaxRequest } from './helper'

describe('xsrf', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
    document.cookie = 'expires=' + new Date(Date.now() - 1000).toUTCString()
  })

  test('should not set xsrf headers if cookie is not set', () => {
    axios('/foo')
    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf headers if cookie is set', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=helloworld'
    axios('/foo')
    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('helloworld')
    })
  })

  test('should not set xsrf headers if cross origin', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=helloworld'
    axios('http://example.com')
    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[axios.defaults.xsrfHeaderName!]).toBeUndefined()
    })
  })

  test('should set xsrf headers if cross origin and withCredetials', () => {
    document.cookie = axios.defaults.xsrfCookieName + '=helloworld'
    axios('http://example.com', {
      withCredentials: true
    })
    return getAjaxRequest().then(req => {
      expect(req.requestHeaders[axios.defaults.xsrfHeaderName!]).toBe('helloworld')
    })
  })
})
