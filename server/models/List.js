const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enumValues: ['todo', 'doing', 'done', 'custom'],
        default: 'custom',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    deleted_at: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('List', listSchema);