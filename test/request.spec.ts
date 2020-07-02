import axios, { AxiosResponse, AxiosErr } from '../src'
import { getAjaxRequest } from './helper'

describe('request', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should handle only url as param', () => {
    axios('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/foo')
      expect(request.method).toBe('GET')
    })
  })

  test('should treat method as lowercase string in response', done => {
    axios({
      url: '/foo',
      method: 'POST'
    }).then(response => {
      expect(response.config.method).toBe('post')
      done()
    })
    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200
      })
    })
  })

  test('should reject on Network Error', () => {
    const resolveSpy = jest.fn((response: AxiosResponse) => {
      return response
    })

    const rejectSpy = jest.fn((error: AxiosErr) => {
      return error
    })

    jasmine.Ajax.uninstall()

    return axios('/foo')
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(reason => {
        expect(resolveSpy).not.toBeCalled()
        expect(rejectSpy).toBeCalled()
        expect(reason instanceof Error).toBeTruthy()
        expect((reason as AxiosErr).isAxiosError).toBeTruthy()
        expect((reason as AxiosErr).message).toBe('Network Error.')
        jasmine.Ajax.install()
      })
  })

  test('should reject on Timeout Error', done => {
    const resolveSpy = jest.fn((response: AxiosResponse) => {
      return response
    })

    const rejectSpy = jest.fn((error: AxiosErr) => {
      return error
    })

    axios({
      url: '/foo',
      timeout: 2000
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(reason => {
        expect(resolveSpy).not.toBeCalled()
        expect(rejectSpy).toBeCalled()
        expect(reason instanceof Error).toBeTruthy()
        expect((reason as AxiosErr).isAxiosError).toBeTruthy()
        expect((reason as AxiosErr).message).toBe('Timeout of 2000ms exceeded.')
        expect((reason as AxiosErr).code).toBe('ECONNABORTED')
        done()
      })
    getAjaxRequest().then(request => {
      // @ts-ignore
      request.eventBus.trigger('timeout')
    })
  })

  test('should reject when validateStatus return false', done => {
    const resolveSpy = jest.fn((response: AxiosResponse) => {
      return response
    })

    const rejectSpy = jest.fn((error: AxiosErr) => {
      return error
    })

    axios({
      url: '/foo',
      method: 'POST',
      validateStatus(status) {
        return status !== 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(reason => {
        expect(resolveSpy).not.toBeCalled()
        expect(rejectSpy).toBeCalled()
        expect(reason instanceof Error).toBeTruthy()
        expect((reason as AxiosErr).isAxiosError).toBeTruthy()
        expect((reason as AxiosErr).message).toBe('Request failed with status code 500')
        done()
      })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500
      })
    })
  })

  test('should resolve when validateStatus return true', done => {
    const resolveSpy = jest.fn((response: AxiosResponse) => {
      return response
    })

    const rejectSpy = jest.fn((error: AxiosErr) => {
      return error
    })

    axios({
      url: '/foo',
      method: 'POST',
      validateStatus(status) {
        return status === 500
      }
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(reason => {
        expect(resolveSpy).toBeCalled()
        expect(rejectSpy).not.toBeCalled()
        expect((reason as AxiosResponse).status).toBe(500)
        expect((reason as AxiosResponse).statusText).toBe('ok')
        done()
      })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 500,
        statusText: 'ok'
      })
    })
  })

  test('should return JSON when resolving', done => {
    const resolveSpy = jest.fn((response: AxiosResponse) => {
      return response
    })

    const rejectSpy = jest.fn((error: AxiosErr) => {
      return error
    })

    axios({
      url: '/foo',
      method: 'post'
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(reason => {
        expect(resolveSpy).toBeCalled()
        expect(rejectSpy).not.toBeCalled()
        expect((reason as AxiosResponse).data).toEqual({ errno: 0 })
        done()
      })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"errno": 0}'
      })
    })
  })

  test('should return JSON when rejecting', done => {
    const resolveSpy = jest.fn((response: AxiosResponse) => {
      return response
    })

    const rejectSpy = jest.fn((error: AxiosErr) => {
      return error
    })

    axios({
      url: '/foo',
      method: 'post'
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(reason => {
        expect(resolveSpy).not.toBeCalled()
        expect(rejectSpy).toBeCalled()
        expect((reason as AxiosErr).response.data.errno).toBe(-1)
        done()
      })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 400,
        statusText: 'bad request',
        responseText: '{"errno": -1}'
      })
    })
  })

  test('should supply correct response', done => {
    const resolveSpy = jest.fn((response: AxiosResponse) => {
      return response
    })

    const rejectSpy = jest.fn((error: AxiosErr) => {
      return error
    })

    axios({
      url: '/foo',
      method: 'post'
    })
      .then(resolveSpy)
      .catch(rejectSpy)
      .then(reason => {
        expect(resolveSpy).toBeCalled()
        expect(rejectSpy).not.toBeCalled()
        expect((reason as AxiosResponse).data.name).toBe('zhang')
        expect((reason as AxiosResponse).status).toBe(200)
        expect((reason as AxiosResponse).statusText).toBe('OK')
        expect((reason as AxiosResponse).headers['content-type']).toBe('application/json')
        done()
      })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        statusText: 'OK',
        responseText: '{"name": "zhang"}',
        responseHeaders: {
          'Content-Type': 'application/json'
        }
      })
    })
  })

  test('should Content-Type header case-insensitive', () => {
    let response: AxiosResponse

    axios.post(
      '/foo',
      { prop: 'value' },
      {
        headers: {
          'content-type': 'application/json'
        }
      }
    )

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders['Content-Type']).toBe('application/json')
    })
  })

  test('should support array buffer response', done => {
    let response: AxiosResponse

    function str2ab(str: string) {
      const buff = new ArrayBuffer(str.length * 2)
      const view = new Uint16Array(buff)
      for (let i = 0; i < str.length; i++) {
        view[i] = str.charCodeAt(i)
      }
      return buff
    }

    axios('/foo', {
      responseType: 'arraybuffer'
    }).then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        // @ts-ignore
        response: str2ab('Hello world')
      })

      setTimeout(() => {
        expect(response.data.byteLength).toBe(22)
        done()
      }, 100)
    })
  })

  test('test responseType', done => {
    axios({
      url: '/foo',
      responseType: 'text'
    }).then(res => {
      expect(res.data).toBe('hello')
      done()
    })

    getAjaxRequest().then(req => {
      req.respondWith({
        status: 200,
        responseText: 'hello'
      })
    })
  })
})
