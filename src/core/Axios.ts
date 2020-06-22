import { RequestConfig, AxiosPromise, Method, AxiosResponse } from '../type'
import dispathRequest, { transformURL } from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

class Axios {
  defaults: RequestConfig

  interceptors: {
    request: InterceptorManager<RequestConfig>
    response: InterceptorManager<AxiosResponse>
  }

  constructor(defaults: RequestConfig) {
    this.defaults = defaults

    this.interceptors = {
      request: new InterceptorManager<RequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }

    config = mergeConfig(this.defaults, config)

    const taskQueue: any[] = [
      {
        resolvedFn: dispathRequest,
        rejectedFn: null
      }
    ]

    this.interceptors.request.forEach(interceptors => {
      taskQueue.unshift(interceptors)
    })

    this.interceptors.response.forEach(interceptors => {
      taskQueue.push(interceptors)
    })

    let promise = Promise.resolve(config)
    while (taskQueue.length) {
      const { resolvedFn, rejectedFn } = taskQueue.shift()
      promise = promise.then(resolvedFn, rejectedFn)
    }

    return promise
  }

  getUri(config: RequestConfig) {
    return transformURL(config)
  }

  get(url: string, config?: RequestConfig): AxiosPromise {
    return this._requestWithoutData(url, 'get', config)
  }

  head(url: string, config?: RequestConfig): AxiosPromise {
    return this._requestWithoutData(url, 'head', config)
  }

  delete(url: string, config?: RequestConfig): AxiosPromise {
    return this._requestWithoutData(url, 'delete', config)
  }

  options(url: string, config?: RequestConfig): AxiosPromise {
    return this._requestWithoutData(url, 'options', config)
  }

  post(url: string, data?: any, config?: RequestConfig) {
    return this._requestWithData(url, 'post', data, config)
  }

  put(url: string, data?: any, config?: RequestConfig) {
    return this._requestWithData(url, 'put', data, config)
  }

  patch(url: string, data?: any, config?: RequestConfig) {
    return this._requestWithData(url, 'patch', data, config)
  }

  _requestWithoutData(url: string, method: Method, config?: RequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method
      })
    )
  }

  _requestWithData(url: string, method: Method, data?: any, config?: RequestConfig): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        url,
        method,
        data
      })
    )
  }
}

export default Axios
