/**
 * @jest-environment node
 */

const { ChainOps } = require('../dist/index')

describe('ChainOps Watcher API', () => {
  let subscriptionId

  // tests cant pass until endpoint exists
  // it('should query optimistic balance', async () => {
  //   const chainOps = new ChainOps('mainnet')

  //   const balance = await chainOps.getOptimisticBalance(
  //     "0x4370bc956e4f793e32a248b7ae0fe8969def8a1f",
  //     "0xdd6bf56ca2ada24c683fac50e37783e55b57af9f"
  //   )

  //   expect(typeof balance).toBe('string')

  //   console.log('Successfully queried balance', balance)
  // })

  it('should make a subscription', async () => {
    const chainOps = new ChainOps('mainnet')

    const subscription = await chainOps.subscribe({
      webhook: 'https://example.com',
      name: 'ChainOps API Test',
      filter: {
        probability: '0.001'
      },
      ttl: 7,
      confirmationTrigger: [0, 1, 6]
    })

    expect(typeof subscription.subscription).toBe('string')

    subscriptionId = subscription.subscription
    console.log('Successfully created sub', subscriptionId)
  })

  it('should return version', async () => {
    const chainOps = new ChainOps('mainnet')

    const version = await chainOps.watcherVersion()
    expect(Object.keys(version)).toContain('version')

    console.log('Got version', version)
  })

  it('should list subscriptions', async () => {
    const chainOps = new ChainOps('mainnet')

    const subscriptions = await chainOps.listSubs()
    expect(subscriptions.length).toBeGreaterThan(0)

    console.log('Successfully listed subs', subscriptions.length)
  })

  it('should unsubscribe', async () => {
    const chainOps = new ChainOps('mainnet')
    await chainOps.unsubscribe(subscriptionId)
    console.log('Successfully unsubscribed from sub', subscriptionId)
  })
})
