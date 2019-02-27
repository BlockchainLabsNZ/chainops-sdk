import moment from 'moment-timezone'

export function getTimestampsToCache(timezone: string) {
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
