const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    status:{
        type: String,
        required: true
    }, order_id:{
        type: String,
        required: true
    }, vendor :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    }, captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    }, customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }, products: {
        type: Array,
        required: true
    }, date_created:{
        type: Date
    }, address : {
        level1 : {
            type : String,
            default : 'NA'
        }, level2 : {
            type : String,
            default : 'NA'
        }, level3 : {
            type : String,
            default : 'NA'
        },
    },date_modified:{
        type: String
    },delivery_date:{
        type : String,
        required : true
    }, total :{
        type: String
    },payment_method_title :{
        type: String
    }, locality_id: {
        type: String
    }, parent_id: {
        type: Number
    }, currency:{
        type: String
    }, prices_include_tax:{
        type: Boolean
    },discount_total :{
        type: String
    }, shipping_total:{
        type: String
    }, cart_tax:{
        type: String
    },total_tax :{
        type: String
    },
    // order_key :{
    //     type: String
    // },
     transaction_id:{
        type: String
    }, customer_note:{
        type: String
    }, cart_hash:{
        type: String
    },tax_lines :{
        type: Array
    }, shipping_lines:{
        type: Array
    }, fee_lines:{
        type: Array
    }, coupon_lines:{
        type: Array
    }, invoice_amount: {
        type: Number,
        default: null
    }
    // postmeta :{
    //     type: Object
    //},
    //  meta_data:{
    //     type: Object
    // }
})

module.exports = Order = mongoose.model("Order", orderSchema)


//sample json

// {
//     "_id": {
//       "$oid": "620008ce71959d462d590e3e"
//     },
//     "order": {
//       "0": {
//         "item_data": {
//           "id": 35,
//           "order_id": 145,
//           "name": "Dosa Batter - 1 KG",
//           "product_id": 37,
//           "variation_id": 0,
//           "quantity": 1,
//           "tax_class": "",
//           "subtotal": "80",
//           "subtotal_tax": "0",
//           "total": "80",
//           "total_tax": "0",
//           "taxes": {
//             "total": [],
//             "subtotal": []
//           },
//           "meta_data": []
//         }
//       },
//       "id": 145,
//       "parent_id": 0,
//       "status": "pending",
//       "currency": "INR",
//       "version": "5.8.0",
//       "prices_include_tax": false,
//       "date_created": {
//         "date": "2022-02-06 17:43:41.000000",
//         "timezone_type": 1,
//         "timezone": "+00:00"
//       },
//       "date_modified": {
//         "date": "2022-02-06 17:43:41.000000",
//         "timezone_type": 1,
//         "timezone": "+00:00"
//       },
//       "discount_total": "0",
//       "discount_tax": "0",
//       "shipping_total": "0",
//       "shipping_tax": "0",
//       "cart_tax": "0",
//       "total": "80.00",
//       "total_tax": "0",
//       "customer_id": 0,
//       "order_key": "wc_order_KJY3WdwwrMOmh",
//       "billing": {
//         "first_name": "kranthi test",
//         "last_name": "",
//         "company": "",
//         "address_1": "",
//         "address_2": "",
//         "city": "",
//         "state": "",
//         "postcode": "",
//         "country": "",
//         "email": "kasamkranthikumar@gmail.com",
//         "phone": "8688366350"
//       },
//       "shipping": {
//         "first_name": "",
//         "last_name": "",
//         "company": "",
//         "address_1": "",
//         "address_2": "",
//         "city": "",
//         "state": "",
//         "postcode": "",
//         "country": "",
//         "phone": ""
//       },
//       "payment_method": "cod",
//       "payment_method_title": "COD",
//       "transaction_id": "",
//       "customer_ip_address": "157.47.61.78",
//       "customer_user_agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
//       "created_via": "checkout",
//       "customer_note": "",
//       "date_completed": null,
//       "date_paid": null,
//       "cart_hash": "95d2b9de6483c3b956b5b5a8d20db92d",
//       "number": "145",
//       "meta_data": [
//         {
//           "id": 1659,
//           "key": "is_vat_exempt",
//           "value": "no"
//         }
//       ],
//       "tax_lines": [],
//       "shipping_lines": [],
//       "fee_lines": [],
//       "coupon_lines": [],
//       "postmeta": {
//         "_order_key": [
//           "wc_order_KJY3WdwwrMOmh"
//         ],
//         "_customer_user": [
//           "0"
//         ],
//         "_payment_method": [
//           "cod"
//         ],
//         "_payment_method_title": [
//           "COD"
//         ],
//         "_customer_ip_address": [
//           "157.47.61.78"
//         ],
//         "_customer_user_agent": [
//           "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
//         ],
//         "_created_via": [
//           "checkout"
//         ],
//         "_cart_hash": [
//           "95d2b9de6483c3b956b5b5a8d20db92d"
//         ],
//         "_billing_first_name": [
//           "kranthi test"
//         ],
//         "_billing_email": [
//           "kasamkranthikumar@gmail.com"
//         ],
//         "_billing_phone": [
//           "8688366350"
//         ],
//         "_order_currency": [
//           "INR"
//         ],
//         "_cart_discount": [
//           "0"
//         ],
//         "_cart_discount_tax": [
//           "0"
//         ],
//         "_order_shipping": [
//           "0"
//         ],
//         "_order_shipping_tax": [
//           "0"
//         ],
//         "_order_tax": [
//           "0"
//         ],
//         "_order_total": [
//           "80.00"
//         ],
//         "_order_version": [
//           "5.8.0"
//         ],
//         "_prices_include_tax": [
//           "no"
//         ],
//         "_billing_address_index": [
//           "kranthi test         kasamkranthikumar@gmail.com 8688366350"
//         ],
//         "_shipping_address_index": [
//           "         "
//         ],
//         "is_vat_exempt": [
//           "no"
//         ],
//         "level_label_1": [
//           "Block Name"
//         ],
//         "level_label_2": [
//           "Flat"
//         ],
//         "level_label_3": [
//           "N/A"
//         ],
//         "level_1": [
//           "EdenA"
//         ],
//         "level_2": [
//           "33"
//         ],
//         "level_3": [
//           "N/A"
//         ],
//         "locality_id": [
//           "5199"
//         ],
//         "captain_id": [
//           "74"
//         ],
//         "date_of_delivery": [
//           "20220209"
//         ]
//       }
//     },
//     "order_unique_id": "81_145",
//     "captain_image_url": "https://chotu.com/vedasrifoods/wp-content/uploads/2021/12/chotu-Hyderabad-Brands-Banner-pic.webp",
//     "vendor_logo_url": "",
//     "vendor_id": 81,
//     "order_id": 145,
//     "order_status": "pending",
//     "vendor_name": " vedasrifoods ",
//     "__v": 0
//   }