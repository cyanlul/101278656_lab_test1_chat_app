const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        trim: true,
        lowercase: true
    },
    room: {
        type: String,
        trim: true,
        lowercase: true
    },
    message: {
        type: String,
        trim: true
    },
    date_sent: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;