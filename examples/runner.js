/**
 * Use this as an example to run sdk calls, requires AWS_PROFILE to be set
 */
const { ChainOps } = require('./dist/index')

async function main() {
  const sdk = new ChainOps({
    SUBSCRIPTIONS_ENDPOINT:
      'https://pmamrz2oh6.execute-api.ap-southeast-2.amazonaws.com/eugene'
  })

  await sdk.logOptimisticPending(
    'abc',
    '0x123',
    '0x456',
    '10',
    'EXCLUDE_FROM_BALANCE',
    '',
    100000
  )
}

main()
