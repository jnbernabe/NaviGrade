// server.js


require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes'); // Adjust paths accordingly
const courseRoutes = require('./routes/courseRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const { MongoClient, ServerApiVersion } = require('mongodb');
// Import other route files as needed

const app = express();
const PORT = process.env.PORT || 3000;

const uri = "mongodb+srv://jnbernabe:jnbMongod94!@navigrade.sznat3k.mongodb.net/?retryWrites=true&w=majority";

console.log("uri: ", uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.use(express.json());

// Use routes
// app.use('/', (req, res) => {    // Add a default route
//     res.send('Welcome to NaviGrade!');
// })
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/assignments', assignmentRoutes);
// Use other routes as needed

app.listen(PORT, () => {
  console.log(`Server is running on port ${"http://localhost:" + PORT}`);
});
