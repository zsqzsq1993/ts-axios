import CancelToken from '../../src/cancel/CancelToken'
import { Canceller } from '../../src/type'
import { Cancel } from '../../src/cancel/Cancel'

describe('cancel:CancelToken', () => {
  describe('reason', function() {
    test('reason should be a Cancel instance', () => {
      let cancel: Canceller
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!('cannceled by customer.')
      expect(token.reason instanceof Cancel)
      expect(token.reason!.message).toBe('cannceled by customer.')
    })

    test('reason should be undefined if nothing to be done', () => {
      let cancel: Canceller
      const token = new CancelToken(c => {
        cancel = c
      })
      // cancel!('cannceled by customer.')
      expect(token.reason).toBeUndefined()
    })

    test('should have no side effect if cancel multiple times', () => {
      let cancel: Canceller
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!('cannceled by customer.')
      cancel!('123')
      cancel!('456')
      expect(token.reason!.message).toBe('cannceled by customer.')
    })
  })

  describe('promise', function() {
    test('promise should resolve a Cancel instance', done => {
      let cancel: Canceller
      const message = 'cannceled by customer.'
      const token = new CancelToken(c => {
        cancel = c
      }).promise.then(value => {
        expect(value instanceof Cancel).toBeTruthy()
        expect(value.message).toBe(message)
        done()
      })
      cancel!(message)
    })
  })

  describe('throwIfRequested', () => {
    test('should throw if cancel has been requested', () => {
      let cancel: Canceller
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!('cancel')
      try {
        token.throwIfRequested()
        fail('expect throw error but did not')
      } catch (e) {
        expect(e instanceof Cancel)
        expect(e.message).toBe('The Request has been sent and cancelled.')
      }
    })

    test('should does not throw if cancellation has not been requested', () => {
      const token = new CancelToken(() => {
        // do nothing
      })
      token.throwIfRequested()
    })
  })

  describe('source', () => {
    test('test static method source', done => {
      const source = CancelToken.source()
      const message = 'canncel'
      expect(source.cancelToken instanceof CancelToken).toBeTruthy()
      expect(typeof source.cancel === 'function').toBeTruthy()
      source.cancelToken.promise.then(value => {
        expect(value instanceof Cancel).toBeTruthy()
        expect(value.message).toBe(message)
        done()
      })
      source.cancel(message)
    })
  })
})
