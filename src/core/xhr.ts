import { RequestConfig, AxiosPromise, AxiosResponse } from '../type'
import { parseHeaders } from '../helpers/headers'
import { createAxiosError } from '../helpers/errors'
import { isCancel } from '../cancel/Cancel'
import { isURLSameOrigin } from '../helpers/urls'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

export function xhr(config: RequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      method = 'get',
      url,
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    processConfig()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    function processConfig() {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = true
      }
    }

    function addEvents() {
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
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
    }

    function processHeaders() {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if (auth) {
        const { username, password } = auth
        const base64 = btoa(`${username}:${password}`)
        headers['Authorization'] = `Basic ${base64}`
      }

      Object.keys(headers).forEach((key: string) => {
        if (data === null && key.toLowerCase() === 'content-type') {
          delete headers[key]
        } else {
          request.setRequestHeader(key, headers[key])
        }
      })

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName && xsrfHeaderName) {
        const cookieVal = cookie.read(xsrfCookieName)
        if (cookieVal) {
          headers[xsrfHeaderName] = cookieVal
        }
      }
    }

    function processCancel() {
      if (cancelToken) {
        cancelToken.throwIfRequested()

        cancelToken.promise.then(reason => {
          if (isCancel(reason)) {
            request.abort()
            reject(reason)
          }
        })
      }
    }

    function handleResponse(response: AxiosResponse) {
      const status = response.status
      if (!validateStatus || validateStatus(status)) {
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
