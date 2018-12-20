/**
 * @jest-environment node
 */

const { ChainOps } = require('../dist/index')

describe('ChainOps Watcher API', () => {
  let subscriptionId

  it('should make a subscription', async () => {
    const chainOps = new ChainOps('kovan')

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
  })

  it('should unsubscribe', async () => {
    const chainOps = new ChainOps('kovan')
    await chainOps.unsubscribe(subscriptionId)
  })
})
