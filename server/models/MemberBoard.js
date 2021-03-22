const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const memberBoardSchema = new Schema({
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
    created_at: {
        type: Date,
        default: Date.now()
    },
    deleted_at: {
        type: Date,
    },
});
module.exports = mongoose.model('MemberBoard', memberBoardSchema);