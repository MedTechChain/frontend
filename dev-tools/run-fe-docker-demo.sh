#!/bin/bash

cd -- "$(dirname "$0")"

NETWORK="medtechchain"

if [ ! "$(docker network ls --format "{{.Name}}" | grep "^$NETWORK$")" ]; then
    docker network create --driver bridge "$NETWORK"
fi

echo ">>> Running MedTechChain Frontend for Demo (IGNORE WARNINGS) <<<"

docker-compose --profile demo -p medtechchain up --build -d