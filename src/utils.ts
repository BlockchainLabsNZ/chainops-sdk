export function isDebugMode() {
  const DEBUG_ENV_VAR = 'CHAINOPS_SDK_DEBUG'
  return !!process.env[DEBUG_ENV_VAR] && process.env[DEBUG_ENV_VAR] === 'true'
}
