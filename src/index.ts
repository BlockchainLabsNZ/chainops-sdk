import aws4 from 'aws4'
import axios from 'axios'
import { URL } from 'url'
import { SharedIniFileCredentials, Config } from 'aws-sdk'

import config, { IConfig } from './config'

interface ICred {
  secretAccessKey?: string
  accessKeyId: string
  sessionToken: string | undefined
}

export class ChainOps {
    awsConfig: Config
    config: IConfig
    isLambdaExecution: boolean

    constructor (env: string | IConfig) {
      this.awsConfig = new Config()
      this.isLambdaExecution = this.getIsLambdaExecution()

      if (!this.isLambdaExecution) this.awsConfig.credentials = new SharedIniFileCredentials()

      if (typeof env === 'string') {
        console.log('Setting config from env:', env)
        this.config = config[env]
      } else {
        console.log('Setting config from object:', env)
        this.config = env
      }
    }

    async getGasPrice (blockNumber?: number) {
      if (!this.config.ORACLE_URL || this.config.ORACLE_URL.length === 0) {
        throw new Error('Oracle endpoint not defined')
      }

      const file = `${blockNumber || 'latest'}.json`
      const config = {
        baseURL: this.config.ORACLE_URL,
        url: file
      }

      if (this.isDebugMode()) console.log(config)

      const response = await axios.request(config)

      try {
        return response.data.analysis
      } catch (err) {
        throw new Error(`Could not retrieve gas prices for block: ${blockNumber || 'latest'}`)
      }
    }

    async subscribe (subConfig: any) {
      if (!this.config.SUBSCRIPTIONS_ENDPOINT || this.config.SUBSCRIPTIONS_ENDPOINT.length === 0) {
        throw new Error('Subscriptions endpoint not defined')
      }

      const url = new URL(this.config.SUBSCRIPTIONS_ENDPOINT + '/subscription')

      // @ts-ignore
      if (!this.isLambdaExecution) await this.awsConfig.credentials.getPromise()

      if (this.isDebugMode()) console.log('AWS Creds', this.awsConfig.credentials)

      const request = aws4.sign({
        host: url.host,
        url: url.href,
        method: 'PUT',
        path: `${url.pathname}${url.search}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subConfig)
      }, this.getCreds())

      const reqConfig = {
        method: request.method,
        url: request.url,
        headers: request.headers,
        data: JSON.stringify(subConfig)
      }

      if (this.isDebugMode()) console.log(reqConfig)

      try {
        const response = await axios.request(reqConfig)
        return response.data
      }catch(err) {
        console.error('Erorr subscribing', err)
        throw err
      }
    }

    async unsubscribe (subscriptionId: string) {
      if (!this.config.SUBSCRIPTIONS_ENDPOINT || this.config.SUBSCRIPTIONS_ENDPOINT.length === 0) {
        throw new Error('Subscriptions endpoint not defined')
      }

      const url = new URL(this.config.SUBSCRIPTIONS_ENDPOINT + '/subscription/' + subscriptionId)

      // @ts-ignore
      if (!this.isLambdaExecution) await this.awsConfig.credentials.getPromise()

      const request = aws4.sign({
        host: url.host,
        url: url.href,
        method: 'DELETE',
        path: `${url.pathname}${url.search}`,
        headers: {
          'Content-Type': 'application/json'
        }
      }, this.getCreds())

      const reqConfig = {
        method: request.method,
        url: request.url,
        headers: request.headers
      }

      try {
        const response = await axios.request(reqConfig)
        return response.data
      }catch(err) {
        console.error('Error unsubscribing', err)
        throw err
      }
    }

    async getBlockNumberFromTimestamp (ts: number) {
      if (!this.config.TS_TO_BLOCKNUMBER || this.config.TS_TO_BLOCKNUMBER.length === 0) {
        throw new Error('Timestamp to blocknumber endpoint not defined')
      }

      const url = new URL(`${this.config.TS_TO_BLOCKNUMBER}/${ts}`)

      // @ts-ignore
      if (!this.isLambdaExecution) await this.awsConfig.credentials.getPromise()

      if (this.isDebugMode()) console.log('AWS Creds', this.awsConfig.credentials)

      const request = aws4.sign({
        host: url.host,
        url: url.href,
        method: 'GET',
        path: `${url.pathname}${url.search}`,
        headers: {
          'Content-Type': 'application/json'
        },
      }, this.getCreds())

      const reqConfig = {
        method: request.method,
        url: request.url,
        headers: request.headers,
      }

      if (this.isDebugMode()) console.log(reqConfig)

      try {
        const response = await axios.request(reqConfig)
        return response.data
      }catch(err) {
        console.error('Error getting blocknumber from timestamp', err);
        throw err
      }
    }

    getCreds () {
      if (!this.awsConfig.credentials) throw new Error('AWS creds not set')

      const creds: ICred = {
        accessKeyId: this.awsConfig.credentials.accessKeyId,
        sessionToken: this.awsConfig.credentials.sessionToken,
        secretAccessKey: this.awsConfig.credentials.secretAccessKey
      }

      // if (!this.isLambdaExecution) {
      //   creds.secretAccessKey = this.awsConfig.credentials.secretAccessKey
      // }

      if (this.isDebugMode()) console.log(creds)

      return creds
    }

    getIsLambdaExecution () {
      const env = process.env.AWS_LAMBDA_FUNCTION_NAME
      return !!(env && env.length > 0)
    }

    isDebugMode () {
      const DEBUG_ENV_VAR = 'CHAINOPS_SDK_DEBUG'
      return process.env[DEBUG_ENV_VAR] && process.env[DEBUG_ENV_VAR] === 'true'
    }
}
