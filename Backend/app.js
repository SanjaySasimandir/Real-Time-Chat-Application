var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: "*"
    }
});

app.use(express.static('./public'));

const port = process.env.PORT || 3000;

const cors = require('cors');
app.use(cors());

const bodyparser = require('body-parser');
app.use(bodyparser.json());

app.use(express.json())

const UserRoute = require('./src/routes/UserRoute');
app.use('/users', UserRoute);

const EmailVerifyRoute = require('./src/routes/EmailVerifyRoute');
app.use('/email', EmailVerifyRoute);

app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.send("working")
});

var ChatData = require('./src/models/ChatData');
var UserData = require('./src/models/UserData');

let connectedUsers = [];
let joinedrooms = {};
io.on('connection', (socket) => {
    console.log('User Connected');
    let id;
    // let id=socket.handshake.query.username;
    socket.on('id', (data) => {
        id = data;
        connectedUsers.push(id);
        console.log(data)
        socket.join(id);
        socket.emit('test event', "hello" + id);
        UserData.find({ username: id }, { availability: 1 }).then(data => {
            if (data[0]) {
                data[0].availability = "online";
                data[0].save()
            }
        });
    });

    socket.on('join chat', (contactName) => {
        joinedrooms[id] = contactName;
        sendChat(id, contactName);
    });

    socket.on('send message', (data) => {
        sendMessageToContact(data, id);
        // console.log(data);
        // console.log(joinedrooms)
        // if (connectedUsers.includes(data.contactUsername) && joinedrooms[data.contactUsername] == id) {
        //     console.log('forwarded')
        //     io.to(data.contactUsername).emit('receive message', { message: data ,time:Date.now()});

        // }
        // ChatData.find({})
    });

    socket.on('send contacts request', (username) => {
        getContacts(username);
    });


    socket.on('disconnect', () => {
        console.log('User Disconnected: ' + id);
        delete connectedUsers[connectedUsers.indexOf(id)];
        delete joinedrooms[id];
        UserData.find({ username: id }, { availability: 1 }).then(data => {
            if (data[0]) {
                data[0].availability = "offline";
                data[0].save()
            }
        });
    })
});

function getContacts(username) {
    UserData.find({ username: username }, { contacts: 1, mutedContacts: 1, blockedContacts: 1, _id: 0 }).then(data => {
        if (data[0].contacts) {
            let contactsToSend;
            UserData.find({ username: { $in: data[0].contacts } }, { firstName: 1, lastName: 1, username: 1, picture: 1, _id: 0, }).then(users => {
                contactsToSend = { "message": "success", "contacts": users.reverse(), "mutedContacts": data[0].mutedContacts, "blockedContacts": data[0].blockedContacts };
                io.to(username).emit('receive contacts', contactsToSend);
            });
        }
        else {
            contactsToSend = { "message": "failure" };
            io.to(username).emit('receive contacts', contactsToSend);
        }
    });
}

function sendChat(id, contactName) {
    ChatData.find({ firstUser: { $in: [id, contactName] }, secondUser: { $in: [id, contactName] } }, { _id: 0 }).then(data => {
        console.log(id, contactName, "found");
        io.to(id).emit('receive old messages', data[0]);
    });
}


function sendMessageToContact(data, id) {
    console.log(data);
    if (connectedUsers.includes(data.contactUsername) && joinedrooms[data.contactUsername] == id) {
        console.log('forwarded')
        let message = { messageContent: data.message, messageType: data.messageType, messageSender: data.username };
        io.to(data.contactUsername).emit('receive message from contact', { message: message, time: Date.now() });
    }
    addMessageToChat(id, data.contactUsername, data);
}
function addMessageToChat(id, contactName, data) {
    ChatData.find({ firstUser: { $in: [id, contactName] }, secondUser: { $in: [id, contactName] } }).then(ChatRoom => {
        console.log(id, contactName, "found");
        let message = { messageContent: data.message, messageType: data.messageType, messageSender: data.username };
        ChatRoom[0].chat.push(message);
        ChatRoom[0].save();
    });
}

http.listen(port, () => {
    console.log("Server Listening at port: " + port);
});