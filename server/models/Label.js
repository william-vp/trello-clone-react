const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const labelSchema = new Schema({
    name_en: {
        type: String,
        trim: true,
        required: true,
    },
    name_es: {
        type: String,
        trim: true,
        required: true,
    },
    color: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Label', labelSchema);