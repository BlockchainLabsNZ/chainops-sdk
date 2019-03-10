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
function getGasPrice(endpoint, blockNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = `${blockNumber || 'latest'}.json`;
        const config = {
            baseURL: endpoint,
            url: file
        };
        if (utils_1.isDebugMode())
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
exports.getGasPrice = getGasPrice;
