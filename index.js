const qrcode = require('qrcode-terminal');
const prompt = require('prompt');

const fs = require('fs');
const { Client } = require('whatsapp-web.js');

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    prompt.start();
});

function sendMsg() {
    prompt.get(['phone', 'text'], function(err, result) {
        console.log(result);
        let phone = result.phone + '@c.us';
        let msg = result.text;

        client.sendMessage(phone, msg);

        repeatMsg();
    });
}

sendMsg();

function repeatMsg() {
    sendMsg();
}

client.on('message', message => {
    console.log(message.from, message.body);
});

client.initialize();