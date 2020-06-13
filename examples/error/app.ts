import axios,{AxiosErr} from '../../src'

/**
 * wrong url, 404
 */
axios({
  method: 'get',
  url: '/error/get123',
  params: {
    a: 1,
    b: 2
  }
}).then(res => {
  console.log(res)
}).catch(e => {
  console.log(e)
})

/**
 * status code equals 500
 */
axios({
  method: 'get',
  url: '/error/get',
  params: {
    a: 1,
    b: 2
  }
}).then(res => {
  console.log(res)
}).catch((e: AxiosErr) => {
  console.log(e.config)
  console.log(e.request)
  console.log(e.message)
})

/**
 *  timeout
 */
axios({
  method: 'get',
  url: '/error/timeout',
  timeout: 2000,
  params: {
    a: 1,
    b: 2
  }
}).then(res => {
  console.log(res)
}).catch(e => {
  console.log(e)
})

/**
 * Network Error
 */
setTimeout(() => {
  axios({
    method: 'get',
    url: '/error/get',
    params: {
      a: 1,
      b: 2
    }
  }).then(res => {
    console.log(res)
  }).catch(e => {
    console.log(e)
  })
}, 5000)
