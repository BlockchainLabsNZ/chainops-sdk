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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const config_1 = __importDefault(require("./config")); // eslint-disable-line no-unused-vars
const utils_1 = require("./utils");
const watcher = __importStar(require("./watcher"));
const oracle = __importStar(require("./oracle"));
const tsToBlocknumber = __importStar(require("./tsToBlocknumber"));
class ChainOps {
    constructor(env) {
        this.awsConfig = new aws_sdk_1.Config();
        this.isLambdaExecution = this.getIsLambdaExecution();
        if (!this.isLambdaExecution) {
            this.awsConfig.credentials = new aws_sdk_1.SharedIniFileCredentials();
        }
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
            return oracle.getGasPrice(this.getEndpoint('ORACLE_URL'), blockNumber);
        });
    }
    getEndpoint(endpointName) {
        // @ts-ignore
        if (!this.config[endpointName] || this.config[endpointName].length === 0) {
            throw new Error(endpointName + ' endpoint not defined');
        }
        // @ts-ignore
        return this.config[endpointName];
    }
    subscribe(subConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = yield this.getCreds();
            return watcher.subscribe(this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'), creds, subConfig);
        });
    }
    unsubscribe(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = yield this.getCreds();
            return watcher.unsubscribe(this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'), creds, subscriptionId);
        });
    }
    listSubs(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = yield this.getCreds();
            return watcher.listSubs(this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'), creds, filter);
        });
    }
    getBlockNumberFromTimestamp(ts) {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = yield this.getCreds();
            return tsToBlocknumber.getBlockNumberFromTimestamp(this.getEndpoint('TS_TO_BLOCKNUMBER'), creds, ts);
        });
    }
    getBlockNumberFromIso(isoString) {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = yield this.getCreds();
            return tsToBlocknumber.getBlockNumberFromIso(this.getEndpoint('TS_TO_BLOCKNUMBER'), creds, isoString);
        });
    }
    // makes the calls to precache the last 24 months
    warmBlockNumberFromTimestampCache(timezone = 'Etc/UTC') {
        return __awaiter(this, void 0, void 0, function* () {
            const creds = yield this.getCreds();
            return tsToBlocknumber.warmBlockNumberFromTimestampCache(this.getEndpoint('TS_TO_BLOCKNUMBER'), creds, timezone);
        });
    }
    getCreds() {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.isDebugMode())
                console.log('AWS Creds', this.awsConfig.credentials);
            if (!this.awsConfig.credentials)
                throw new Error('AWS creds not set');
            // @ts-ignore
            if (!this.isLambdaExecution)
                yield this.awsConfig.credentials.getPromise();
            const creds = {
                accessKeyId: this.awsConfig.credentials.accessKeyId,
                sessionToken: this.awsConfig.credentials.sessionToken,
                secretAccessKey: this.awsConfig.credentials.secretAccessKey
            };
            if (utils_1.isDebugMode())
                console.log(creds);
            return creds;
        });
    }
    getIsLambdaExecution() {
        const env = process.env.AWS_LAMBDA_FUNCTION_NAME;
        return !!(env && env.length > 0);
    }
}
exports.ChainOps = ChainOps;
