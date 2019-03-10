"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDebugMode() {
    const DEBUG_ENV_VAR = 'CHAINOPS_SDK_DEBUG';
    return !!process.env[DEBUG_ENV_VAR] && process.env[DEBUG_ENV_VAR] === 'true';
}
exports.isDebugMode = isDebugMode;
