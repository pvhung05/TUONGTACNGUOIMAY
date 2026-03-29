#!/bin/bash

mkdir -p .next/dev/logs .next/dev/cache

pnpm run dev &

node watcher.js

wait
