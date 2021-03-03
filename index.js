const dotenv = require('dotenv')
const fetch = require('node-fetch')
const AbortController = require('abort-controller')

dotenv.config()

const TELEGRAM_ENDPOINT = 'https://api.telegram.org/'
const BOT_SECRET = process.env.TELEGRAM_BOT_SECRET
const TELEGRAM_CHAT_GROUP_ID = process.env.TELEGRAM_CHAT_ID

async function sendTelegramMessage(chatId, text) {
    try {
        await fetch(
            `${TELEGRAM_ENDPOINT}${BOT_SECRET}/sendMessage?chat_id=${chatId}&text=${text}`,
            { method: 'POST' }
        )
    } catch (e) {
        console.error(e)
    }
}

async function getCatSystemHealth(endpoint) {
    let isHealthChecked = false

    const fetchController = new AbortController()
    const timeoutHandler = setTimeout(() => {
        if (!isHealthChecked) {
            fetchController.abort()
            sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, 'Cat system timed out.')
        }
    }, 3000)

    try {
        const responseStream = await fetch(`${endpoint}:8000/supplementary/health_check`, { method: 'GET', signal: fetchController.signal })
        const response = await responseStream.json()

        if (response.HTTPStatusCode === 200) {
            isHealthChecked = true
            clearTimeout(timeoutHandler)
        } else {
            sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, 'Cat system possible down.')
        }
    } catch (e) {
        sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, `Cat system is down. Error trace: ${e.message}`)
    }
}

async function getOsTicketHealth(endpoint) {
    let isHealthChecked = false

    const fetchController = new AbortController()
    const timeoutHandler = setTimeout(() => {
        if (!isHealthChecked) {
            fetchController.abort()
            sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, 'OsTicket system timed out.')
        }
    }, 3000)

    try {
        const responseStream = await fetch(`${endpoint}`, { method: 'HEAD', signal: fetchController.signal })

        if (responseStream.status === 200) {
            isHealthChecked = true
            clearTimeout(timeoutHandler)
        } else {
            sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, 'OsTicket system possible down.')
        }
    } catch (e) {
        sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, `OsTicket system is down. Error trace: ${e.message}`)
    }
}

async function getPulseHealth(endpoint) {
    let isHealthChecked = false

    const fetchController = new AbortController()
    const timeoutHandler = setTimeout(() => {
        if (!isHealthChecked) {
            fetchController.abort()
            sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, 'OsTicket system timed out.')
        }
    }, 3000)

    try {
        const responseStream = await fetch(`${endpoint}:8001/testpoint`, { method: 'GET', signal: fetchController.signal })
        const response = await responseStream.json()

        if (response === "Server Alive") {
            isHealthChecked = true
            clearTimeout(timeoutHandler)
        } else {
            sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, 'Pulse system possible down.')
        }
    } catch (e) {
        sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, `Pulse system is down. Error trace: ${e.message}`)
    }
}

getOsTicketHealth(process.env.HTTPS_ENDPOINT)
getCatSystemHealth(process.env.HTTP_ENDPOINT)
getPulseHealth(process.env.HTTP_ENDPOINT)