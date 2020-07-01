import InterceptorManager from '../core/InterceptorManager'

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
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken // 用来储存CancelToken实例
  withCredentials?: boolean // 跨域请求是否携带cookie
  xsrfCookieName?: string // cookie中用来存储token的字段
  xsrfHeaderName?: string // headers中用来设置token的字段
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosAuthorization
  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string
  baseURL?: string

  [key: string]: any
}

/**
 * AxiosTransformer is a function or
 * a series of functions handling request
 * data(and headers) and response
 */
export interface AxiosTransformer {
  (data: any, headers?: any): any
}

/**
 * define response objecg interface
 */
export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: RequestConfig
  request: any
}

/**
 * define the response type that function returns
 * extending means AxiosPromise is a kind of Promise
 * interface which has AxiosResponse resolve type.
 */
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

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
  defaults: RequestConfig

  interceptors: {
    request: AxiosInterceptorManager<RequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }

  request<T = any>(config: RequestConfig): AxiosPromise<T>

  get<T = any>(url: string, config?: RequestConfig): AxiosPromise<T>

  head<T = any>(url: string, config?: RequestConfig): AxiosPromise<T>

  delete<T = any>(url: string, config?: RequestConfig): AxiosPromise<T>

  options<T = any>(url: string, config?: RequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: RequestConfig): AxiosPromise<T>

  put<T = any>(url: string, data?: any, config?: RequestConfig): AxiosPromise<T>

  patch<T = any>(url: string, data?: any, config?: RequestConfig): AxiosPromise<T>

  getUri(config: RequestConfig): string
}

/**
 * define AxiosInstance interfae discribing
 * a function that has Axios class properties
 */
export interface AxiosInstance extends Axios {
  <T = any>(config: RequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: RequestConfig): AxiosPromise<T>
}

/**
 * extend AxiosInstance with create function
 * to create another instance
 */
export interface AxiosStatic extends AxiosInstance {
  create(config?: RequestConfig): AxiosInstance

  /* cancel 请求的一些字段 */
  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: IsCancel

  /* 扩展的一些其他静态方法（不常用）*/
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (args: T[]) => R
  Axios: AxiosClassStatic
}

/**
 * 向外暴露Axios类
 */
export interface AxiosClassStatic {
  new (config: RequestConfig): Axios
}

/**
 * define interceptions manager
 * with two functions
 * use function to add a task
 * eject funtion to remove a task
 */
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

  eject(id: number): void
}

export interface ResolvedFn<T = any> {
  (value: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

/**
 * CancelToken类的实例对象类型
 */
export interface CancelToken {
  promise: Promise<Cancel>
  reason: Cancel

  throwIfRequested(): void
}

/**
 * 外部调用的cancel函数的类型
 */
export interface Canceller {
  (reason?: string): void
}

/**
 * CancelToken类构造函数传入参数的类型
 * 是个函数类型
 */
export interface CancelExecutor {
  (cancel: Canceller): void
}

/**
 * CancelToken类的类类型
 */
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

/**
 * 静态方法source的返回对象的类型
 * 封装了CancelToken实例和
 * Canceller函数
 */
export interface CancelTokenSource {
  cancelToken: CancelToken
  cancel: Canceller
}

/**
 * Cancel类的实例对象类型
 * 对string进行了简单封装
 */
export interface Cancel {
  message?: string
}

/**
 * Cancel类的类类型
 */
export interface CancelStatic {
  new (message?: string): Cancel
}

/**
 * isCancel函数的函数类型
 * 用于判断报错的是否为Cancel的实例对象
 */
export interface IsCancel {
  (value: any): boolean
}

/**
 * auth字段的传入对象类型
 */
export interface AxiosAuthorization {
  username: string
  password: string
}
