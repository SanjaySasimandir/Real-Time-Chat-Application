const express = require('express');
const userRouter = express.Router();

const UserData = require('../models/UserData.js')

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
    res.send({ "message": "success" });

});

module.exports = userRouter;