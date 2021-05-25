#!/bin/bash

DAYS=${1:-7}

curl -X GET "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_btc_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_eth_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/cardano/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_ada_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/matic-network/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_matic_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_sol_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/hot-cross/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_hot-cross_usd.json
