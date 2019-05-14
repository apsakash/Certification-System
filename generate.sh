#!/bin/sh

export FABRIC_CFG_PATH=${PWD}
export CHANNEL_NAME=certchannel

# network name is COMPOSE_PROJECT_NAME_basic
export COMPOSE_PROJECT_NAME=project-v9

rm -fr config/*
rm -fr crypto-config/*

./bin/cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
	echo "------------------Failed to generate cryptographic certificate materials-----------------"
	exit 1
fi

./bin/configtxgen -profile OneOrgOrdererGenesis -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
	echo "-----------------Failed to generate orderer genesis block----------------------"
	exit 1
fi

./bin/configtxgen -profile OneOrgChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
	echo "----------------Failed to generate channel configuration transaction--------------"
	exit 1
fi

./bin/configtxgen -profile OneOrgChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
	echo "----------------Failed to generate anchor peer update for Org1MSP-----------------"
	exit 1
fi

