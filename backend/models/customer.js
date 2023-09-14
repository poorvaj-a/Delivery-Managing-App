const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String
        }
    },
    contact_number: {
        type: String,
        required: true,
        index: true
    },
    email_address: {
        type: String
    }
});

module.exports = Customer = mongoose.model("Customer", customerSchema);
