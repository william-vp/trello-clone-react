const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const commentCardSchema = new Schema({
    text: {
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
    updated_at: {
        type: Date,
        default: Date.now()
    },
});
module.exports = mongoose.model('CommentCard', commentCardSchema);