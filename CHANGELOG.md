# Changelog

## 1.5.0 - Fri 29 Nov 2019
Adds endpoints to log and test address to watcher's pending bloom filter

Optimistically crediting users for deposits 'grants'
Logging a pending transaction for optimistic now allows for two optional parameters:
- ttl: seconds since epoch to expire the grant
- reason: 'grant', blank or empty string default to standard functionality of 'awaiting_execution'
