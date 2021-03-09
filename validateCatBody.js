const dotenv = require('dotenv')
const fetch = require('node-fetch')
const AbortController = require('abort-controller')

dotenv.config()

const TELEGRAM_ENDPOINT = 'https://api.telegram.org/'
const BOT_SECRET = process.env.TELEGRAM_BOT_SECRET
const TELEGRAM_CHAT_GROUP_ID = process.env.TELEGRAM_CHAT_ID

const DEAFULT_CAT_HTML = "%3Chtml%3E%0A%20%20%3Chead%3E%3C/head%3E%0A%20%20%3Cbody%3E%0A%20%20%20%20%3Ch1%3ECAT%20System%3A%20Communications%20About%20Technology%3C/h1%3E%0A%20%20%20%20%3Cp%3E%0A%20%20%20%20%3Ciframe%20src%3D%22https%3A//docs.google.com/presentation/d/e/2PACX-1vSMJntb8S1a2W8PrZLQxVDy1Y_Dcg5JLjg56Ff4J9YKv2scHfNHeVllJ7csO-thnlQH-mk9f5jY8KEz/embed%3Fstart%3Dfalse%26loop%3Dfalse%26delayms%3D60000%22%20frameborder%3D%220%22%20width%3D%22960%22%20height%3D%22569%22%20allowfullscreen%3D%22true%22%20mozallowfullscreen%3D%22true%22%20webkitallowfullscreen%3D%22true%22%3E%3C/iframe%3E%0A%20%20%20%20%3Cbr%3E%0A%20%20%20%20%3Cimg%20src%3D%22http%3A//bit.ly/r3fgru%22%20/%3E%0A%20%20%20%20%3C/p%3E%0A%20%20%3C/body%3E%0A%3C/html%3E%0A"

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
            sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, 'CAT Validator: Cat system has timed out.')
        }
    }, 3000)

    try {
        const responseStream = await fetch(`${endpoint}:8000`, { method: 'GET', signal: fetchController.signal })
        const response = await responseStream.text()
        const escapedString = escape(response)

        console.log(escapedString === DEAFULT_CAT_HTML)
        if (escapedString === DEAFULT_CAT_HTML) {
            isHealthChecked = true
            clearTimeout(timeoutHandler)
        } else {
            sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, 'There is a change in the CAT HTML contents.')
            clearTimeout(timeoutHandler)
        }
    } catch (e) {
        sendTelegramMessage(TELEGRAM_CHAT_GROUP_ID, `Change detection for CAT has failed to run. Error trace: ${e.message}`)
    }
}

getCatSystemHealth(process.env.HTTP_ENDPOINT)