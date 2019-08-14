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
```

See tests for usage

## Tests

Run tests with

`npm test`

Make sure the ChainOps URLs are up to date inside of `src/config.ts`

## Debug Mode

set env var CHAINOPS_SDK_DEBUG=true
