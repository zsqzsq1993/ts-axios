import { RequestConfig, AxiosPromise } from '../type'
import { xhr } from './xhr'
import { concatURL } from '../helpers/urls'
import { flatternHeaders } from '../helpers/headers'
import transform from './transform'

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

function transformURL(config: RequestConfig): string {
  const { url, params } = config
  return concatURL(url!, params)
}

export default dispathRequest
