var express = require("express");
const Order = require("../models/order");
const Customer = require('../models/customer')
const Vendor = require('../models/vendor')
const Locality = require('../models/locality')
const Captain = require('../models/captain')
const Orderdump = require('../models/orderdump')
const admin = require('../firebase')
const Transaction = require('../models/transactions')
const { getLocality, getCaptain } = require('../services/api')

var orderdumprouter = express.Router();
// things yoinked from the orderdump.js file
// 1. customer no.
// 2. order key
// 3. billing
// 4. shipping
// 5. vendor id
// 6. created via
// 7 order no.
// 8. customer no.




orderdumprouter.post("/add", async (req, res) => {

    try {
        const dump = new Orderdump({ ...req.body })
        await dump.save()
        console.log("Dump saved")
    } catch (e) {
        console.log("Dump failed")
        console.log(e)
    }

    let body = req.body;
    let order = await Order.findOne({ order_id: body["order_unique_id"] })
    if (order) {
        order["status"] = body["order_status"]

        try {
            await order.save()
            return res.status(200).send("Order updated successfully")
        } catch (e) {
            console.log(e)
            return res.status(500).send("Order update failed")
        }

    }

    order = {}
    let products = []
    order["status"] = body["order_status"]
    order["order_id"] = body["order_unique_id"]
    order["parent_id"] = body.order["parent_id"]
    order["products"] = products
    order["currency"] = body.order["currency"]
    order["prices_include_tax"] = body.order["prices_include_tax"]
    order["discount_total"] = body.order["discount_total"]
    order["shipping_total"] = body.order["shipping_total"]
    order["cart_tax"] = body.order["cart_tax"]
    order["total_tax"] = body.order["total_tax"]
    order["total"] = body.order["total"]
    order["payment_method_title"] = body.order["payment_method_title"]
    order["transaction_id"] = body.order["transaction_id"]
    order["customer_note"] = body.order["customer_note"]
    order["cart_hash"] = body.order["cart_hash"]
    order["tax_lines"] = body.order["tax_lines"]
    order["shipping_lines"] = body.order["shipping_lines"]
    order["fee_lines"] = body.order["fee_lines"]
    order["coupon_lines"] = body.order["coupon_lines"]
    order["locality_id"] = body.order.postmeta["locality_id"][0]
    order["date_created"] = body.order["date_created"]["date"]
    order["date_modified"] = body.order["date_modified"]["date"]
    order["delivery_date"] = body.order["postmeta"]["date_of_delivery"][0]
    order.address = {}
    order.address["level1"] = body.order.postmeta["level_1"][0]
    order.address["level2"] = body.order.postmeta["level_2"][0]
    order.address["level3"] = body.order.postmeta["level_3"][0]

    var locality = await Locality.findOne({ locality_id: order.locality_id })
    if (!locality) {
        var localityDetails = await getLocality(order.locality_id)
        locality = new Locality({
            locality_id: order.locality_id,
            name: localityDetails.title.rendered,
        })

        try {
            await locality.save()
        } catch (e) {
            console.log(e)
        }
    }

    let i = "0"
    while (body.order[i]) {
        products.push(body.order[i]["item_data"])
        i = (Number(i) + 1).toString()
    }




    var customer = await Customer.findOne({ contact_no: body.order.postmeta["_billing_phone"][0] })

    if (!customer) {
        var customer = new Customer({
            contact_number: body.order.postmeta["_billing_phone"][0], // can also go with body.order.billing["phone"]
            name: {
                first: body.order.billing["first_name"],
                last: body.order.billing["last_name"]
            },
            email_address: body.order["email"],

        })

        try {
            await customer.save()
        } catch (err) {
            console.log(err)
        }
    }

    var vendor = await Vendor.findOne({ vendor_id: body["vendor_id"] })

    if (!vendor) {
        var vendor = new Vendor({
            name: body["vendor_name"],
            vendor_id: body["vendor_id"]
        })

        try {
            await vendor.save()
        } catch (e) {
            console.log(e)
        }
    }

    var captain = await Captain.findOne({ captain_id: body.order["postmeta"]["captain_id"][0] })
    if (!captain) {
        //console.log("captain not found. Time to update database!!!")

        try {

            var captainDetails = await getCaptain(body.order["postmeta"]["captain_id"][0])
            captain = new Captain({
                captain_id: body.order["postmeta"]["captain_id"][0],
                name: captainDetails.name,
                mobile_number: captainDetails.meta["phone_number"][0].substring(2),
                password: "1234",
            })



            await captain.save()
        } catch (e) {
            console.log(e)
        }
    }

    // try {

    //     var transaction = new Transaction({
    //         title : vendor.name,
    //         customer : customer._id,
    //         captain : captain._id,
    //         amount : body.order["total"]*(-1),
    //         mode_of_transaction : body.order["payment_method_title"],
    //         date_of_transaction : body.order["date_created"]["date"].substring(0, 10),
    //     })
    //     await transaction.save()
    // } catch (e) {
    //     console.log(e)
    // }


    order["customer"] = customer._id
    order["vendor"] = vendor._id
    order["captain"] = captain._id

    try {
        order = new Order(order)
        await order.save()
        res.status(200).send("Order recieved")

        if (captain.fireToken) {
            console.log("Sending notification to captain with token: " + captain.fireToken)
            const message = {
                data: {
                    title: "New Order",
                    body: "New order has been placed from " + locality.name
                }
            }

            admin.messaging().sendToDevice(captain.fireToken, message)
                .then((response) => {
                    console.log("Successfully sent message")
                })
                .catch((error) => {
                    console.log("Error sending message: " + error)
                })
        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ errors: [{ msg: 'Could not save:server side' }] })
    }

})

module.exports = orderdumprouter
