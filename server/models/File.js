const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    route: {
        type: String,
        trim: true,
        required: true,
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
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
module.exports = mongoose.model('File', fileSchema);