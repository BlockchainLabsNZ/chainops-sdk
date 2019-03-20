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
    console.log('Successfully created sub', subscriptionId)
  })

  it('should list subscriptions', async () => {
    const chainOps = new ChainOps('kovan')

    const subscriptions = await chainOps.listSubs()
    expect(subscriptions.length).toBeGreaterThan(0)

    console.log('Successfully listed subs', subscriptions)
  })

  it('should unsubscribe', async () => {
    const chainOps = new ChainOps('kovan')
    await chainOps.unsubscribe(subscriptionId)
    console.log('Successfully unsubscribed from sub', subscriptionId)
  })
})
