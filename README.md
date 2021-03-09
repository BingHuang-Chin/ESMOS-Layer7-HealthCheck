# ESMOS-Layer7-HealthCheck

## Introduction
A health check application is written in NodeJS to poll CAT, Pulse and OsTicket endpoints for _IS214 - Enterprise Solution Management_ to ensure that the service is alive. Telegram is used as a medium to receive notifications whenever the script determines your service is down so that you can prepare for disaster recovery.

## Prerequisites
1. [NodeJS](https://nodejs.org/en/download/) and NPM

## Application Setup
1. Create an api key for your telegram bot to receive alerts with [BotFather](https://telegram.me/botfather).
2. Create a new file ```.env``` while referencing ```.env.example``` file provided in the repo.
3. Installing all required dependencies with ```npm install```.

## Running the script
Running, ```node index.js``` will do the necessary health check for your applications.  
Running, ```node validateCatbody.js``` will verify if there are changes to your CAT system.
