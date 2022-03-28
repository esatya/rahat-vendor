<p align="center">
   <a href="https://coveralls.io/github/esatya/rahat-vendor?branch=master">
    <img src="https://coveralls.io/repos/github/esatya/rahat-vendor/badge.svg?branch=master" alt="Coverage" />
  </a>
  <a href="https://github.com/esatya/rahat-vendor/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/esatya/rahat-vendor/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-AGPL_v3-blue.svg" alt="License" />
  </a>
</p>

# Introduction
Vendor app is a web-based Blockchain-based Wallet for Rahat vendors to signup and recieve tokens for beneficiaries.

_Important: This project is part of [Rahat Project](https://github.com/esatya/rahat). Please make sure you have setup Rahat service first._

# Rahat
Rahat is a blockchain-based digital relief distribution management platform for humanitarian agencies to support marginalized communities. It issues, manages and monitors relief distribution in the form of digital tokens. It creates a transparent, efficient and cheaper way to distribute cash or goods. It mobilizes the local community encouraging financial resilience and freedom. For more information please visit https://rahat.io.

Rahat’s main features are:
- Dashboard for aid agencies to issue relief tokens to recipients & to onboard local community vendors. Agencies can audit all transactional information real-time. 
- Mobile based wallet app for local vendors to initiate & record relief token transaction in a blockchain network & cash transfer from banks.
- A SMS feature for recipients to receive their token and/or assigned digital card with QR code to buy relief products from participating local merchants.
- Transaction data in blockchain network to verify the flow of tokens.
- A platform for local authorities & aid agencies to connect.

# Getting Started

This is a web-based mobile-view application/wallet that directly interact with Ethereum blockchain to send transactions. This web-app is designed to work on following environments:

* Node-js --version == 10.18.1
* Yarn --version == 1.21.1
* MongoDB --version >= 4.2.8

# Prerequisite

To run this software on your machine locally you need to run the following:

* [Rahat Server](https://github.com/esatya/rahat)
* Ganache

# Installing

To setup this applicaion on your machine locally you need to clone this repository to your local machine and create a folder named 'config' on root of this repository. Add two files there

* local.json
```
  {
    "app": {
      "port": 3700
    },
    "services": {}
  }
```
* client.json
```
  {
    "debugMode": true,
    "api": "http://localhost:3800/api/v1",
    "web3": {
      "networkId": 5777,
      "httpProvider": "http://localhost:8545",
      "webSocketProvider": "http://localhost:8545"
    },
    "services": {
      "google": {
        "clientId": "{from google console}",
        "scope": "profile email https://www.googleapis.com/auth/drive",
        "ux_mode": "redirect",
        "redirect_uri": "http://localhost:3700/setup/google"
      }
    }
  }
```
  
To start this application, perform the following steps

* Run Fully working [Rahat Server](https://github.com/esatya/rahat)
* Run ganache - It should already be running while you setup your server
* start backend: ```yarn start```
* start frontend:  ```yarn client```

# Deployment
To deploy this software on production 

* you need a fully deployed [Rahat Server](https://github.com/esatya/rahat)
* update the rahat server api on ```client.json````
# Coding Styles
This repository uses eslint to enforce air-bnb coding styles.

# Contributing
Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in [Discord](https://discord.gg/AV5j2T94VR) in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://docs.rahat.io/docs/next/Contribution-Guidelines).
