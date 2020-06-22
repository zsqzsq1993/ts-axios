import { RequestConfig, AxiosPromise } from '../type'
import { xhr } from './xhr'
import { concatBaseURL, concatURL } from '../helpers/urls'
import { flatternHeaders } from '../helpers/headers'
import transform from './transform'
import { isAbsolute } from 'path'

function dispathRequest(config: RequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(response => {
    response = transform(response, config.headers, config.transformResponse!)
    return response
  })
}

function processConfig(config: RequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest!)
  config.headers = flatternHeaders(config.headers, config.method!)
}

export function transformURL(config: RequestConfig): string {
  let { url, params, paramsSerializer, baseURL } = config
  if (baseURL && !isAbsolute(url!)) {
    url = concatBaseURL(baseURL, url!)
  }
  return concatURL(url!, params, paramsSerializer)
}

export default dispathRequest
