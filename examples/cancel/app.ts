import axios, { Canceller } from '../../src'

/**
 * Cancelled by source()
 */
const source = axios.CancelToken.source()

axios({
  url: '/cancel/get',
  cancelToken: source.cancelToken
}).catch(e => {
  if (axios.isCancel(e)) {
    console.log(e.message)
  }
})

setTimeout(() => {
  source.cancel('Cancelled by user.')
  axios({
    url: '/cancel/post',
    data: {
      a: 1
    },
    cancelToken: source.cancelToken
  }).catch(e => {
    if (axios.isCancel(e)) {
      console.log(e.message)
    }
  })
},100)

/**
 * Cancelled by new CancelToken
 */
let cancel: Canceller

axios({
  url: '/cancel/get',
  cancelToken: new axios.CancelToken(c => {
    cancel = c
  })
}).catch(e => {
  if (axios.isCancel(e)) {
    console.log(e.message)
  }
})

setTimeout(() => {
  cancel('Cancelled by user via method 2.')
}, 100)
