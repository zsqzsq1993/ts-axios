import { ResolvedFn, RejectedFn } from '../type'

interface Interceptor<T> {
  resolvedFn: ResolvedFn
  rejectedFn?: RejectedFn
}

class InterceptorManager<T> {
  queue: Array<Interceptor<T> | null> // null for those interceptors that were removed

  constructor() {
    this.queue = []
  }

  use(resolvedFn: ResolvedFn, rejectedFn?: RejectedFn) {
    this.queue.push({
      resolvedFn,
      rejectedFn
    })
    return this.queue.length - 1
  }

  eject(id: number): void {
    this.queue[id] = null
  }

  forEach(fn: (interceptor: Interceptor<T>) => void) {
    this.queue.forEach(interceptor => {
      if (interceptor) {
        fn(interceptor)
      }
    })
  }
}

export default InterceptorManager
