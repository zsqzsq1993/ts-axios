import axios from '../../src'
/**
 * Some get examples concating params
 */
function get() {
  axios({
    method: 'get',
    url: '/base/get',
    params: {
      foo: ['dolly','zhang']
    }
  })

  axios({
    method: 'get',
    url: '/base/get',
    params: {
      foo: {
        first: 'dolly',
        last: 'zhang'
      }
    }
  })

  axios({
    method: 'get',
    url: '/base/get',
    params: {
      date: new Date()
    }
  })

  axios({
    method: 'get',
    url: '/base/get',
    params: {
      foo: '@:$, &'
    }
  })

  axios({
    method: 'get',
    url: '/base/get',
    params: {
      first: 'dolly',
      last: null
    }
  })

  axios({
    method: 'get',
    url: '/base/get#age',
    params: {
      first: 'dolly',
      data: new Date()
    }
  })

  axios({
    method: 'get',
    url: '/base/get?first=dolly',
    params: {
      last: 'zhang',
    }
  })
}

/**
 * Some post examples
 */
function post() {
  axios({
    method: 'post',
    url: '/base/post',
    data: {
      first: 'dolly',
      second: 'zhang'
    }
  })

  axios({
    method: 'POST',
    url: '/base/post',
    headers: {
      'content-type': 'application/json',
      'Accept': 'application/json, text/plain, */*'
    },
    data: {
      first: 'dolly',
      second: 'zhang'
    }
  })

  let paramsString = "q=URLUtils.searchParams&topic=api"
  let searchParams = new URLSearchParams(paramsString);
  axios({
    method: 'post',
    url: '/base/post',
    data: searchParams
  })
}

/**
 * Basic test for returning promise
 */
function promise() {
  axios({
    method: 'post',
    url: '/base/post',
    responseType: 'json',
    data: {
      first: 'dolly',
      last: 'zhang'
    }
  }).then(res => {
    console.log('1st example with responseType:',res)
  })

  axios({
    method: 'post',
    url: '/base/post',
    data: {
      first: 'dolly',
      last: 'zhang'
    }
  }).then(res => {
    console.log('2nd example without responseType',res)
  })

  axios({
    method: 'get',
    url: '/base/get',
    params: {
      first: 'dolly',
      last: 'zhang'
    }
  }).then(res => {
    console.log('3rd example with get method',res)
  })
}

promise()
