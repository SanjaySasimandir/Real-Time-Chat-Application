var express = require('express');
var app = express();

const port = process.env.PORT || 7000;

const cors = require('cors');
app.use(cors());

const bodyparser = require('body-parser');
app.use(bodyparser.json());

const UserRoute = require('./src/routes/UserRoute');
app.use('/users', UserRoute);

const EmailVerifyRoute = require('./src/routes/EmailVerifyRoute');
app.use('/email', EmailVerifyRoute);

app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.send("working")
});



app.listen(port, () => {
    console.log("Server Listening at port: " + port);
});