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
    getGasPrice(blockNumber?: number): Promise<any>;
    getEndpoint(endpointName: string): string;
    getOptimisticBalance(wallet: EthAddress, tokenContract: EthAddress): Promise<any>;
    logOptimisticPending(executionId: string, tokenContract: EthAddress, senderAddress: EthAddress, tokenAmount: string): Promise<any>;
    subscribe(subConfig: any): Promise<any>;
    unsubscribe(subscriptionId: string): Promise<any>;
    listSubs(filter: watcher.IListFilter): Promise<any[]>;
    getBlockNumberFromTimestamp(ts: number): Promise<any>;
    getBlockNumberFromIso(isoString: string): Promise<any>;
    warmBlockNumberFromTimestampCache(timezone?: string): Promise<any[]>;
    getCreds(): Promise<ICred>;
    getIsLambdaExecution(): boolean;
}
