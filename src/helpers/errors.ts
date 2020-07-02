import { AxiosErr, AxiosErrorConfig, RequestConfig } from '../type'

class AxiosError extends Error implements AxiosErr {
  isAxiosError: boolean
  config: RequestConfig
  code: string | null
  request: any
  response: any

  /* istanbul ignore next */
  constructor(config: AxiosErrorConfig) {
    super(config.message)

    this.isAxiosError = true
    this.config = config.config
    this.code = config.code || null
    this.request = config.request || {}
    this.response = config.response || {}

    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createAxiosError(config: AxiosErrorConfig) {
  return new AxiosError(config)
}
