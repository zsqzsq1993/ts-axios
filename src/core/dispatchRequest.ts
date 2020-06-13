import { RequestConfig, AxiosPromise } from '../type'
import { xhr } from './xhr'
import { concatURL } from '../helpers/urls'
import { processHeaders } from '../helpers/headers'
import { transformRequest, transformResponse } from '../helpers/data'

function dispathRequest(config: RequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(response => {
    response.data = transformResponse(response.data)
    return response
  })
}

function processConfig(config: RequestConfig): void {
  config.url = transformURL(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
}

function transformURL(config: RequestConfig): string {
  const { url, params } = config
  return concatURL(url!, params)
}

function transformHeaders(config: RequestConfig): any {
  let { headers = {}, data = null } = config
  return processHeaders(headers, data)
}

function transformRequestData(config: RequestConfig): string {
  let { data = null } = config
  return transformRequest(data)
}

export default dispathRequest
