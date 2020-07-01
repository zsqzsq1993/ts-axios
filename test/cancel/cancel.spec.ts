import { Cancel, isCancel } from '../../src/cancel/Cancel'

describe('cancel:Cancel', () => {
  test('should return correct message', () => {
    const cancel = new Cancel('Canceled by customer')
    expect(cancel.message).toBe('Canceled by customer')
  })

  test('should return true if it is cancel', () => {
    expect(isCancel(new Cancel())).toBeTruthy()
  })

  test('should return false if it is not cancel', () => {
    expect(isCancel({})).toBeFalsy()
  })
})
