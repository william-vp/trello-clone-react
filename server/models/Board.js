const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const boardSchema = new Schema({
    code: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    coverUrl: {
        type: String,
    },
    visibility: {
        type: String,
        default: 'private',
        enumValues: ["public", "private"],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now(),
        required: false
    },
    deleted_at: {
        type: Date,
        default: Date.now(),
        required: false
    }
});
module.exports = mongoose.model('Board', boardSchema);