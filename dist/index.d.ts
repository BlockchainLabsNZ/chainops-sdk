import { Config } from 'aws-sdk';
import { IConfig } from './config';
export declare class ChainOps {
    awsConfig: Config;
    config: IConfig;
    isLambdaExecution: boolean;
    constructor(env: string | IConfig);
    getGasPrice(blockNumber?: number): Promise<any>;
    subscribe(subConfig: any): Promise<any>;
    unsubscribe(subscriptionId: string): Promise<any>;
    getIsLambdaExecution(): boolean;
}
