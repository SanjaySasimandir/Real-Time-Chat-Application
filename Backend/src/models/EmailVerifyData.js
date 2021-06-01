const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mongodbaccess:cloudget@bravoone.eo0iw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');


const Schema = mongoose.Schema;
const EmailVerifySchema = new Schema({
    email: String,
    otp: String
});

var EmailVerifyData = mongoose.model('emailverifydata', EmailVerifySchema);
module.exports = EmailVerifyData;