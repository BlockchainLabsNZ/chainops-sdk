const config: IEnvConfig = {
  kovan: {
    ORACLE_URL:
      'https://s3-ap-southeast-2.amazonaws.com/chainops-oracle-production-history-store/',
    SUBSCRIPTIONS_ENDPOINT:
      'https://1pt9mrjjld.execute-api.ap-southeast-2.amazonaws.com/kovan',
    TS_TO_BLOCKNUMBER:
      'https://tnpfrrszff.execute-api.ap-southeast-2.amazonaws.com/mainnet'
  },
  mainnet: {
    ORACLE_URL:
      'https://s3-ap-southeast-2.amazonaws.com/chainops-oracle-production-history-store/',
    SUBSCRIPTIONS_ENDPOINT:
      'https://xmi8r0snb5.execute-api.ap-southeast-2.amazonaws.com/mainnet',
    TS_TO_BLOCKNUMBER:
      'https://tnpfrrszff.execute-api.ap-southeast-2.amazonaws.com/mainnet'
  }
}

export interface IConfig {
  ORACLE_URL?: string
  SUBSCRIPTIONS_ENDPOINT?: string
  TS_TO_BLOCKNUMBER?: string
}

interface IEnvConfig {
  [env: string]: IConfig
}

export default config
