/**
 * @jest-environment node
 */

const { ChainOps } = require('../dist/index')

describe('ChainOps Timestamp BlockNumber API', () => {
  it('should return a blocknumber for a given timestamp', async () => {
    const chainOps = new ChainOps('mainnet')
    const result = await chainOps.getBlockNumberFromTimestamp(1530203000)

    expect(result).toHaveProperty('blockNumber')
    expect(result).toHaveProperty('timestamp')
  })

  it('should return a blocknumber for a given iso', async () => {
    const chainOps = new ChainOps('mainnet')
    const result = await chainOps.getBlockNumberFromIso(
      '2019-02-26T22:32:39.156Z'
    )

    expect(result).toHaveProperty('blockNumber')
    expect(result).toHaveProperty('timestamp')
  })

  it('should warm the cache by timezone', async () => {
    jest.setTimeout(30 * 24 * 1000) //allow 30 secs for 24months in milliseconds
    const chainOps = new ChainOps('mainnet')

    await chainOps.warmBlockNumberFromTimestampCache(
      // 'Pacific/Auckland'
      'Europe/Dublin'
    )
  })
})
