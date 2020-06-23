import { RequestConfig } from '../type'
import { processHeaders } from '../helpers/headers'
import { transformRequest, transformResponse } from '../helpers/data'

const defaultConfig: RequestConfig = {
  method: 'get',

  timeout: 0,

  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },

  transformRequest: [
    function(data, headers) {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ],

  transformResponse: [
    function(data: any) {
      return transformResponse(data)
    }
  ],

  xsrfCookieName: 'X-XSRF-TOKEN',

  xsrfHeaderName: 'X-X-XSRF-TOKEN',

  validateStatus(status) {
    return status >= 200 && status < 300
  }
}

const noDataMethods = ['get', 'head', 'delete', 'options']

const dataMethods = ['post', 'put', 'patch']

noDataMethods.forEach(method => {
  defaultConfig.headers[method] = {}
})

dataMethods.forEach(method => {
  defaultConfig.headers[method] = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default defaultConfig
