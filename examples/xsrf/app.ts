import axios from '../../src'

const instance = axios.create({
  xsrfCookieName: 'X-XSRF-TOKEN-DOLLY',
  xsrfHeaderName: 'X-X-XSRF-TOKEN-DOLLY'
})

instance.get('/xsrf/get')
