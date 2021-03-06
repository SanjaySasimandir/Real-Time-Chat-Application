const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://mongodbaccess:cloudget@bravoone.eo0iw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');


const Schema = mongoose.Schema;
const ChatSchema = new Schema({
    firstUser: String,
    secondUser: String,
    chat: [{ messageContent: String, messageType: String, messageTime: String, messageSender: String, messageTime: String}]
});

var ChatData = mongoose.model('chatdata', ChatSchema);
module.exports = ChatData;