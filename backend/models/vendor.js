const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // id from wordpress
    vendor_id: {
        type: String,
        required: true
    }
})

module.exports = Login = mongoose.model("Vendor", VendorSchema)
