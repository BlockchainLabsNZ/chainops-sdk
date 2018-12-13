import { Config } from 'aws-sdk';
import { IConfig } from './config';
interface ICred {
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
    subscribe(subConfig: any): Promise<any>;
    unsubscribe(subscriptionId: string): Promise<any>;
    getCreds(): ICred;
    getIsLambdaExecution(): boolean;
}
export {};
