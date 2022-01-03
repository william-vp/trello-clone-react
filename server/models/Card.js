const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    coverUrl: {
        type: String,
        trim: true,
        required: true,
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    privacy: {
        type: String,
        default: 'public',
        enumValues: ["public", "private"],
    },
    status: {
        type: String,
        default: 'active',
        enumValues: ["active", "inactive"],
    },
    progress: {
        type: Number,
        default: 0
    },
    expires_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    deleted_at: {
        type: Date,
        default: Date.now()
    },
});
module.exports = mongoose.model('Card', cardSchema);