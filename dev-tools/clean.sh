#!/bin/bash

SCRIPT_DIR="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"
cd "$SCRIPT_DIR"

docker-compose -p healthblocks-ums down
