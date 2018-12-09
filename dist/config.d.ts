declare const config: IEnvConfig;
export interface IConfig {
    ORACLE_URL: string;
    SUBSCRIPTIONS_ENDPOINT: string;
}
interface IEnvConfig {
    [env: string]: IConfig;
}
export default config;
