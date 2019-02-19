/**
 * @jest-environment node
 */

const { ChainOps } = require('../dist/index')

describe('ChainOps Timestamp BlockNumber API', () => {
  it('should return a blocknumber for a given timestamp', async () => {
    const chainOps = new ChainOps('mainnet')
    const result = await chainOps.getBlockNumberFromTimestamp(1530203000)

    console.log(result)

    expect(result).toHaveProperty('blockNumber')
    expect(result).toHaveProperty('timestamp')
  })
})
