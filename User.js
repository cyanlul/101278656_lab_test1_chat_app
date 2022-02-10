const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: {unique: true}
    },
    firstname: {
        type: String,
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String
    },
    createon: {
        type: Date,
        default: Date.now
    }
})

UserSchema.query.byUserName = function(value){
    return this.where({username: value})
}

const User = mongoose.model("User", UserSchema);
module.exports = User;