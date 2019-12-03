# Changelog

## 1.5.0 - Fri 29 Nov 2019
Adds endpoints to log and test address to watcher's pending bloom filter

Log pending transaction for optimistic now allows optional ttl param, this defaults to null i.e. won't expire
This is used for optimistically crediting users for deposits.