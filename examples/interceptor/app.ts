import axios, {AxiosErr} from '../../src'

axios.interceptors.request.use(
  config => {
    config.headers.test += '1'
    return config
  }
)

axios.interceptors.request.use(
  config => {
    config.headers.test += '2'
    return config
  }
)

axios.interceptors.response.use(
  response => {
    response.data.test += '1'
    return response
  }
)

const id = axios.interceptors.response.use(
  response => {
    response.data.test += '2'
    return response
  }
)

axios.interceptors.response.use(
  response => {
    response.data.test += '3'
    return response
  }
)

axios.interceptors.response.eject(id)

axios.request({
  method: 'post',
  url: '/interceptor/post',
  headers: {
    test: ''
  },
  data: {
    a:1,
    b:2
  },
  responseType: 'json'
}).then(response => {
  console.log(response)
}).catch(error => {
  console.log(error)
})
