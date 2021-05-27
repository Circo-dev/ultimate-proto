#!/bin/bash

DAYS=${1:-7}

curl -X GET "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_btc_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_eth_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/cardano/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_ada_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/chainlink/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_link_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/vechain/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_vet_usd.json
curl -X GET "https://api.coingecko.com/api/v3/coins/pancakeswap-token/market_chart?vs_currency=usd&days=$DAYS" -H "accept: application/json" > chart_cake_usd.json
