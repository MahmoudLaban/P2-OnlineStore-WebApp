// -----> CART <-----

// Exports the cart function that takes an oldCart object as an argument

module.exports = function Cart(oldCart) {
    'use strict';

class Cart {
  constructor(oldCart) {
    // These three lines initialize the items in the cart with the values from oldCart or with default values.
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  }
  // Adding an item to the cart and takes the item and id parameters.
  add(item, id) {
    // check if an item with the specified id already exists in the cart, and if not, it initializes a new storedItem.
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    // these lines increment the quantity of the storeItem, calculate the new price of the stored item and update the total quantity.
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  }

  // Reducing the quantity of the item in the cart by one and takes an id.
  reduceByOne(id) {
    // decrementing the quantity, calculate the new price and update the total quantity and total price.
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;

    // check if the quantity is less than or equal to zero nd if so, it removes the item from the cart.
    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  }

  removeItem(id) {
    // subtract the quantity and price of the item from the total quantity and total price of the cart....then remove the item from the cart.
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  }

  // generating and array of items in the cart.
  generateArray() {
    // initialize the epty array and loop through the items and push each item into the array....finally, it returns the array.
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  }
}

// Closing the cart.
module.exports = Cart;
}