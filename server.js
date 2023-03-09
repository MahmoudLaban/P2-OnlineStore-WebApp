// JavaScript code that sets up the server to listen for incoming requests on a port 3000
​
// This line imports the app module from a file called app.js in the current directory. The app module contains the code for defining and configuring the server.
const app = require("./app");
​
// sets the PORT variable to either the value of the PORT environment variable (.env) or 3000 if the environment variable is not set.
// The process.env.PORT expression accesses the PORT environment variable that may be set by the hosting environment. 
// If the environment variable is not set, the expression returns undefined, so the || operator is used to default to 3000.
const PORT = process.env.PORT || 3000;
​
// This line calls the listen() method on the app object, which starts the server listening for incoming requests on the specified port. 
// The first argument to listen() is the port number to listen on, which is the PORT variable we defined earlier.
// The second argument is a callback function that will be executed when the server starts listening.
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
