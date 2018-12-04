import aws4 from 'aws4';
import axios from 'axios';
import {URL} from 'url';
import {SharedIniFileCredentials, Config} from 'aws-sdk';

import config from './config';

export class ChainOps {
    awsConfig: Config;

    constructor () {
        this.awsConfig = new Config();
        this.awsConfig.credentials = new SharedIniFileCredentials();
    }

    async getGasPrice (blockNumber?: number) {
        const file = `${blockNumber || 'latest'}.json`;

        const response = await axios.request({
            baseURL: config.ORACLE_URL,
            url: file
        });

        try {
            return response.data.analysis;
        }catch(err) {
            throw new Error(`Could not retrieve gas prices for block: ${blockNumber || 'latest'}`);
        }
    }
    
    async subscribe (subConfig: any) {
        const url = new URL(config.SUBSCRIPTIONS_ENDPOINT + '/subscription');
        
        //@ts-ignore
        await this.awsConfig.credentials.getPromise();
        if (!this.awsConfig.credentials) throw new Error('AWS creds not set'); 

        const request = aws4.sign({
            host: url.host,
            url: url.href,
            method: 'PUT',
            path: `${url.pathname}${url.search}`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subConfig)
        }, {
            secretAccessKey: this.awsConfig.credentials.secretAccessKey,
            accessKeyId: this.awsConfig.credentials.accessKeyId,
            sessionToken: this.awsConfig.credentials.sessionToken
        });

        const reqConfig = {
            method: request.method,
            url: request.url,
            headers: request.headers,
            data: JSON.stringify(subConfig),
        };

        const response = await axios.request(reqConfig);
        return response.data;
    }

    async unsubscribe (subscriptionId: string) {
        const url = new URL(config.SUBSCRIPTIONS_ENDPOINT + '/subscription/' + subscriptionId);

        //@ts-ignore
        await this.awsConfig.credentials.getPromise();
        if (!this.awsConfig.credentials) throw new Error('AWS creds not set'); 

        const request = aws4.sign({
            host: url.host,
            url: url.href,
            method: 'DELETE',
            path: `${url.pathname}${url.search}`,
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            secretAccessKey: this.awsConfig.credentials.secretAccessKey,
            accessKeyId: this.awsConfig.credentials.accessKeyId,
            sessionToken: this.awsConfig.credentials.sessionToken
        });

        const reqConfig = {
            method: request.method,
            url: request.url,
            headers: request.headers
        };

        const response = await axios.request(reqConfig);
        return response.data;
    }

}