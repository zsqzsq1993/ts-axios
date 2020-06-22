import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
  document.cookie = 'name=dolly'
  test('should read cookie via cookieName', () => {
    expect(cookie.read('name')).toBe('dolly')
  })

  test('should return null if not found cookieName', () => {
    expect(cookie.read('age')).toBeNull()
  })
})
