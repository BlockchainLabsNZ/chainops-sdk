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

    subscribe(subConfig: any): Promise<any>
    unsubscribe(subscriptionId: string): Promise<any>

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

## Debug Mode

set env var CHAINOPS_SDK_DEBUG=true
