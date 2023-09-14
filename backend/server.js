const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const port = 4000
const db_name = "backend"

require('dotenv').config()

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

/*The prerequisites we need */




/*APIs we need */
const router = require('./routes/testAPI')
const loginrouter = require('./routes/login')
const orderRouter = require('./routes/order')
const orderdumprouter = require('./routes/orderdump');
const transactionsRouter = require('./routes/transactions');

/*Connecting to the MongoDb server */
mongoose.connect("mongodb://127.0.0.1:27017/"+db_name, {useNewUrlParser: true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB connection success");
})


/* Using the APIs we need */
app.use("/login", loginrouter);
app.use('/testAPI', router);
app.use('/order', orderRouter)
app.use("/orderdump",orderdumprouter);
app.use("/transactions",transactionsRouter);

app.listen(port, () => {
    console.log("server running on port: "+ port)
})
