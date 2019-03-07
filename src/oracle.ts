import { isDebugMode } from './utils'
import axios from 'axios'

export async function getGasPrice(endpoint: string, blockNumber?: number) {
  const file = `${blockNumber || 'latest'}.json`
  const config = {
    baseURL: endpoint,
    url: file
  }

  if (isDebugMode()) console.log(config)

  const response = await axios.request(config)

  try {
    return response.data.analysis
  } catch (err) {
    throw new Error(
      `Could not retrieve gas prices for block: ${blockNumber || 'latest'}`
    )
  }
}
