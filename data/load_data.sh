#!/bin/bash

curl -X GET "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false" -H "accept: application/json" > details_btc.json
curl -X GET "https://api.coingecko.com/api/v3/coins/ethereum?localization=false" -H "accept: application/json" > details_eth.json
curl -X GET "https://api.coingecko.com/api/v3/coins/cardano?localization=false" -H "accept: application/json" > details_ada.json
curl -X GET "https://api.coingecko.com/api/v3/coins/matic-network?localization=false" -H "accept: application/json" > details_matic.json
curl -X GET "https://api.coingecko.com/api/v3/coins/solana?localization=false" -H "accept: application/json" > details_sol.json

./load_charts.sh 30