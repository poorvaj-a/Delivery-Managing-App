const express = require('express')
var orderRouter = express.Router();

const Order = require('../models/order');
const Customer = require('../models/customer');
const Captain = require('../models/captain');

const mongoose = require('mongoose');
const transactions = require('../models/transactions');


// orderRouter.get('/getorders', async (req, res) => {
//     try {
//     const captain = await Captain.findOne({ mobile_number: req.query.captain_contact });
//     const orders = await Order.find({ captain: captain._id }).populate(['customer', 'vendor']);
//     res.send(orders);
//     }
//     catch (err) {
//         res.send({
//             status : '1',
//             error : err
//         });
//     }
// })

const parse_date = date => {
    if (date.length == 8) {
      let year = date.substring(0, 4);
      let month = date.substring(4, 6);
      let dd = date.substring(6, 8);
      let date_temp = year + '-' + month + '-' + dd;

      return parse_date(date_temp);
    }
    if (date.length == 11) {
      let arr = date.split(' ');
      let month_num = month_names.indexOf(arr[0]) + 1;
      if (month_num < 10) month_num = '0' + month_num.toString();
      date_temp = arr[2] + '-' + month_num + '-' + arr[1];
      return parse_date(date_temp);
    }

    return new Date(date);
};

orderRouter.get('/getvendors', async (req, res) => {
    try {
        const captain = await Captain.findOne({ mobile_number: req.query.captain_contact });
        const vendor_date = await Order.aggregate([
            {
                $match: { captain: captain._id, status: { $nin: ["pending", "delivered"] } }
            },
            {
                $group: {
                    _id: {
                        vendor: "$vendor",
                        delivery_date: "$delivery_date",
                    },
                    count: {
                        $sum: 1
                    },
                }
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "_id.vendor",
                    foreignField: "_id",
                    as: "vendorInfo"
                }
            },
        ]);
        res.json(
            {
                status: 0,
                data: vendor_date
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

orderRouter.get('/getlocations', async (req, res) => {
    try {
        const captain = await Captain.findOne({ mobile_number: req.query.captain_contact })
        const locality_ids = await Order.aggregate([
            {
                $match: { captain: captain._id, vendor: mongoose.Types.ObjectId(req.query.vendor), delivery_date: req.query.delivery_date, status: { $nin: ["pending", "delivered"] } }
            },
            {
                $group: {
                    _id: {
                        locality_id: "$locality_id",
                    },
                }
            },
            {
                $lookup: {
                    from: "localities",
                    localField: "_id.locality_id",
                    foreignField: "locality_id",
                    as: "localityInfo"
                }
            }
        ])
        res.json(
            {
                status: 0,
                data: locality_ids
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

orderRouter.get('/getorderlist', async (req, res) => {
    try {
        const captain = await Captain.findOne({ mobile_number: req.query.captain_contact });
        const orders = await Order.find({ captain: captain._id, vendor: req.query.vendor, locality_id: req.query.locality_id, delivery_date: req.query.delivery_date, status: { $nin: ["pending", "delivered"] } }).populate(['customer', 'vendor']);
        res.json(
            {
                status: 0,
                data: orders
            }
        )
    } catch (error) {
        console.log(error)
        res.json(
            {
                status: 1,
                error: error
            }
        )

    }
})


orderRouter.post('/deliver', async (req, res) => {
    try {
        var order = await Order.findOne({ order_id: req.body.order_id, status: {$nin : [ "pending", "delivered" ]} }).populate(['vendor'])
        order["status"] = "delivered"
        order["invoice_amount"] = req.body.invoice_amount



        var transaction = new transactions({
            title : order.vendor.name,
            customer: order.customer,
            captain: order.captain,
            amount: req.body.invoice_amount * -1,
            date_of_transaction: parse_date(order.delivery_date)

        })

        var transaction_prepaid = null


        if (order.payment_method_title.toUpperCase() != "COD") {
            transaction_prepaid = new transactions({
                title : order.payment_method_title,
                customer: order.customer,
                captain: order.captain,
                amount:  parseInt(order.total) + parseInt(order.total_tax),
                date_of_transaction: parse_date(order.delivery_date)
            })
        }

        // await transaction.save()








        try {
            await order.save()
            await transaction.save()
            if(transaction_prepaid != null)
                await transaction_prepaid.save()

            return res.json({
                status: 0,
                message: "Order updated successfully"
            })
        } catch (e) {
            console.log(e)
            return res.json({
                status: 1,
                error: e
            })
        }
    } catch (e) {
        console.log(e)
        return res.json({
            status: 1,
            error: e
        })
    }
})


orderRouter.get('/details', async (req, res) => {
    try {
        var order = await Order.findOne({ order_id: req.query.order_id }).populate(["vendor", "customer"])
    } catch (e) {
        return res.json({
            status: 1,
            error: e
        })
    }

    return res.json({
        status: 0,
        order: order
    })
})

orderRouter.get('/listoforders', async (req, res) => {
    try {
        const captain = await Captain.findOne({ mobile_number: req.query.captain_contact });
        const orders = await Order.find({ captain: captain._id }).populate(['customer', 'vendor']);
        res.json(
            {
                status: 0,
                data: orders
            }
        )
    }
    catch (err) {
        res.send({
            status : 1,
            error : err
        });
    }
})

orderRouter.get('/listofordersbycustomer', async (req, res) => {
    try {
        const customer = await Customer.findOne({ contact_number: req.query.customer_contact });
        const captain = await Captain.findOne({ mobile_number: req.query.captain_contact });
        const orders = await Order.find({ captain: captain._id, customer: customer._id }).populate(['vendor']);
        // const orders = await Order.aggregate([{
        //     $match: { captain: captain._id, customer: customer._id }
        // },
        // {
        //     $sort: {
        //         created_at: -1
        //     }
        // },])
        res.json(
            {
                status: 0,
                data: orders
            }
        )
    }
    catch (error) {
        res.send({
            status : 1,
            error : error
        });
    }
})



module.exports = orderRouter
