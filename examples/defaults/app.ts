import axios, {AxiosTransformer} from '../../src'
import qs from 'qs'

function concat_defaults() {
  axios.defaults.headers.common['test2'] = 123

  axios({
    method: 'post',
    url: '/config/post',
    data: qs.stringify({
      a: 1,
      b: 2
    }),
    headers: {
      test: 321
    }
  }).then(res => {
    // console.log(res.data)
  })
}

function test_transform() {
  axios({
    url: '/config/transform',
    method: 'post',
    data: {
      a: 1,
      b: 2
    },
    headers: {
      first: 'dolly'
    },
    transformRequest: [function(data, headers) {
      headers.last = 'zhang'
      return qs.stringify(data)
    }, ...(axios.defaults.transformRequest as any)],
    transformResponse: [...(axios.defaults.transformResponse as any),
    function(response, headers) {
      response.data += 'and hi'
      return response
    }]
  }).then(result => {
    console.log(result)
  })
}

function create_new_instance(){
  const instance = axios.create({
    transformRequest: [(function(data) {
      return qs.stringify(data)
    }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
    transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function(data) {
      if (typeof data === 'object') {
        data.b = 2
      }
      return data
    }]
  })

  instance({
    url: '/config/post',
    method: 'post',
    data: {
      a: 1
    }
  }).then((res) => {
    console.log(res.data)
  })
}

create_new_instance()
