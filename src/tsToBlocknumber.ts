import { isDebugMode } from './utils'
import axios from 'axios'
import aws4 from 'aws4'
import moment from 'moment-timezone'
import { URL } from 'url'

function getTimestampsToCache (timezone: string) {
  const ts: number[] = []

  const iterateDate = moment()
    .tz(timezone)
    .startOf('month')

  for (let i = 0; i < 24; i++) {
    iterateDate.subtract(1, 'month')
    ts.push(iterateDate.unix())
  }

  return ts
}

export async function warmBlockNumberFromTimestampCache (
  endpoint: string,
  creds: any,
  tz: string
) {
  const timestamps = getTimestampsToCache(tz)
  console.log('Warming', timestamps)

  const actions = timestamps.map(ts => {
    return getBlockNumberFromTimestamp(endpoint, creds, ts).catch(err => {
      console.error('Failed to warm cache for timestamp', ts, err.response.data)
    })
  })

  return Promise.all(actions)
}

export async function getBlockNumberFromTimestamp (
  endpoint: string,
  creds: any,
  ts: number
) {
  const url = new URL(`${endpoint}/${ts}`)
  return callEndpoint(url, creds)
}

export async function getBlockNumberFromIso (
  endpoint: string,
  creds: any,
  iso: string
) {
  const url = new URL(`${endpoint}/iso/${encodeURIComponent(iso)}`)
  return callEndpoint(url, creds)
}

async function callEndpoint (url: URL, creds: any) {
  const request = aws4.sign(
    {
      host: url.host,
      url: url.href,
      method: 'GET',
      path: `${url.pathname}${url.search}`,
      headers: {
        'Content-Type': 'application/json'
      }
    },
    creds
  )

  const reqConfig = {
    method: request.method,
    url: request.url,
    headers: request.headers
  }

  if (isDebugMode()) console.log(reqConfig)

  try {
    const response = await axios.request(reqConfig)
    return response.data
  } catch (err) {
    console.error('Error getting blocknumber from timestamp endpoint', err)
    throw err
  }
}
