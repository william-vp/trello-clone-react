const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const labelCardSchema = new Schema({
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true,
    },
    label: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Label',
        required: true,
    },
    color: {
        type: String,
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
module.exports = mongoose.model('MemberCard', labelCardSchema);