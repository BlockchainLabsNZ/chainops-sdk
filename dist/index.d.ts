import { Config } from 'aws-sdk';
import { IConfig } from './config';
export interface ICred {
    secretAccessKey?: string;
    accessKeyId: string;
    sessionToken: string | undefined;
}
export declare class ChainOps {
    awsConfig: Config;
    config: IConfig;
    isLambdaExecution: boolean;
    constructor(env: string | IConfig);
    getGasPrice(blockNumber?: number): Promise<any>;
    getEndpoint(endpointName: string): string;
    subscribe(subConfig: any): Promise<any>;
    unsubscribe(subscriptionId: string): Promise<any>;
    getBlockNumberFromTimestamp(ts: number): Promise<any>;
    getBlockNumberFromIso(isoString: string): Promise<any>;
    warmBlockNumberFromTimestampCache(timezone: string): Promise<any[]>;
    getCreds(): Promise<ICred>;
    getIsLambdaExecution(): boolean;
}
