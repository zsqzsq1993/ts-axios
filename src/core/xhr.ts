import { RequestConfig, AxiosPromise, AxiosResponse } from '../type'
import { parseHeaders } from '../helpers/headers'
import { createAxiosError } from '../helpers/errors'
import { isCancel } from '../cancel/Cancel'

export function xhr(config: RequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { method = 'get', url, data, headers, responseType, timeout, cancelToken } = config
    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url!, true)

    if (cancelToken) {
      cancelToken.throwIfRequested()

      cancelToken.promise.then(reason => {
        if (isCancel(reason)) {
          request.abort()
          reject(reason)
        }
      })
    }

    if (data !== null) {
      Object.keys(headers).forEach((key: string) => {
        request.setRequestHeader(key, headers[key])
      })
      request.send(data)
    } else {
      request.send()
    }

    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return
      }

      // when timeout and network error
      // status equals 0
      if (request.status === 0) {
        return
      }

      const status = request.status
      const statusText = request.statusText
      const headers = parseHeaders(request.getAllResponseHeaders())
      const data = responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        status,
        statusText,
        headers,
        data,
        config,
        request
      }

      handleResponse(response)
    }

    request.onerror = () => {
      const err = createAxiosError({
        message: 'Network Error.',
        config,
        request,
        code: null
      })
      reject(err)
    }

    request.ontimeout = () => {
      const err = createAxiosError({
        message: `Timeout of ${timeout}ms exceeded.`,
        config,
        request,
        code: 'ECONNABORTED'
      })
      reject(err)
    }

    function handleResponse(response: AxiosResponse) {
      const status = response.status
      if (status >= 200 && status <= 300) {
        resolve(response)
      } else {
        const err = createAxiosError({
          message: `Request failed with status code ${status}`,
          config,
          request,
          response,
          code: null
        })
        reject(err)
      }
    }
  })
}
