/**
 * define 7 method types in axios
 */
export type Method =
  | 'get'
  | 'GET'
  | 'post'
  | 'POST'
  | 'delete'
  | 'DELETE'
  | 'put'
  | 'PUT'
  | 'options'
  | 'OPTIONS'
  | 'head'
  | 'HEAD'
  | 'patch'
  | 'PATCH'

/**
 * define the config object of request
 */
export interface RequestConfig {
  method?: Method
  url?: string
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  timeout?: number
}

/**
 * define response objecg interface
 */
export interface AxiosResponse {
  status: number
  statusText: string
  headers: any
  data: any
  config: RequestConfig
  request: any
}

/**
 * define the response type that function returns
 * extending means AxiosPromise is a kind of Promise
 * interface which has AxiosResponse resolve type.
 */
export interface AxiosPromise extends Promise<AxiosResponse> {}

/**
 * define the config to construct
 * an AxiosError instance
 */
export interface AxiosErrorConfig {
  message: string
  config: RequestConfig
  code?: string | null
  request?: any
  response?: any
}

/**
 * define the interface for AxiosError
 */
export interface AxiosErr extends Error {
  isAxiosError: boolean
  message: string
  config: RequestConfig
  code?: string | null
  request?: any
  response?: any
}

/**
 * define Axios class interface
 */
export interface Axios {
  request(config: RequestConfig): AxiosPromise

  get(url: string, config?: RequestConfig): AxiosPromise

  head(url: string, config?: RequestConfig): AxiosPromise

  delete(url: string, config?: RequestConfig): AxiosPromise

  options(url: string, config?: RequestConfig): AxiosPromise

  post(url: string, data?: any, config?: RequestConfig): AxiosPromise

  put(url: string, data?: any, config?: RequestConfig): AxiosPromise

  patch(url: string, data?: any, config?: RequestConfig): AxiosPromise
}

/**
 * define AxiosInstance interfae discribing
 * a function that has Axios class properties
 */
export interface AxiosInstance extends Axios {
  (config: RequestConfig): AxiosPromise
}
