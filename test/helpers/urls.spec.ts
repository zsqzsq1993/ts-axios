import { concatURL, concatBaseURL, isURLSameOrigin, isAbsoluteURL } from '../../src/helpers/urls'
import qs from 'qs'

describe('helpers:urls', () => {
  describe('concatURL', () => {
    test('should support optional arguments', () => {
      expect(concatURL('/foo')).toEqual('/foo')
    })

    test('should ignore hash', () => {
      expect(concatURL('/foo#', { a: 1 })).toBe('/foo?a=1')
      expect(concatURL('/foo#hello', { b: 2 })).toBe('/foo?b=2')
    })

    test('should ignore null params properties', () => {
      expect(concatURL('/foo', { a: 1, b: 2, c: null })).toBe('/foo?a=1&b=2')
    })

    test('should support array as param property', () => {
      expect(concatURL('/foo', { name: ['dolly', 'vera'] })).toBe('/foo?name[]=dolly&name[]=vera')
    })

    test('should support Date as param property', () => {
      const date = new Date()
      const dateString = date.toISOString()
      expect(concatURL('/foo', { date })).toBe(`/foo?date=${dateString}`)
    })

    test('should support Plain Object as param property', () => {
      const name = {
        first: 'dolly'
      }
      expect(concatURL('/foo', { name })).toBe(
        `/foo?name=${encodeURIComponent('{"first":"dolly"}').replace('%3A', ':')}`
      )
    })

    test('should support & and ? two cases', () => {
      expect(concatURL('/foo?a=b', { c: 1 })).toBe('/foo?a=b&c=1')
    })

    test('should support customer paramsSerializer', () => {
      const serializer = (obj: any) => {
        return 'dolly=zhang'
      }
      expect(concatURL('/foo', { a: 1, b: 2 }, serializer)).toBe('/foo?dolly=zhang')
    })

    test('should automatically detect URLSearchParams object', () => {
      const search = new URLSearchParams()
      expect(concatURL('/foo', search)).toBe(`/foo?${search.toString()}`)
    })
  })

  describe('concatBaseURL', () => {
    test('different situations concat', () => {
      expect(concatBaseURL('foo/', '/la')).toBe('foo/la')
      expect(concatBaseURL('foo', 'la')).toBe('foo/la')
      expect(concatBaseURL('foo///', 'la')).toBe('foo/la')
      expect(concatBaseURL('foo', '///la')).toBe('foo/la')
    })
  })

  describe('isURLSameOrigin', () => {
    test('should detect same origin', () => {
      expect(isURLSameOrigin(window.location.href)).toBeTruthy()
    })

    test('should detect different origin', () => {
      expect(isURLSameOrigin('https://github.com/axios/axios')).toBeFalsy()
    })
  })

  describe('isAbsoluteURL', () => {
    test('should return true if URL begins with valid scheme name', () => {
      expect(isAbsoluteURL('https://api.github.com/users')).toBeTruthy()
      expect(isAbsoluteURL('custom-scheme-v1.0://example.com/')).toBeTruthy()
      expect(isAbsoluteURL('HTTP://example.com/')).toBeTruthy()
    })

    test('should return false if URL begins with invalid scheme name', () => {
      expect(isAbsoluteURL('123://example.com/')).toBeFalsy()
      expect(isAbsoluteURL('!valid://example.com/')).toBeFalsy()
    })

    test('should return true if URL is protocol-relative', () => {
      expect(isAbsoluteURL('//example.com/')).toBeTruthy()
    })

    test('should return false if URL is relative', () => {
      expect(isAbsoluteURL('/foo')).toBeFalsy()
      expect(isAbsoluteURL('foo')).toBeFalsy()
    })
  })
})
