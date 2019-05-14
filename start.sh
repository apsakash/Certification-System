#!/bin/sh

export FABRIC_CFG_PATH=${PWD}
export CHANNEL_NAME=certchannel

# network name is COMPOSE_PROJECT_NAME_basic
export COMPOSE_PROJECT_NAME=project-v9


set -ev

docker-compose -f docker-compose.yaml down

docker-compose -f docker-compose.yaml up -d ca.example.com orderer.example.com peer0.org1.example.com couchdb cli

export FABRIC_START_TIMEOUT=10
sleep ${FABRIC_START_TIMEOUT}

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c $CHANNEL_NAME -f /etc/hyperledger/configtx/channel.tx

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b $CHANNEL_NAME.block

set -e

rm -rf ./hfc-key-store

CC_RUNTIME_LANGUAGE=golang
CC_SRC_PATH=github.com/certificate/go

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n cert -v 1.0 -p "$CC_SRC_PATH" -l "$CC_RUNTIME_LANGUAGE"

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o orderer.example.com:7050 -C certchannel -n cert -l "$CC_RUNTIME_LANGUAGE" -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

sleep 10

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C certchannel -n cert -c '{"function":"initLedger","Args":[]}'


