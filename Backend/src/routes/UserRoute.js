const express = require('express');
const userRouter = express.Router();

const UserData = require('../models/UserData.js');
var EmailVerifyData = require('../models/EmailVerifyData');

userRouter.post('/signup', (req, res) => {
    var userDetails = req.body.user;
    delete userDetails["_id"];
    var user = UserData(userDetails);
    user.save();
    EmailVerifyData.findOneAndDelete({ email: user.email }).then(() => { })
    res.send({ "message": "success" });

});

userRouter.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    UserData.find({ username: username, password: password }).then(data => {
        if (data[0]) {
            data[0].availability = "online";
            data[0].save()
            res.send({ "message": "success", "id": data[0]._id, "username": data[0].username });
        }
        else {
            res.send({ "message": "failure" });
        }
    })
});

userRouter.post('/logout', (req, res) => {
    var id = req.body.id;
    UserData.findById({ _id: id }).then(data => {
        if (data[0]) {
            data[0].availability = "offline";
            data[0].save()
            res.send({ "message": "success" });
        }
        else {
            res.send({ "message": "failure" });
        }
    })
});

userRouter.post('/dupeUsernameCheck', (req, res) => {
    var username = req.body.username;
    UserData.find({ username: username }).then(data => {
        if (data[0]) {
            console.log(data)
            res.send({ "message": "found" });
        }
        else {
            res.send({ "message": "notfound" });
        }
    })
});

userRouter.post('/dupeEmailCheck', (req, res) => {
    var email = req.body.email;
    UserData.find({ email: email }).then(data => {
        if (data[0]) {
            console.log(data)
            res.send({ "message": "found" });
        }
        else {
            res.send({ "message": "notfound" });
        }
    })
});

userRouter.post('/searchuser', (req, res) => {
    var username = req.body.username;
    UserData.find({ username: username }).then(data => {
        if (data[0]) {
            dataToSend = {
                username: data[0].username,
                firstName: data[0].firstName,
                lastName: data[0].lastName,
                picture: data[0].picture

            }
            res.send({ "message": "found", "user": data[0] });
        }
        else {
            res.send({ "message": "notfound" });
        }
    })
});

userRouter.post('/addContactToBoth', (req, res) => {
    var firstUsername = req.body.firstUsername;
    var secondUsername = req.body.secondUsername;
    UserData.find({ username: { $in: [firstUsername, secondUsername] } }).then(data => {
        if (data[0] && data[1]) {
            if (data[0].contacts.includes(secondUsername)) {
                delete data[0].contacts[data[0].contacts.indexOf(secondUsername)];
            }
            data[0].contacts.push(secondUsername);
            data[0].save();

            if (data[1].contacts.includes(firstUsername)) {
                delete data[1].contacts[data[1].contacts.indexOf(firstUsername)];
            }
            data[1].contacts.push(firstUsername);
            data[1].save();

            res.send({ "message": "success" });
        }
        else {
            res.send({ "message": "failure" });
        }
    })
});

userRouter.get('/redousers', (req, res) => {
    UserData.find().then(data => {
        console.log(data[0]);
        for (let i = 0; i < data.length; i++) {
            data[i].save()
        }
        res.send('here');
    })
});

module.exports = userRouter;