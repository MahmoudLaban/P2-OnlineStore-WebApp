const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    imagePath: { // Added the image path since we creating a retail shop
      type: String,
      required: true
    }

  },
  {
    timestamps: true
  }
);

module.exports = model("Product", productSchema);
