import axios from '../src'
import mergeConfig from '../src/core/mergeConfig'

describe('mergeConfig', () => {
  const defaults = axios.defaults
  test('should received undefined for second argument', () => {
    expect(mergeConfig(defaults)).toEqual(defaults)
  })
  test('should received {} for second argument', () => {
    expect(mergeConfig(defaults, {})).toEqual(defaults)
  })
  test('should not leave reference', () => {
    const merged = mergeConfig(defaults)
    expect(merged).not.toBe(defaults)
    expect(merged.headers).not.toBe(defaults.headers)
  })
  test('should allow request options', () => {
    const config = {
      url: '/foo',
      params: {
        a: 1,
        b: 2
      },
      data: {
        first: 'dd'
      }
    }
    const merged = mergeConfig(defaults, config)
    expect(merged.url).toBe('/foo')
    expect(merged.params).toEqual(config.params)
    expect(merged.data).toEqual(config.data)
  })
  test('should not inherit request options', () => {
    const config = {
      url: '/foo',
      params: {
        a: 1,
        b: 2
      },
      data: {
        first: 'dd'
      }
    }
    const merged = mergeConfig(config)
    expect(merged.url).toBeUndefined()
    expect(merged.params).toBeUndefined()
    expect(merged.data).toBeUndefined()
  })
  test('should return default headers if pass config2 with undefined', () => {
    expect(
      mergeConfig(
        {
          headers: 'x-mock-header'
        },
        undefined
      )
    ).toEqual({
      headers: 'x-mock-header'
    })
  })
  test('should merge auth, headers with defaults', () => {
    expect(
      mergeConfig(
        {
          auth: undefined
        },
        {
          auth: {
            username: 'foo',
            password: 'test'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'foo',
        password: 'test'
      }
    })
    expect(
      mergeConfig(
        {
          auth: {
            username: 'foo',
            password: 'test'
          }
        },
        {
          auth: {
            username: 'baz',
            password: 'foobar'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'baz',
        password: 'foobar'
      }
    })
  })

  test('should overwrite auth, headers with a non-object value', () => {
    expect(
      mergeConfig(
        {
          headers: {
            common: {
              Accept: 'application/json, text/plain, */*'
            }
          }
        },
        {
          headers: null
        }
      )
    ).toEqual({
      headers: null
    })
  })

  test('should allow setting other options', () => {
    const merged = mergeConfig(defaults, {
      timeout: 123
    })
    expect(merged.timeout).toBe(123)
  })
})
