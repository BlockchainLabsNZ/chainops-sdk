/**
 * Use this as an example to run sdk calls, requires AWS_PROFILE to be set
 */
const { ChainOps } = require('../dist/index')

async function main() {
  const sdk = new ChainOps({
    // SUBSCRIPTIONS_ENDPOINT:
    //   'https://pmamrz2oh6.execute-api.ap-southeast-2.amazonaws.com/eugene'
    SUBSCRIPTIONS_ENDPOINT:
      'https://xmi8r0snb5.execute-api.ap-southeast-2.amazonaws.com/mainnet'
  })

  const result = await sdk.testAddressAgainstPendingFilter(
    // '0x944C4bacDE47414D07D01d0487dE5894eD07971d'
    // '0x88aad64a53a8a2f6afaf3b960aAEBe92C3E3Ec8F'
    // '0x99e952bE37D986038a6c937c4a09d9cf26f9521f'
    // '0x9c22b4f9b978a5027D374F874a6B61C9AB11b221',
    '0x0f3b54eF0A1C79E98593325dF39DEC44a5fD9C10'
  )

  // const result = await sdk.addAddressToPendingFilter(
  //   '0x944C4bacDE47414D07D01d0487dE5894eD07971d'
  // )
  console.log(result)
}

main()
