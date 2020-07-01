import axios from '../src'
import { getAjaxRequest } from './helper'

describe('static', () => {
  test('should support all', () => {
    let fulfilled1
    let fulfilled2
    axios.all(['1', '2']).then(args => {
      fulfilled1 = args[0]
      fulfilled2 = args[1]
      expect(fulfilled1).toBe('1')
      expect(fulfilled2).toBe('2')
    })
  })

  test('should support spread', () => {
    let sum: number
    let fulfilled: number
    axios
      .all([1, 2])
      .then(
        axios.spread((a: number, b: number) => {
          sum = a + b
          fulfilled = a - b
          return 'hello'
        })
      )
      .then(res => {
        expect(res).toBe('hello')
        expect(sum).toBe(3)
        expect(fulfilled).toBe(-1)
      })
  })
})
