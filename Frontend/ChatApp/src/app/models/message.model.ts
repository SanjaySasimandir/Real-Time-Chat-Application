export class MessageModel {
    constructor(
        public messageContent: String,
        public messageType: String,
        public messageSender: String
    ) { }
}