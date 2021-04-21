const qrcode = require('qrcode-terminal');
const prompt = require('prompt');
const fs = require('fs');
const { Client } = require('whatsapp-web.js');

let contacts = [];
const SESSION_FILE_PATH = './session.json';
const CLIENT_FILE_PATH = './client.json';

/* let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
} */

const client = new Client(/* {
    session: sessionData
} */);

/* client.on('authenticated', (session) => {    
    // Save the session object however you prefer.
    let sessionObject =  JSON.stringify(session);
    fs.writeFileSync(SESSION_FILE_PATH, sessionObject);
    console.log(sessionObject);
});     */


client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log(qr);
});

client.on('ready', () => {
    console.log('Client is ready! Welcome ' + client.info.pushname);
    prompt.start();
});

client.on('message', message => {
    for (let i = 0; i < contacts.length; i++) {
        if (message.from == contacts[i].phone) {
            console.log(contacts[i].name + ': ', message.body);
        } else {
            console.log(message.from + ': ', message.body);
        }
    }
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
                console.log("You don't have any contacts yet. Use '/addContact' to create a new contact or just type a phone number to chat with");
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
                console.log(client.info.pushname + ': ', msg);
                repeatMsg();
            });
        } else if (phone == '/client') {
            console.log(client);
            repeatMsg();
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

client.initialize();