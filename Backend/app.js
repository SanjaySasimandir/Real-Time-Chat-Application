// var express = require('express');
// var app = express();

// const port = process.env.PORT || 3000;

// const cors = require('cors');
// app.use(cors());

// const bodyparser = require('body-parser');
// app.use(bodyparser.json());

// const UserRoute = require('./src/routes/UserRoute');
// app.use('/users', UserRoute);

// const EmailVerifyRoute = require('./src/routes/EmailVerifyRoute');
// app.use('/email', EmailVerifyRoute);

// app.use(express.urlencoded({ extended: true }));

// app.get('/test', (req, res) => {
//     res.send("working")
// });



// app.listen(port, () => {
//     console.log("Server Listening at port: " + port);
// });


var express = require('express');
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: "*"
    }
});

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


io.on('connection', (socket) => {
    console.log('User Connected');

    let id;
    socket.on('id', (data) => {
        id = data;
        console.log(data)
        socket.emit('test event', "hello" + id);
    });


    socket.on('disconnect', () => {
        console.log('User Disconnected');
    })
})

http.listen(port, () => {
    console.log("Server Listening at port: " + port);
});