import { SharedIniFileCredentials, Config } from 'aws-sdk'

import config, { IConfig } from './config' // eslint-disable-line no-unused-vars
import { isDebugMode } from './utils'

import * as watcher from './watcher'
import * as oracle from './oracle'
import * as tsToBlocknumber from './tsToBlocknumber'

export interface ICred {
  secretAccessKey?: string
  accessKeyId: string
  sessionToken: string | undefined
}

export interface EthAddress {
  address: string
}

export class ChainOps {
  awsConfig: Config
  config: IConfig
  isLambdaExecution: boolean

  constructor (env: string | IConfig) {
    this.awsConfig = new Config()
    this.isLambdaExecution = this.getIsLambdaExecution()

    if (!this.isLambdaExecution) { this.awsConfig.credentials = new SharedIniFileCredentials() }

    if (typeof env === 'string') {
      console.log('Setting config from env:', env)
      this.config = config[env]
    } else {
      console.log('Setting config from object:', env)
      this.config = env
    }
  }

  /**
   * Query for the gas price of a particular block
   * @param blockNumber The block number you are interested in
   */
  async getGasPrice (blockNumber?: number) {
    return oracle.getGasPrice(this.getEndpoint('ORACLE_URL'), blockNumber)
  }

  getEndpoint (endpointName: string): string {
    // @ts-ignore
    if (!this.config[endpointName] || this.config[endpointName].length === 0) {
      throw new Error(endpointName + ' endpoint not defined')
    }

    // @ts-ignore
    return this.config[endpointName]
  }

  /**
   * Query the watcher for the optimistic balance for an address
   * https://github.com/BlockchainLabsNZ/chainops-watcher/blob/feature/optimistic/OptimisticBalances.md
   * @param wallet The address you'd like the balance of
   * @param tokenContract The token balance you're interested in
   */
  async getOptimisticBalance (wallet: EthAddress, tokenContract: EthAddress): Promise<string> {
    if (!wallet) {
      throw new Error('wallet is required')
    }
    if (!tokenContract) {
      throw new Error('tokenContract is required')
    }
    const creds = await this.getCreds()

    return watcher.getOptimisticBalance(
      this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'),
      creds,
      wallet,
      tokenContract
    )
  }

  /**
   * Let the watcher know about a new pending token transfer
   * @param executionId The ChainOps Execution ID for the transfer
   * @param tokenContract The contract for the tokens being transferred
   * @param senderAddress The sender of the tokens
   * @param tokenAmount The amount of tokens being sent
   */
  async logOptimisticPending (executionId: string, tokenContract: EthAddress, senderAddress: EthAddress, tokenAmount: string): Promise<void> {
    if (!executionId) {
      throw new Error('executionId is required')
    }
    if (!tokenContract) {
      throw new Error('tokenContract is required')
    }
    if (!senderAddress) {
      throw new Error('senderAddress is required')
    }
    if (!tokenAmount) {
      throw new Error('tokenAmount is required')
    }
    const creds = await this.getCreds()

    return watcher.logOptimisticPending(
      this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'),
      creds,
      executionId,
      tokenContract,
      senderAddress,
      tokenAmount
    )
  }

  /**
   * Get the version of the deployed watcher
   */
  async watcherVersion () {
    const creds = await this.getCreds()

    return watcher.version(
      this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'),
      creds
    )
  }

  /**
   * Create a new watcher subscription
   * @param subConfig Configuration for your new subscription
   */
  async subscribe (subConfig: any) {
    const creds = await this.getCreds()

    return watcher.subscribe(
      this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'),
      creds,
      subConfig
    )
  }

  /**
   * Destroy an existing watcher subscription
   * @param subscriptionId The ID you'd like to destroy
   */
  async unsubscribe (subscriptionId: string) {
    const creds = await this.getCreds()

    return watcher.unsubscribe(
      this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'),
      creds,
      subscriptionId
    )
  }

  /**
   * Get a list of existing subscriptions
   * @param filter Filter which subscriptions you get back
   */
  async listSubs (filter: watcher.IListFilter) {
    const creds = await this.getCreds()

    return watcher.listSubs(
      this.getEndpoint('SUBSCRIPTIONS_ENDPOINT'),
      creds,
      filter
    )
  }

  /**
   * Query for a block number based on a timestamp
   * @param ts Timestamp you'd like to know the block number of
   */
  async getBlockNumberFromTimestamp (ts: number) {
    const creds = await this.getCreds()

    return tsToBlocknumber.getBlockNumberFromTimestamp(
      this.getEndpoint('TS_TO_BLOCKNUMBER'),
      creds,
      ts
    )
  }

  /**
   * Query for the block number based on an isostring
   * @param isoString ISOString you'd like to know the block number of
   */
  async getBlockNumberFromIso (isoString: string) {
    const creds = await this.getCreds()

    return tsToBlocknumber.getBlockNumberFromIso(
      this.getEndpoint('TS_TO_BLOCKNUMBER'),
      creds,
      isoString
    )
  }

  // makes the calls to precache the last 24 months
  async warmBlockNumberFromTimestampCache (timezone: string = 'Etc/UTC') {
    const creds = await this.getCreds()

    return tsToBlocknumber.warmBlockNumberFromTimestampCache(
      this.getEndpoint('TS_TO_BLOCKNUMBER'),
      creds,
      timezone
    )
  }

  async getCreds () {
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

  getIsLambdaExecution () {
    const env = process.env.AWS_LAMBDA_FUNCTION_NAME
    return !!(env && env.length > 0)
  }
}
