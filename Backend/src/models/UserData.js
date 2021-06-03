const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mongodbaccess:cloudget@bravoone.eo0iw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');


const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    bio: String,
    availability: String,
    phone: String,
    picture: String,
    profileSettings: Array,
    username: String,
    password: String
});

var UserData = mongoose.model('userdata', UserSchema);
module.exports = UserData;