const express = require('express');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WhatsApp Web client
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Web client is ready!');
});

client.on('message', async message => {
    const response = await getRasaResponse(message.body);
    message.reply(response);
});

// Start WhatsApp Web client
client.initialize();

// Express routes
app.get('/', (req, res) => {
    res.send('WhatsApp Bot is running');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Rasa setup
const rasaUrl = 'http://localhost:5005/webhooks/rest/webhook';

async function getRasaResponse(text) {
    try {
        const response = await axios.post(rasaUrl, {
            sender: 'whatsapp-user',
            message: text
        });
        return response.data[0].text;
    } catch (error) {
        console.error('Error getting response from Rasa:', error);
        return 'آسف، حدث خطأ ما.';
    }
}