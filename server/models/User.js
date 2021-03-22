const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ACTIVE = "ACTIVE";
const INACTIVE = "INACTIVE";
const DISABLED = "DISABLED ";

const userSchema = new Schema({
    uid: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    name: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    provider: {
        type: String,
        required: true,
        enumValues: ["email", "facebook", "gmail"],
    },
    photoUrl: {
        type: String
    },
    status: {
        type: String,
        default: ACTIVE,
        trim: true,
        enumValues: [ACTIVE, INACTIVE, DISABLED],
    },
    bio: {
        type: String,
        default: null
    },
    showProfileTo: {
        type: String,
        default: 'only_me',
        enumValues: ["all", "friends", "only_me"],
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('User', userSchema);