import { Config } from 'aws-sdk';
export declare class ChainOps {
    ORACLE_URL: string;
    SUBSCRIPTIONS_ENDPOINT: string;
    awsConfig: Config;
    constructor();
    getGasPrice(blockNumber?: number): Promise<any>;
    subscribe(subConfig: any): Promise<any>;
    unsubscribe(subscriptionId: string): Promise<any>;
}
