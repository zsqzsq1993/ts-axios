import { RequestConfig, AxiosPromise, Method } from '../type'
import dispathRequest from './dispatchRequest'

class Axios {
  request(config: RequestConfig): AxiosPromise {
    return dispathRequest(config)
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
