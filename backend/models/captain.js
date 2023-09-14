const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CaptainSchema = new Schema({
    mobile_number: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // Captain id obtained from wordpress
    captain_id: {
        type: String,
        required: true,
        unique: true,
    },
    fireToken: {
        type: String,
    }
}, {strict:false});

module.exports = Login = mongoose.model("Captain", CaptainSchema);
