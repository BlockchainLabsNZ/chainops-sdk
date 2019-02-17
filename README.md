# ChainOps SDK

Module to access the APIs exposed as ChainOps service:
- Chainops-Watcher
- Chainops-Oracle

## Chainops class methods
```typescript
    getGasPrice(blockNumber?: number): Promise<any>;
    subscribe(subConfig: any): Promise<any>;
    unsubscribe(subscriptionId: string): Promise<any>;

    getBlockNumberFromTimestamp(ts: number): Promise<{
        timestamp: number, 
        blockNumber: number 
    }>;
```

See tests for usage

## Debug Mode
set env var CHAINOPS_SDK_DEBUG=true