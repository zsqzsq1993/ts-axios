import axios from '../src'
import { getAjaxRequest } from './helper'

describe('progress', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a download progress handler', () => {
    let handler = jest.fn()
    axios({
      url: '/foo',
      onDownloadProgress: handler
    })
    return getAjaxRequest().then(req => {
      req.respondWith({
        status: 200,
        responseText: '{"name": "Tom"}'
      })
      expect(handler).toBeCalled()
    })
  })

  test('should add a upload progress handler', () => {
    let handler = jest.fn()
    axios({
      url: '/foo',
      onUploadProgress: handler
    })
    return getAjaxRequest().then(req => {})
  })
})
