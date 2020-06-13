import Axios from './core/Axios'
import { extend } from './helpers/utils'
import { AxiosInstance } from './type'

function createInstance(): AxiosInstance {
  const context = new Axios()
  let instance = Axios.prototype.request.bind(context)
  instance = extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
