import CancelToken from '../../src/cancel/CancelToken'
import { Canceller } from '../../src/type'
import { Cancel } from '../../src/cancel/Cancel'
import axios from '../../src'
import { getAjaxRequest } from '../helper'

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

    test('should optionally provide cancel reason message', () => {
      let cancel: Canceller
      const token = new CancelToken(c => {
        cancel = c
      })
      cancel!()
      expect(token.reason instanceof Cancel)
      expect(token.reason!.message).toBe('')
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

  describe('cancel in axios', function() {
    beforeEach(() => {
      jasmine.Ajax.install()
    })

    afterEach(() => {
      jasmine.Ajax.uninstall()
    })

    test('cancel function in axios', done => {
      let cancel: Canceller
      axios({
        url: '/foo',
        cancelToken: new axios.CancelToken(c => {
          cancel = c
        })
      })
        .then(res => {
          throw new Error('should not go into here.')
        })
        .catch(e => {
          expect(e instanceof Cancel).toBeTruthy()
          expect((e as Cancel).message).toBe('cancelled by myself')
          done()
        })

      getAjaxRequest().then(req => {
        setTimeout(() => {
          req.respondWith({
            status: 200,
            responseText: 'hello'
          })
        }, 200)
      })

      setTimeout(() => {
        cancel('cancelled by myself')
      }, 100)
    })
  })
})
