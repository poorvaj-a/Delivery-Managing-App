const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocalitySchema = new Schema({
    locality_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = Locality = mongoose.model("Locality", LocalitySchema);