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
      headers = processHeaders(headers, data)
      return transformRequest(data)
    }
  ],

  transformResponse: [
    function(response) {
      return transformResponse(response)
    }
  ]
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
