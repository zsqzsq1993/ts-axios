import axios, { AxiosResponse } from '../src'
import { getAjaxRequest } from './helper'

describe('interceptors', () => {
  describe('request interceptors', () => {
    beforeEach(() => {
      jasmine.Ajax.install()
    })

    afterEach(() => {
      jasmine.Ajax.uninstall()
    })

    test('should add a request interceptor', () => {
      const instance = axios.create()
      instance.interceptors.request.use(config => {
        config.headers.test = 'added by interceptor'
        return config
      })
      instance('/foo')
      return getAjaxRequest().then(request => {
        expect(request.requestHeaders.test).toBe('added by interceptor')
      })
    })

    test('should add a request interceptor that return a new config', () => {
      const instance = axios.create()
      instance.interceptors.request.use(config => {
        return {
          url: '/bar',
          method: 'post'
        }
      })
      instance.get('/foo')
      return getAjaxRequest().then(request => {
        expect(request.url).toBe('/bar')
        expect(request.method).toBe('POST')
      })
    })

    test('should add a request interceptor that return a promise', done => {
      const instance = axios.create()
      instance.interceptors.request.use(config => {
        return new Promise(resolve => {
          setTimeout(() => {
            config.headers.test = 'return by promise'
            resolve(config)
          }, 100)
        })
      })
      instance.get('/foo')
      setTimeout(() => {
        getAjaxRequest().then(request => {
          expect(request.url).toBe('/foo')
          expect(request.requestHeaders.test).toBe('return by promise')
          done()
        })
      }, 200)
    })

    test('should add multiple request interceptors', () => {
      const instance = axios.create()
      instance.interceptors.request.use(config => {
        config.headers.test1 = '1'
        return config
      })
      instance.interceptors.request.use(config => {
        config.headers.test2 = '2'
        return config
      })
      instance.interceptors.request.use(config => {
        config.headers.test3 = '3'
        return config
      })
      instance('/foo')
      return getAjaxRequest().then(request => {
        expect(request.requestHeaders.test1).toBe('1')
        expect(request.requestHeaders.test2).toBe('2')
        expect(request.requestHeaders.test3).toBe('3')
      })
    })
  })
  describe('response interceptors', () => {
    beforeEach(() => {
      jasmine.Ajax.install()
    })

    afterEach(() => {
      jasmine.Ajax.uninstall()
    })

    test('should add a response interceptor', done => {
      const instance = axios.create()
      instance.interceptors.response.use(response => {
        response.data += '123'
        return response
      })
      instance('/foo').then(res => {
        expect(res.data).toBe('hello123')
        done()
      })
      getAjaxRequest().then(request => {
        request.respondWith({
          status: 200,
          responseText: 'hello'
        })
      })
    })

    test('should add a respnse interceptor that return a new response', done => {
      const instance = axios.create()
      instance.interceptors.response.use(response => {
        return {
          data: 'stuff',
          headers: null,
          status: 500,
          statusText: 'ERR',
          request: null,
          config: {}
        }
      })
      instance.get('/foo').then(res => {
        expect(res.data).toBe('stuff')
        expect(res.headers).toBeNull()
        expect(res.status).toBe(500)
        expect(res.statusText).toBe('ERR')
        expect(res.request).toBeNull()
        expect(res.config).toEqual({})
        done()
      })
      getAjaxRequest().then(request => {
        request.respondWith({
          status: 200,
          responseText: 'hello'
        })
      })
    })

    test('should add a response interceptor that return a promise', done => {
      const instance = axios.create()
      instance.interceptors.response.use(response => {
        return new Promise(resolve => {
          setTimeout(() => {
            response.data = 'return by promise'
            resolve(response)
          }, 100)
        })
      })
      instance.get('/foo').then(res => {
        expect(res.data).toBe('return by promise')
        done()
      })
      setTimeout(() => {
        getAjaxRequest().then(request => {
          request.respondWith({
            status: 200,
            responseText: 'hello'
          })
        })
      }, 110)
    })

    test('should add multiple response interceptors', done => {
      const instance = axios.create()
      instance.interceptors.response.use(response => {
        response.data += '1'
        return response
      })
      instance.interceptors.response.use(response => {
        response.data += '2'
        return response
      })
      instance.interceptors.response.use(response => {
        response.data += '3'
        return response
      })
      instance('/foo').then(res => {
        expect(res.data).toBe('hello123')
        done()
      })
      getAjaxRequest().then(request => {
        request.respondWith({
          status: 200,
          responseText: 'hello'
        })
      })
    })

    test('should support ejecting an interceptor', done => {
      const instance = axios.create()
      const id = instance.interceptors.response.use(response => {
        response.data += '1'
        return response
      })
      instance.interceptors.response.eject(id)

      instance.interceptors.response.use(response => {
        response.data += '2'
        return response
      })
      instance.interceptors.response.use(response => {
        response.data += '3'
        return response
      })
      instance('/foo').then(res => {
        expect(res.data).toBe('hello23')
        done()
      })
      getAjaxRequest().then(request => {
        request.respondWith({
          status: 200,
          responseText: 'hello'
        })
      })
    })
  })
})
