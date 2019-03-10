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
const utils_1 = require("./utils");
const axios_1 = __importDefault(require("axios"));
const aws4_1 = __importDefault(require("aws4"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const url_1 = require("url");
function getTimestampsToCache(timezone) {
    const ts = [];
    const iterateDate = moment_timezone_1.default()
        .tz(timezone)
        .startOf('month');
    for (let i = 0; i < 24; i++) {
        iterateDate.subtract(1, 'month');
        ts.push(iterateDate.unix());
    }
    return ts;
}
function warmBlockNumberFromTimestampCache(endpoint, creds, tz) {
    return __awaiter(this, void 0, void 0, function* () {
        const timestamps = getTimestampsToCache(tz);
        console.log('Warming', timestamps);
        const actions = timestamps.map(ts => {
            return getBlockNumberFromTimestamp(endpoint, creds, ts).catch(err => {
                console.error('Failed to warm cache for timestamp', ts, err.response.data);
            });
        });
        return Promise.all(actions);
    });
}
exports.warmBlockNumberFromTimestampCache = warmBlockNumberFromTimestampCache;
function getBlockNumberFromTimestamp(endpoint, creds, ts) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new url_1.URL(`${endpoint}/${ts}`);
        return callEndpoint(url, creds);
    });
}
exports.getBlockNumberFromTimestamp = getBlockNumberFromTimestamp;
function getBlockNumberFromIso(endpoint, creds, iso) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new url_1.URL(`${endpoint}/iso/${encodeURIComponent(iso)}`);
        return callEndpoint(url, creds);
    });
}
exports.getBlockNumberFromIso = getBlockNumberFromIso;
function callEndpoint(url, creds) {
    return __awaiter(this, void 0, void 0, function* () {
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
        if (utils_1.isDebugMode())
            console.log(reqConfig);
        try {
            const response = yield axios_1.default.request(reqConfig);
            return response.data;
        }
        catch (err) {
            console.error('Error getting blocknumber from timestamp endpoint', err);
            throw err;
        }
    });
}
