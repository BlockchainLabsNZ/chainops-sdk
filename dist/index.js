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
const config_1 = __importDefault(require("./config"));
class ChainOps {
    constructor(env) {
        this.awsConfig = new aws_sdk_1.Config();
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
            const file = `${blockNumber || 'latest'}.json`;
            const response = yield axios_1.default.request({
                baseURL: this.config.ORACLE_URL,
                url: file
            });
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
            const url = new url_1.URL(this.config.SUBSCRIPTIONS_ENDPOINT + '/subscription');
            //@ts-ignore
            yield this.awsConfig.credentials.getPromise();
            if (!this.awsConfig.credentials)
                throw new Error('AWS creds not set');
            const request = aws4_1.default.sign({
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
            const response = yield axios_1.default.request(reqConfig);
            return response.data;
        });
    }
    unsubscribe(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new url_1.URL(this.config.SUBSCRIPTIONS_ENDPOINT + '/subscription/' + subscriptionId);
            //@ts-ignore
            yield this.awsConfig.credentials.getPromise();
            if (!this.awsConfig.credentials)
                throw new Error('AWS creds not set');
            const request = aws4_1.default.sign({
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
            const response = yield axios_1.default.request(reqConfig);
            return response.data;
        });
    }
}
exports.ChainOps = ChainOps;
