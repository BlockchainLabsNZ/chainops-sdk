const axios = require('axios')
const { ChainOps } = require('../dist/index')

describe('Optimistic', () => {
  it('should log an optimistic tx', async () => {
    const spy = jest.fn().mockResolvedValue({
      data: 'hello'
    })

    axios.request = spy

    const chainops = new ChainOps('mainnet')
    await chainops.logOptimisticPending(
      'abc',
      '0x123',
      '0x456',
      '20',
      'INCLUDE_IN_BALANCE'
    )

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        data:
          '{"executionId":"abc","contract":"0x123","address":"0x456","value":"20","onFailure":"INCLUDE_IN_BALANCE"}'
      })
    )
  })
})
