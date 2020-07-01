import { getAjaxRequest } from './helper'
import axios, { AxiosTransformer } from '../src'

describe('defaults', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should transfer object to json string', () => {
    expect((axios.defaults.transformRequest as AxiosTransformer[])[0]({ name: 'Tom' })).toBe(
      '{"name":"Tom"}'
    )
  })

  test('should do nothing if not object', () => {
    expect((axios.defaults.transformRequest as AxiosTransformer[])[0]('name=Tom')).toBe('name=Tom')
  })

  test('should transfer json string response', () => {
    expect((axios.defaults.transformResponse as AxiosTransformer[])[0]('{"name":"Tom"}')).toEqual({
      name: 'Tom'
    })
  })

  test('should do nothing if not json string response', () => {
    expect((axios.defaults.transformResponse as AxiosTransformer[])[0]('name=Tom')).toBe('name=Tom')
  })

  test('should use modified default config', () => {
    axios.defaults.baseURL = 'http://example.com'
    axios('/yooo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('http://example.com/yooo')
      delete axios.defaults.baseURL
    })
  })
})
