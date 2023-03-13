/*

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
      }
    }
  ],
  price: {
    type: Number
  }
})
//Add data model to presentation similar to Module 2 week 2 lesson
module.exports = model("Order", orderSchema);

*/

const { Schema, model } = require("mongoose");

// Define the order schema
const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User" // Reference to the User model
  },
  products: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Product" // Reference to the Product model
      },
      quantity: {
        type: Number
      }
    }
  ],
  price: {
    type: Number
  }
});

// Export the Order model
module.exports = model("Order", orderSchema);
