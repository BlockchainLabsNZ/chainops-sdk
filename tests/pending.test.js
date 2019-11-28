const axios = require('axios')
const { ChainOps } = require('../dist/index')

describe('Pending address bloom filter', () => {
  it('should log an address', async () => {
    const spy = jest.fn().mockResolvedValue({
      data: 'hello'
    })

    axios.request = spy

    const chainops = new ChainOps('mainnet')
    await chainops.addAddressToPendingBloom('0x123')

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        url: expect.stringContaining('/subscription/pending/address/0x123')
      })
    )
  })

  it('should test an address', async () => {
    const spy = jest.fn().mockResolvedValue({
      data: 'hello'
    })

    axios.request = spy

    const chainops = new ChainOps('mainnet')
    await chainops.testAddressAgainstPendingBloom('0x123')

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/subscription/pending/address/0x123')
      })
    )
  })
})
