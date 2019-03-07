import aws4 from 'aws4'
import axios from 'axios'
import { URL } from 'url'

export async function subscribe(endpoint: string, creds: any, subConfig: any) {
  const url = new URL(endpoint + '/subscription')

  const request = aws4.sign(
    {
      host: url.host,
      url: url.href,
      method: 'PUT',
      path: `${url.pathname}${url.search}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subConfig)
    },
    creds
  )

  const reqConfig = {
    method: request.method,
    url: request.url,
    headers: request.headers,
    data: JSON.stringify(subConfig)
  }

  try {
    const response = await axios.request(reqConfig)
    return response.data
  } catch (err) {
    console.error('Error subscribing', err)
    throw err
  }
}

export async function listSubs(endpoint: string, creds: any, filter: any) {
  const url = new URL(endpoint + '/subscription')

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

  try {
    const response = await axios.request(reqConfig)
    return response.data
  } catch (err) {
    console.error('Error listing subscriptions', err)
    throw err
  }
}

export async function unsubscribe(endpoint: string, creds: any, subId: string) {
  const url = new URL(endpoint + '/subscription/' + subId)

  const request = aws4.sign(
    {
      host: url.host,
      url: url.href,
      method: 'DELETE',
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

  try {
    const response = await axios.request(reqConfig)
    return response.data
  } catch (err) {
    console.error('Error unsubscribing', err)
    throw err
  }
}
