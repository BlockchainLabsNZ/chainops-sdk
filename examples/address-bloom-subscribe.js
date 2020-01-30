/**
 * Use this as an example to run sdk calls, requires AWS_PROFILE to be set
 */
const {
  ChainOps
} = require('../dist/index')

async function main() {
  const sdk = new ChainOps({
    SUBSCRIPTIONS_ENDPOINT: 'https://pmamrz2oh6.execute-api.ap-southeast-2.amazonaws.com/eugene'
  })

  const sub = await sdk.subscribe({
    confirmations: [0],
    ttl: null,
    webhook: 'https://webhook.site/bc60ab29-d682-4cde-ab33-13f0f25cf923',
    filter: {
      addressBloom: {
        buckets: 128000,
        n: 8
      }
    },
    name: 'AddressBloomTest'
  })

  /*
  sub = {
    subscription: 'cf9e363c-79cb-4d6e-a4f7-f3d7f35da0ac',
    account: '106921302236',
    asub: null,
    filter: { addressBloom: { buckets: 128, n: 8 } },
    confirmationTrigger: [ 1 ],
    name: 'AddressBloomTest',
    ttl: null,
    webhook: 'https://webhook.site/bc60ab29-d682-4cde-ab33-13f0f25cf923', 
    version: 0 }
  */

  // console.log(sub)
  const address = '0x123'
  const subId = sub.subscription

  const putAddress = await sdk.addAddressToBloom(subId, address)
  console.log(putAddress)

  const testAddress = await sdk.testAddressAgainstBloom(subId, address)
  console.log(testAddress)
}

main()