import { Config } from 'aws-sdk';
import { IConfig } from './config';
import * as watcher from './watcher';
export interface ICred {
    secretAccessKey?: string;
    accessKeyId: string;
    sessionToken: string | undefined;
}
export interface EthAddress {
    address: string;
}
export declare class ChainOps {
    awsConfig: Config;
    config: IConfig;
    isLambdaExecution: boolean;
    constructor(env: string | IConfig);
    /**
     * Query for the gas price of a particular block
     * @param blockNumber The block number you are interested in
     */
    getGasPrice(blockNumber?: number): Promise<any>;
    getEndpoint(endpointName: string): string;
    /**
     * Query the watcher for the optimistic balance for an address
     * https://github.com/BlockchainLabsNZ/chainops-watcher/blob/feature/optimistic/OptimisticBalances.md
     * @param wallet The address you'd like the balance of
     * @param tokenContract The token balance you're interested in
     */
    getOptimisticBalance(wallet: EthAddress, tokenContract: EthAddress): Promise<string>;
    /**
     * Let the watcher know about a new pending token transfer
     * @param executionId The ChainOps Execution ID for the transfer
     * @param tokenContract The contract for the tokens being transferred
     * @param senderAddress The sender of the tokens
     * @param tokenAmount The amount of tokens being sent
     * @param onFailure The failure policy to use
     */
    logOptimisticPending(executionId: string, tokenContract: EthAddress, senderAddress: EthAddress, tokenAmount: string, onFailure: string, reason?: string, ttl?: number | null): Promise<void>;
    /**
     * Get the version of the deployed watcher
     */
    watcherVersion(): Promise<any>;
    /**
     * Create a new watcher subscription
     * @param subConfig Configuration for your new subscription
     */
    subscribe(subConfig: any): Promise<any>;
    /**
     * Destroy an existing watcher subscription
     * @param subscriptionId The ID you'd like to destroy
     */
    unsubscribe(subscriptionId: string): Promise<any>;
    /**
     * Get a list of existing subscriptions
     * @param filter Filter which subscriptions you get back
     */
    listSubs(filter: watcher.IListFilter): Promise<any[]>;
    /**
     * Makes a call to watcher logging the address to the filter
     * This filter currently (subject to change) uses a bloom filter
     * under the hood. The consumer should do further checks to see
     * whether it satisfies
     * @param address string of address e.g. 0x123
     * @returns object response data
     */
    addAddressToPendingFilter(address: string): Promise<any>;
    /**
     * Checks if the address satisfies the filter
     * This can result in false-positives as it currently
     * (subject to change) uses a bloom filter
     * @param address string of address e.g. 0x123
     * @returns object response data
     */
    testAddressAgainstPendingFilter(address: string): Promise<any>;
    /**
     * Query for a block number based on a timestamp
     * @param ts Timestamp you'd like to know the block number of
     */
    getBlockNumberFromTimestamp(ts: number): Promise<any>;
    /**
     * Query for the block number based on an isostring
     * @param isoString ISOString you'd like to know the block number of
     */
    getBlockNumberFromIso(isoString: string): Promise<any>;
    warmBlockNumberFromTimestampCache(timezone?: string): Promise<any[]>;
    getCreds(): Promise<ICred>;
    getIsLambdaExecution(): boolean;
}
