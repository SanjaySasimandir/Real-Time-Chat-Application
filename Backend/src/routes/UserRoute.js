const express = require('express');
const userRouter = express.Router();

const UserData = require('../models/UserData.js');
var EmailVerifyData = require('../models/EmailVerifyData');

userRouter.get('/test', (req, res) => {
    var userDetails = {
        firstName: "firstName",
        lastName: "lastName",
        email: "email",
        bio: "bio",
        availability: "availability",
        phone: "5626252",
        picture: "picture",
        profileSettings: [1, 2, 3, 4]
    };
    var user = UserData(userDetails);
    user.save();
    res.send("user router working");
});

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
            res.send({ "message": "success", "id": data[0]._id });
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

userRouter.get('/redousers', (req, res) => {
    UserData.find().then(data => {
        console.log(data[0]);
        for(let i=0; i<data.length;i++){
            data[i].save()
        }
        res.send('here')
    })
});

module.exports = userRouter;