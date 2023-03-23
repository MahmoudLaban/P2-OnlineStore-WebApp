const mongoose = require("mongoose");

const connectDB = async () => { // Imports the Mongoose library which is a MongoDB object modeling tool designed to work in an asynchronous environment.
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost/super market";
    await mongoose
      .connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .catch((error) => console.log(error)); // Catches and logs any errors that occur during the connection process.
    const connection = mongoose.connection; // Gets the default connection object from Mongoose.
    console.log("MONGODB CONNECTED SUCCESSFULLY!"); // Logs a message to the console indicating that the MongoDB connection was successful.
  } catch (error) { // Gets the default connection object from Mongoose.
    console.log(error); // Logs any errors that occur during the connection process and returns them to the caller.
    return error;
  }
};

module.exports = connectDB; // Exports the connectDB function to be used by other modules in the application.
