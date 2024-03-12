#!/bin/bash

cd -- "$(dirname "$0")"

NETWORK="medtechchain"

if [ ! "$(docker network ls --format "{{.Name}}" | grep "^$NETWORK$")" ]; then
    docker network create --driver bridge "$NETWORK"
fi

docker-compose --profile demo -p medtechchain-ums up --build -d