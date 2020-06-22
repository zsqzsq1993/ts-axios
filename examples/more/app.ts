import axios from '../../src'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import qs from 'qs'

function anotherOrgin() {
  const url = 'http://127.0.0.1:8088/more/post'

  document.cookie = 'name=dolly'

  axios.get('/more/get').then(res => {
    console.log(res)
  })

  axios.post(url, {}, {
    withCredentials: true
  }).then(res => {
    console.log(res)
  })
}

function progress() {
  const instance = axios.create()

  loadProgress()

  const uploadBtn = document.getElementById('upload')
  const downloadBtn = document.getElementById('download')
  const fileChoose = document.getElementById('file') as HTMLInputElement

  downloadBtn!.addEventListener('click', (event) => {
    instance.get('https://img.mukewang.com/5cc01a7b0001a33718720632.jpg')
  })

  uploadBtn!.addEventListener('click', (event) => {
    const data = new FormData()

    if (fileChoose!.files) {
      data.append('file', fileChoose.files[0])
      console.log(fileChoose.files[0])
      instance.post('/more/upload', data)
    }
  })

  function loadProgress() {
    const start = () => {
      instance.interceptors.request.use(config => {
        nProgress.start()
        return config
      })
    }

    const onProgress = () => {
      const update = (event: ProgressEvent) => {
        nProgress.set(percentage(event.loaded, event.total))
      }
      instance.defaults.onUploadProgress = update
      instance.defaults.onDownloadProgress = update
    }

    const end = () => {
      instance.interceptors.response.use(response => {
        nProgress.done()
        return response
      })
    }

    start()
    onProgress()
    end()
  }
  function percentage(loaded: number, total: number): number {
    return Math.floor(loaded * 1.0 / total)
  }
}

function auth() {
  axios({
    url: '/more/auth',
    method: 'post',
    data: {
      a: 1,
      b: 2
    },
    auth: {
      username: 'dolly',
      password: 'dolly123'
    }
  })

  const instance = axios.create()
  instance({
    url: '/more/auth',
    method: 'post',
    data: {
      a: 1,
      b: 2
    },
    auth: {
      username: 'dolly',
      password: '321'
    }
  }).catch(e => {
    console.log(e.message)
  })
}

function customerStatus() {
  const instance = axios.create({
    validateStatus(status) {
      return status >= 304 && status < 306
    }
  })

  instance.get('/more/304').then(res => {
    // console.log(res)
  })
  instance.get('/more/306').catch(e => {
    console.log(e.message)
  })

  axios.get('/more/304').catch(e => {
    console.log(e.message)
  })
}

function paramsSerializer() {
  axios.get('/more/get', {
    params: new URLSearchParams('a=1&b=2')
  })

  axios.get('/more/get', {
    params: {
      a: 1,
      b: 2,
      c: [3, 4]
    }
  })

  const instance = axios.create({
    paramsSerializer(params) {
      return qs.stringify(params)
    }
  })

  instance.get('/more/get', {
    params: {
      a: 1,
      b: 2,
      c: [3, 4]
    }
  })
}

function baseURL() {
  const instance = axios.create({
    baseURL: 'https://img.mukewang.com/'
  })

  instance.get('5cc01a7b0001a33718720632.jpg')

  instance.get('https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')
}

function staticFn() {
  function getA() {
    return new Promise(resolve => {
      resolve('A')
    })
  }

  function getB() {
    return new Promise(resolve => {
      resolve('B')
    })
  }

  axios.all([getA(), getB()]).then(([res1, res2]) => {
    console.log(res1)
    console.log(res2)
  })

  axios.all([getA(), getB()]).then(
    axios.spread(function(res1, res2) {
      console.log(res1)
      console.log(res2)
  }))

  const fakeConfig = {
    baseURL: 'https://www.baidu.com/',
    url: '/user/12345',
    params: {
      idClient: 1,
      idTest: 2,
      testString: 'thisIsATest'
    }
  }
  console.log(axios.getUri(fakeConfig))
}

staticFn()
