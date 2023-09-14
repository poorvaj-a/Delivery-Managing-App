const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const orderdumpSchema = new Schema({
  any: {
    type: String,
  }
}, {strict:false});

module.exports  = Orderdump = mongoose.model("Orderdump", orderdumpSchema);
