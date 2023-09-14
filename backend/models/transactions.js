const mangoose = require('mongoose');
const Schema = mangoose.Schema;


const transactionSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    captain: {
        type: Schema.Types.ObjectId,
        ref: 'Captain',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date_of_transaction: {
        type: Date,
        required: true
    },
});


module.exports = Transaction = mangoose.model('Transaction', transactionSchema);
