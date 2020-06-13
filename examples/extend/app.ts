import axios,{AxiosErr} from '../../src'

axios({
  url: '/extend/get',
  method: 'get'
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'give me back'
  }
})

axios.get('/extend/get', {
  headers: {
    'Content-Type': 'application/dolly-sepical'
  }
})

axios.head('/extend/head')

axios.options('/extend/options')

axios.delete('/extend/delete')

axios.post('/extend/post', {
  msg: 'give me back'
},{
  headers: {
    'Content-Type': 'application/json; charset=utf-9'
  },
  responseType: 'text',
  params: {
    a: 1,
    b: 2
  }
}).then(res => {
  console.log(res)
})

// no errors at all
axios.put('/extend/put', {
  msg: 'give me back'
}).catch((e: AxiosErr) => {
  console.log(e.request)
  console.log(e.response)
})


axios.patch('/extend/patch', {
  msg: 'give me back'
})
