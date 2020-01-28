/**
 * Use this as an example to run sdk calls, requires AWS_PROFILE to be set
 */
const { ChainOps } = require('../dist/index')

async function main() {
  const sdk = new ChainOps({
    SUBSCRIPTIONS_ENDPOINT:
      'https://pmamrz2oh6.execute-api.ap-southeast-2.amazonaws.com/eugene'
  })

  // const sub = await sdk.subscribe({
  //   ttl: null,
  //   filter: {
  //     addressBloom: {
  //       buckets: 128,
  //       n: 8
  //     }
  //   },
  //   name: 'AddressBloomTest'
  // })
  // /*
  // sub = {
  //   subscription: 'cf9e363c-79cb-4d6e-a4f7-f3d7f35da0ac',
  //   account: '106921302236',
  //   asub: null,
  //   filter: { addressBloom: { buckets: 128, n: 8 } },
  //   confirmationTrigger: [ 1 ],
  //   name: 'AddressBloomTest',
  //   ttl: null,
  //   version: 0 }
  // */

  // console.log(sub)
  const address = '0x123'
  const subId = 'cf9e363c-79cb-4d6e-a4f7-f3d7f35da0ac' // sub.subscription

  const putAddress = await sdk.addAddressToBloom(subId, address)
  console.log(putAddress)
}

main()
