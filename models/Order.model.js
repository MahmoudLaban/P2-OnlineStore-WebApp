const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  products: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Product"
      },
      //rename to quantity
      amount: {
        type: Number
      },
    }
  ],
  price: {
    type: Number
  }
})
//Add data model to presentation similar to Module 2 week 2 lesson
module.exports = model("Order", orderSchema);