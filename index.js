const qrcode = require('qrcode-terminal');
const prompt = require('prompt');

const fs = require('fs');
const { Client } = require('whatsapp-web.js');

const client = new Client();

let contacts = [];

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    prompt.start();
});

//phone = result.phone + '@c.us';

function sendMsg() {
    prompt.get(['phone'], function(err, result) {
        let phone = result.phone;
        
        //manage commands
        if (phone == '/help') {
            console.log('help list');
            repeatMsg();
        } else if (phone == '/contacts') {
            console.log(contacts);
            repeatMsg();

        } else if (phone == '/addContact') {
            prompt.get(['contactPhone', 'contactName'], function(err, result) {
                contactPhone = result.contactPhone + '@c.us';
                contactName = result.contactName;

                newContact = {
                    phone: contactPhone,
                    name: contactName
                }

                contacts.push(newContact);

                repeatMsg();
            })

        } else if (phone == '/msg') {
            if (contacts.length === 0) {
                console.log("You don't have any contacts yet. Use '/addContact' to create a new contact or just type a phone numbwe to chat with");
                repeatMsg();
            } else {
                for (let i = 0; i < contacts.length; i++) {
                    prompt.get(['contactName', 'message'], function(err, result) {
                        if (result.contactName == contacts[i].name) {
                            phone = contacts[i].phone;
                            msg = result.message;

                            client.sendMessage(phone, msg);

                            repeatMsg();
                        } else {
                            console.log("You don't have any contact with that name");
                            repeatMsg();
                        }
                    })
                }
            }

        } else if (isNaN(phone) == false) {
            prompt.get(['message'], function(err, result) {
                phone = phone + '@c.us';
                msg = result.message;
                client.sendMessage(phone, msg);
                repeatMsg();
            });
        } else {
            console.log("That's not an existing command. Try '/help'");
            repeatMsg();
        }
    });
}

sendMsg();

function repeatMsg() {
    sendMsg();
}

client.on('message', message => {
    for (let i = 0; i < contacts.length; i++) {
        if (message.from == contacts[i].phone) {
            console.log(contacts[i].name + ': ', message.body);
        } else {
            console.log(message.from, message.body);
        }
    }
});

client.initialize();