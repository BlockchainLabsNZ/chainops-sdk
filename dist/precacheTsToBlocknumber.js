"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
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
exports.getTimestampsToCache = getTimestampsToCache;
