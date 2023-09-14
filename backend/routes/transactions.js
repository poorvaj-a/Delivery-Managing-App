const express = require('express')
var transactionRouter = express.Router();

const Order = require('../models/order');
const Customer = require('../models/customer');
const Captain = require('../models/captain');
const Vendor = require('../models/vendor');
const Transaction = require('../models/transactions');

const mongoose = require('mongoose');


transactionRouter.get('/getledger', async (req, res) => {
    /*
        captain_contact
    */
    try {
        const captain = await Captain.findOne({ mobile_number: req.query.captain_contact });

        const transactions = await Transaction.aggregate([
            {
                $match: { captain: captain._id }
            },

            {
                $group: {
                    _id : "$customer",
                    total : { $sum : "$amount" }
                }
            },
            {
                $sort: {
                    total: 1
                }
            },

            {
                $lookup: {
                    from: "customers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "customerInfo"
                }
            },
        ]);

        res.json(
            {
                status: 0,
                data: transactions
            }
        )


    } catch (error) {
        console.log(error);
        res.json(
            {
                status: 1,
                error: error
            }
        )
    }
})

transactionRouter.get('/getallbycust', async (req, res) => {
    try {
        const captain = await Captain.findOne({ mobile_number: req.query.captain_contact });
        const customer = await Customer.findOne({ contact_number: req.query.customer_contact });

        // const transactions = await Transaction.find({ captain: captain._id, customer: customer._id });
        const transactions = await Transaction.aggregate([
            {
                $match: { captain: captain._id, customer: customer._id }
            },
            {
                $sort: {
                    date_of_transaction: -1
                }

            }])
        res.json(
            {
                status: 0,
                data: transactions
            }
        )

    }
    catch (error) {
        console.log(error);
        res.json(
            {
                status: 1,
                error: error
            }
        )
    }
})

transactionRouter.post("/addmoney", async (req, res) => {
    /*
    captain_contact
    customer_contact
    amount
    mode_of_transaction
    date_of_transaction
    */
    try {
        const captain = await Captain.findOne({mobile_number : req.body.captain_contact});
        const customer = await Customer.findOne({contact_number : req.body.customer_contact});

        const transaction = new Transaction({
            captain: captain._id,
            customer: customer._id,
            amount: req.body.amount,
            mode_of_transaction: req.body.mode_of_transaction,
            date_of_transaction: req.body.date_of_transaction,
            title : req.body.mode_of_transaction
        });

        await transaction.save();
        res.json(
            {
                status: 0,
                message: "Transaction added successfully"
            }
        )
    }
    catch (error) {
        console.log(error);
        res.json(
            {
                status: 1,
                error: error
            }
        )
    }



})

module.exports = transactionRouter;