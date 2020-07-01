import axios from '../src'
import { getAjaxRequest } from './helper'

describe('auth', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should set proper headers when auth is set', () => {
    const username = 'dolly'
    const password = '123'
    const val = 'Basic ' + btoa(`${username}:${password}`)
    axios({
      url: '/foo',
      auth: {
        username,
        password
      }
    })
    return getAjaxRequest().then(req => {
      expect(req.requestHeaders['Authorization']).toBe(val)
    })
  })

  test('should throw error if not latin', () => {
    const username = 'Aladßç£☃din'
    const password = '123'
    axios({
      url: '/foo',
      auth: {
        username,
        password
      }
    })
      .then(res => {
        throw new Error('should go into catch but not then')
      })
      .catch(e => {
        expect(/character/i.test(e.message)).toBeTruthy()
      })
  })
})
