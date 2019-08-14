import aws4 from 'aws4'
import axios from 'axios'
import { URL } from 'url'

export async function subscribe (endpoint: string, creds: any, subConfig: any) {
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

export interface IListFilter {
  webhookContains?: string
  webhookEquals?: string
  nameContains?: string
  nameEquals?: string
  filterContains?: string
  filterFromContains?: string
  filterToContains?: string
  filterLogAddressContains?: string
  filterTopicContains?: string
}

export async function listSubs (
  endpoint: string,
  creds: any,
  filter: IListFilter = {}
) {
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
    const filtered = filterSubs(response.data, filter)
    return filtered
  } catch (err) {
    console.error('Error listing subscriptions', err)
    throw err
  }
}

export async function unsubscribe (endpoint: string, creds: any, subId: string) {
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

export function filterSubs (subs: any[], filter: IListFilter) {
  const contains = (
    test: string | string[] | undefined,
    matchString: string
  ) => {
    if (!test) return false

    if (typeof test === 'string') {
      return test.toLowerCase().indexOf(matchString.toLowerCase()) > -1
    }

    // is string array
    for (let i = 0; i < test.length; i++) {
      if (test[i].toLowerCase().indexOf(matchString.toLowerCase()) > -1) { return true }
    }

    return false
  }

  const equals = (test: string | string[] | undefined, matchString: string) => {
    if (!test) return false
    if (typeof test === 'string') { return test.toLowerCase() === matchString.toLowerCase() }

    // is string array
    for (let i = 0; i < test.length; i++) {
      if (test[i].toLowerCase() === matchString.toLowerCase()) return true
    }

    return false
  }

  return subs.filter(sub => {
    if (filter.webhookEquals && !equals(sub.webhook, filter.webhookEquals)) { return false }

    if (
      filter.webhookContains &&
      !contains(sub.webhook, filter.webhookContains)
    ) { return false }

    if (filter.nameEquals && !equals(sub.name, filter.nameEquals)) return false

    if (filter.nameContains && !contains(sub.name, filter.nameContains)) { return false }

    if (
      filter.filterContains &&
      !contains(JSON.stringify(sub.filter), filter.filterContains)
    ) { return false }

    if (
      filter.filterLogAddressContains &&
      !contains(sub.filter.logAddress, filter.filterLogAddressContains)
    ) { return false }

    if (
      filter.filterTopicContains &&
      !contains(sub.filter.topic, filter.filterTopicContains)
    ) { return false }

    if (
      filter.filterFromContains &&
      !contains(sub.filter.addressFrom, filter.filterFromContains)
    ) { return false }

    if (
      filter.filterToContains &&
      !contains(sub.filter.addressTo, filter.filterToContains)
    ) { return false }

    return true
  })
}
