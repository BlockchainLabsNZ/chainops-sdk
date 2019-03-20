const { filterSubs } = require('../dist/watcher')

describe('Watcher sub filter', () => {
  it('should filter webhook equals', () => {
    expect(
      filterSubs(
        [
          {
            webhook: 'https://'
          },
          {
            webhook: 'http://'
          }
        ],
        {
          webhookEquals: 'https://'
        }
      )
    ).toHaveLength(1)
  })

  it('should filter webhook contains', () => {
    expect(
      filterSubs(
        [
          {
            webhook: 'https://abc.com'
          },
          {
            webhook: 'http://def.com'
          }
        ],
        {
          webhookContains: 'abc'
        }
      )
    ).toHaveLength(1)
  })

  it('should filter name contains', () => {
    expect(
      filterSubs(
        [
          {
            name: 'abc'
          },
          {
            name: 'def'
          }
        ],
        {
          nameContains: 'ab'
        }
      )
    ).toHaveLength(1)
  })

  it('should filter name equals', () => {
    expect(
      filterSubs(
        [
          {
            name: 'abc'
          },
          {
            name: 'def'
          }
        ],
        {
          nameEquals: 'abc'
        }
      )
    ).toHaveLength(1)
  })

  it('should filter if filter contains', () => {
    expect(
      filterSubs(
        [
          {
            filter: { noteven: 'real' }
          },
          {
            filter: { hello: 'world' }
          }
        ],
        {
          filterContains: 'noteven'
        }
      )
    ).toHaveLength(1)
  })

  it('should filter if filter from contains', () => {
    expect(
      filterSubs(
        [
          {
            filter: { addressFrom: '0x123' }
          },
          {
            filter: { addressTo: '0x456' }
          }
        ],
        {
          filterFromContains: '123'
        }
      )
    ).toHaveLength(1)
  })

  it('should filter if filter to contains', () => {
    expect(
      filterSubs(
        [
          {
            filter: { addressFrom: '0x123' }
          },
          {
            filter: { addressTo: '0x456' }
          }
        ],
        {
          filterToContains: '456'
        }
      )
    ).toHaveLength(1)
  })

  it('should filter if filter log topic contains', () => {
    expect(
      filterSubs(
        [
          {
            filter: { topic: '0x123' }
          },
          {
            filter: { topic: '0x456' }
          }
        ],
        {
          filterTopicContains: '2'
        }
      )
    ).toHaveLength(1)
  })

  it('should filter if filter log address contains', () => {
    expect(
      filterSubs(
        [
          {
            filter: { logAddress: '0x123' }
          },
          {
            filter: { logAddress: '0x456' }
          }
        ],
        {
          filterLogAddressContains: '456'
        }
      )
    ).toHaveLength(1)
  })

  it('should return all subs if blank filter', () => {
    expect(
      filterSubs(
        [
          {
            filter: { logAddress: '0x123' }
          },
          {
            filter: { logAddress: '0x456' }
          }
        ],
        {}
      )
    ).toHaveLength(2)
  })
})
