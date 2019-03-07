"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws4_1 = __importDefault(require("aws4"));
const axios_1 = __importDefault(require("axios"));
const url_1 = require("url");
const aws_sdk_1 = require("aws-sdk");
const precacheTsToBlocknumber_1 = require("./precacheTsToBlocknumber");
const config_1 = __importDefault(require("./config"));
class ChainOps {
    constructor(env) {
        this.awsConfig = new aws_sdk_1.Config();
        this.isLambdaExecution = this.getIsLambdaExecution();
        if (!this.isLambdaExecution)
            this.awsConfig.credentials = new aws_sdk_1.SharedIniFileCredentials();
        if (typeof env === 'string') {
            console.log('Setting config from env:', env);
            this.config = config_1.default[env];
        }
        else {
            console.log('Setting config from object:', env);
            this.config = env;
        }
    }
    getGasPrice(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.ORACLE_URL || this.config.ORACLE_URL.length === 0) {
                throw new Error('Oracle endpoint not defined');
            }
            const file = `${blockNumber || 'latest'}.json`;
            const config = {
                baseURL: this.config.ORACLE_URL,
                url: file
            };
            if (this.isDebugMode())
                console.log(config);
            const response = yield axios_1.default.request(config);
            try {
                return response.data.analysis;
            }
            catch (err) {
                throw new Error(`Could not retrieve gas prices for block: ${blockNumber || 'latest'}`);
            }
        });
    }
    subscribe(subConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.SUBSCRIPTIONS_ENDPOINT ||
                this.config.SUBSCRIPTIONS_ENDPOINT.length === 0) {
                throw new Error('Subscriptions endpoint not defined');
            }
            const url = new url_1.URL(this.config.SUBSCRIPTIONS_ENDPOINT + '/subscription');
            // @ts-ignore
            if (!this.isLambdaExecution)
                yield this.awsConfig.credentials.getPromise();
            if (this.isDebugMode())
                console.log('AWS Creds', this.awsConfig.credentials);
            const request = aws4_1.default.sign({
                host: url.host,
                url: url.href,
                method: 'PUT',
                path: `${url.pathname}${url.search}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subConfig)
            }, this.getCreds());
            const reqConfig = {
                method: request.method,
                url: request.url,
                headers: request.headers,
                data: JSON.stringify(subConfig)
            };
            if (this.isDebugMode())
                console.log(reqConfig);
            try {
                const response = yield axios_1.default.request(reqConfig);
                return response.data;
            }
            catch (err) {
                console.error('Error subscribing', err);
                throw err;
            }
        });
    }
    unsubscribe(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.SUBSCRIPTIONS_ENDPOINT ||
                this.config.SUBSCRIPTIONS_ENDPOINT.length === 0) {
                throw new Error('Subscriptions endpoint not defined');
            }
            const url = new url_1.URL(this.config.SUBSCRIPTIONS_ENDPOINT + '/subscription/' + subscriptionId);
            // @ts-ignore
            if (!this.isLambdaExecution)
                yield this.awsConfig.credentials.getPromise();
            const request = aws4_1.default.sign({
                host: url.host,
                url: url.href,
                method: 'DELETE',
                path: `${url.pathname}${url.search}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }, this.getCreds());
            const reqConfig = {
                method: request.method,
                url: request.url,
                headers: request.headers
            };
            try {
                const response = yield axios_1.default.request(reqConfig);
                return response.data;
            }
            catch (err) {
                console.error('Error unsubscribing', err);
                throw err;
            }
        });
    }
    getBlockNumberFromTimestamp(ts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.TS_TO_BLOCKNUMBER ||
                this.config.TS_TO_BLOCKNUMBER.length === 0) {
                throw new Error('Timestamp to blocknumber endpoint not defined');
            }
            const url = new url_1.URL(`${this.config.TS_TO_BLOCKNUMBER}/${ts}`);
            return this.callBlockNumberFromTimestamp(url);
        });
    }
    getBlockNumberFromIso(isoString) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.TS_TO_BLOCKNUMBER ||
                this.config.TS_TO_BLOCKNUMBER.length === 0) {
                throw new Error('Timestamp to blocknumber endpoint not defined');
            }
            const url = new url_1.URL(`${this.config.TS_TO_BLOCKNUMBER}/iso/${encodeURIComponent(isoString)}`);
            return this.callBlockNumberFromTimestamp(url);
        });
    }
    callBlockNumberFromTimestamp(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            if (!this.isLambdaExecution)
                yield this.awsConfig.credentials.getPromise();
            if (this.isDebugMode())
                console.log('AWS Creds', this.awsConfig.credentials);
            const request = aws4_1.default.sign({
                host: url.host,
                url: url.href,
                method: 'GET',
                path: `${url.pathname}${url.search}`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }, this.getCreds());
            const reqConfig = {
                method: request.method,
                url: request.url,
                headers: request.headers
            };
            if (this.isDebugMode())
                console.log(reqConfig);
            try {
                const response = yield axios_1.default.request(reqConfig);
                return response.data;
            }
            catch (err) {
                console.error('Error calling blocknumber from timestamp endpoint', err);
                throw err;
            }
        });
    }
    //makes the calls to precache the last 24 months
    warmBlockNumberFromTimestampCache(timezone) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamps = precacheTsToBlocknumber_1.getTimestampsToCache(timezone);
            console.log('Warming', timestamps);
            const actions = timestamps.map(ts => {
                return this.getBlockNumberFromTimestamp(ts).catch(err => {
                    console.error('Failed to warm cache for timestamp', ts, err);
                });
            });
            return Promise.all(actions);
        });
    }
    getCreds() {
        if (!this.awsConfig.credentials)
            throw new Error('AWS creds not set');
        const creds = {
            accessKeyId: this.awsConfig.credentials.accessKeyId,
            sessionToken: this.awsConfig.credentials.sessionToken,
            secretAccessKey: this.awsConfig.credentials.secretAccessKey
        };
        // if (!this.isLambdaExecution) {
        //   creds.secretAccessKey = this.awsConfig.credentials.secretAccessKey
        // }
        if (this.isDebugMode())
            console.log(creds);
        return creds;
    }
    getIsLambdaExecution() {
        const env = process.env.AWS_LAMBDA_FUNCTION_NAME;
        return !!(env && env.length > 0);
    }
    isDebugMode() {
        const DEBUG_ENV_VAR = 'CHAINOPS_SDK_DEBUG';
        return process.env[DEBUG_ENV_VAR] && process.env[DEBUG_ENV_VAR] === 'true';
    }
}
exports.ChainOps = ChainOps;
