const mongoose = require('mongoose');
const uri = "mongodb+srv://gulab:gulab@cluster0.9otpy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client;

async function connectToDb() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    client = await mongoose.connect(uri);

    // Send a ping to confirm a successful connection
    await client.connection.db.admin().command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectToDb;
