import { Cancel } from './Cancel'
import { CancelExecutor, Canceller, CancelTokenSource } from '../type'

interface PromiseResolve {
  (reason: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let promiseResolve: PromiseResolve

    this.promise = new Promise(resolve => {
      promiseResolve = resolve
    })

    executor(reason => {
      if (this.reason) {
        return
      } else {
        this.reason = new Cancel(reason || '')
        promiseResolve(this.reason)
      }
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw new Cancel('The Request has been sent and cancelled.')
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceller
    const cancelToken = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      cancelToken
    } as CancelTokenSource
  }
}
