const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// sifatalam21
// KndqseEzdD4R0IuN


const uri = "mongodb+srv://sifatalam21:KndqseEzdD4R0IuN@cluster0.sml8dnv.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// const collection = client.db("usersDB").collection("users")
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("insertDB");
    const userCollection = database.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const data = await cursor.toArray();
      res.send(data);
    })

    app.get("/users/:id", async (req, res) => {
      console.log("View", req.params.id);
	    const id = req.params.id;
	    const query = {_id: new ObjectId(id)};
	    const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    })

    app.post("/users", async (req, res) => {
        console.log(req.body);
        const user = req.body;
         // Insert the defined document into the "haiku" collection
        const result = await userCollection.insertOne(user);
        // Print the ID of the inserted document
        console.log(`A document was inserted with the _id: ${result.insertedId}`);
        res.send(result);
    })

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};

      const updatedUser = {
        $set: req.body
      };

      const result = await userCollection.updateOne(filter, updatedUser, options);
      console.log(result);
      res.send(result);
    })

    app.delete("/users/:id", async (req, res) => {
      console.log("Delete", req.params.id);
	    const id = req.params.id;
	    const query = {_id: new ObjectId(id)};
	    const result = await userCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server running ok")
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})