import { SharedIniFileCredentials, Config } from 'aws-sdk'

import config, { IConfig } from './config'
import { isDebugMode } from './utils'

import * as watcher from './watcher'
import * as oracle from './oracle'
import * as tsToBlocknumber from './tsToBlocknumber'

export interface ICred {
  secretAccessKey?: string
  accessKeyId: string
  sessionToken: string | undefined
}

export class ChainOps {
  awsConfig: Config
  config: IConfig
  isLambdaExecution: boolean

  constructor(env: string | IConfig) {
    this.awsConfig = new Config()
    this.isLambdaExecution = this.getIsLambdaExecution()

    if (!this.isLambdaExecution)
      this.awsConfig.credentials = new SharedIniFileCredentials()

    if (typeof env === 'string') {
      console.log('Setting config from env:', env)
      this.config = config[env]
    } else {
      console.log('Setting config from object:', env)
      this.config = env
    }
  }

  async getGasPrice(blockNumber?: number) {
    return oracle.getGasPrice(this.getEndpoint('ORACLE_URL'), blockNumber)
  }

  getEndpoint(endpointName: string): string {
    //@ts-ignore
    if (!this.config[endpointName] || this.config[endpointName].length === 0) {
      throw new Error(endpointName + ' endpoint not defined')
    }

    //@ts-ignore
    return this.config[endpointName]
  }

  async subscribe(subConfig: any) {
    const creds = await this.getCreds()

    return watcher.subscribe(
      this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'),
      creds,
      subConfig
    )
  }

  async unsubscribe(subscriptionId: string) {
    const creds = await this.getCreds()

    return watcher.unsubscribe(
      this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'),
      creds,
      subscriptionId
    )
  }

  async getBlockNumberFromTimestamp(ts: number) {
    const creds = await this.getCreds()

    return tsToBlocknumber.getBlockNumberFromTimestamp(
      this.getEndpoint('TS_TO_BLOCKNUMBER'),
      creds,
      ts
    )
  }

  async getBlockNumberFromIso(isoString: string) {
    const creds = await this.getCreds()

    return tsToBlocknumber.getBlockNumberFromIso(
      this.getEndpoint('TS_TO_BLOCKNUMBER'),
      creds,
      isoString
    )
  }

  //makes the calls to precache the last 24 months
  async warmBlockNumberFromTimestampCache(timezone: string = 'Etc/UTC') {
    const creds = await this.getCreds()

    return tsToBlocknumber.warmBlockNumberFromTimestampCache(
      this.getEndpoint('TS_TO_BLOCKNUMBER'),
      creds,
      timezone
    )
  }

  async getCreds() {
    if (isDebugMode()) console.log('AWS Creds', this.awsConfig.credentials)
    if (!this.awsConfig.credentials) throw new Error('AWS creds not set')

    // @ts-ignore
    if (!this.isLambdaExecution) await this.awsConfig.credentials.getPromise()

    const creds: ICred = {
      accessKeyId: this.awsConfig.credentials.accessKeyId,
      sessionToken: this.awsConfig.credentials.sessionToken,
      secretAccessKey: this.awsConfig.credentials.secretAccessKey
    }

    if (isDebugMode()) console.log(creds)

    return creds
  }

  getIsLambdaExecution() {
    const env = process.env.AWS_LAMBDA_FUNCTION_NAME
    return !!(env && env.length > 0)
  }
}
