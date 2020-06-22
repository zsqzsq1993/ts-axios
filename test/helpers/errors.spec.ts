import { createAxiosError } from '../../src/helpers/errors'
import { RequestConfig, AxiosResponse } from '../../src/type'

describe('helpers::error', function() {
  test('should create an Error with message, config, code, request, response and isAxiosError', () => {
    const request = new XMLHttpRequest()
    const config: RequestConfig = { method: 'post' }
    const response: AxiosResponse = {
      status: 200,
      statusText: 'OK',
      headers: null,
      request,
      config,
      data: { foo: 'bar' }
    }
    const error = createAxiosError({
      message: 'Boom!',
      config,
      request,
      response,
      code: '-1'
    })
    const error1 = createAxiosError({
      message: 'Boom!',
      config
    })
    expect(error instanceof Error).toBeTruthy()
    expect(error.message).toBe('Boom!')
    expect(error.config).toBe(config)
    expect(error.request).toBe(request)
    expect(error.response).toBe(response)
    expect(error.isAxiosError).toBeTruthy()
    expect(error.code).toBe('-1')
    expect(error1.code).toBeNull()
  })
})
