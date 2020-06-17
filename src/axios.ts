import Axios from './core/Axios'
import { extend } from './helpers/utils'
import { AxiosInstance, AxiosStatic, CancelTokenStatic, RequestConfig } from './type'
import defaultConig from './defaults/defaultConfig'
import mergeConfig from './core/mergeConfig'
import CancelToken from './cancel/CancelToken'
import { Cancel, isCancel } from './cancel/Cancel'

function createInstance(defaults: RequestConfig): AxiosStatic {
  const context = new Axios(defaults)
  let instance = Axios.prototype.request.bind(context)
  instance = extend(instance, context)
  return instance as AxiosStatic
}

const axios = createInstance(defaultConig)
axios.create = function(config): AxiosInstance {
  config = mergeConfig(defaultConig, config)
  return createInstance(config!)
}

axios.CancelToken = CancelToken as CancelTokenStatic
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios
