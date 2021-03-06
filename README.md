# ChainOps SDK

Module to access the APIs exposed as ChainOps service:

- Chainops-Watcher
- Chainops-Oracle
- Timestamp-to-Blocknumber

## Config

Method 1: Use the out-of-the-box endpoints

```js
const chainOps = new ChainOps('kovan')
//or
const chainOps = new ChainOps('mainnet')
```

Method 2: Use own Chainops endpoints, e.g. custom deployment

```js
const chainOps = new ChainOps({
  ORACLE_URL: string,
  SUBSCRIPTIONS_ENDPOINT: string,
  TS_TO_BLOCKNUMBER: string
})
```

Config endpoints can be missing, however at runtime they will throw an error for that particular functionality
e.g. TS_TO_BLOCKNUMBER can be '' or undefined, calling getBlockNumberFromTimestamp will throw error

## Quickstart

- Edit your `serverless.yml` file and allow your lambda to invoke the ChainOps SDK

```yml
# Allow Lambdas to invoke the ChainOps SDK
- Effect: Allow
    Action:
    - execute-api:Invoke
    Resource:
    - arn:aws:execute-api:*:${self:provider.environment.CHAINOPS_AWS_ACC}:*/*/*/*
```

- Create a new ChainOps instance

```js
const chainOps = new ChainOps('mainnet')
```

- Query a ChainOps endpoint

```js
const result = await chainOps.listSubs({})
```

*Troubleshooting*

- If your lambda is using a custom authorizer then check that it doesn't override the `execute-api:invoke` rule you set, or disable the custom authorizer
- Check you are using the correct AWS Account ID for the Chainops instance you wish to target

## Chainops class methods

```typescript
    getGasPrice(blockNumber?: number): Promise<any>

    // Watcher methods
    // https://github.com/BlockchainLabsNZ/chainops-watcher
    subscribe(subConfig: any): Promise<any>
    unsubscribe(subscriptionId: string): Promise<any>
    // More info on Optimstic balances:
    // https://github.com/BlockchainLabsNZ/chainops-watcher/blob/feature/optimistic/OptimisticBalances.md
    getOptimisticBalance(wallet: EthAddress, tokenContract: EthAddress): Promise<string>
    logOptimisticPending(executionId: string, tokenContract: EthAddress, senderAddress: EthAddress, tokenAmount: string)
    listSubs(filter?): Promise<ISubscription[]>
    Filter {
        webhookContains?: string
        webhookEquals?: string
        nameContains?: string
        nameEquals?: string
        filterContains?: string
        filterFromContains?: string
        filterToContains?: string
        filterLogAddressContains?: string
        filterTopicContains?: string
    }

    getBlockNumberFromTimestamp(ts: number): Promise<{
        timestamp: number,
        blockNumber: number
    }>

    getBlockNumberFromIso(isoString: string): Promise<{
        timestamp: number,
        blockNumber: number
    }>

    warmBlockNumberFromTimestampCache(timezone: string): Promise<void>

    watcherVersion(): Promise<{
        version: string
    }>
```

See tests for usage

## Tests

Run tests with

`npm test`

Make sure the ChainOps URLs are up to date inside of `src/config.ts`

## Debug Mode

set env var CHAINOPS_SDK_DEBUG=true
