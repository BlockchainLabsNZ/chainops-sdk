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
function subscribe(endpoint, creds, subConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new url_1.URL(endpoint + '/subscription');
        const request = aws4_1.default.sign({
            host: url.host,
            url: url.href,
            method: 'PUT',
            path: `${url.pathname}${url.search}`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subConfig)
        }, creds);
        const reqConfig = {
            method: request.method,
            url: request.url,
            headers: request.headers,
            data: JSON.stringify(subConfig)
        };
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
exports.subscribe = subscribe;
function listSubs(endpoint, creds, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new url_1.URL(endpoint + '/subscription');
        const request = aws4_1.default.sign({
            host: url.host,
            url: url.href,
            method: 'GET',
            path: `${url.pathname}${url.search}`,
            headers: {
                'Content-Type': 'application/json'
            }
        }, creds);
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
            console.error('Error listing subscriptions', err);
            throw err;
        }
    });
}
exports.listSubs = listSubs;
function unsubscribe(endpoint, creds, subId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new url_1.URL(endpoint + '/subscription/' + subId);
        const request = aws4_1.default.sign({
            host: url.host,
            url: url.href,
            method: 'DELETE',
            path: `${url.pathname}${url.search}`,
            headers: {
                'Content-Type': 'application/json'
            }
        }, creds);
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
exports.unsubscribe = unsubscribe;
