#!/bin/bash

curl -X GET "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false" -H "accept: application/json" > details_btc.json
curl -X GET "https://api.coingecko.com/api/v3/coins/ethereum?localization=false" -H "accept: application/json" > details_eth.json
curl -X GET "https://api.coingecko.com/api/v3/coins/cardano?localization=false" -H "accept: application/json" > details_ada.json
curl -X GET "https://api.coingecko.com/api/v3/coins/chainlink?localization=false" -H "accept: application/json" > details_link.json
curl -X GET "https://api.coingecko.com/api/v3/coins/vechain?localization=false" -H "accept: application/json" > details_vet.json
curl -X GET "https://api.coingecko.com/api/v3/coins/pancakeswap-token?localization=false" -H "accept: application/json" > details_cake.json

./load_charts.sh $1
