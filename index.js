const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require("cors");
require('dotenv').config()


// middleWares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f30vajg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
      // all collections are here
      const userCollection = client.db("taskCrafted").collection("users")

      app.post("/users", async (req, res) => {
          const newUser = req.body;
          const query = { email: newUser.email };
          const existingUser = await userCollection.findOne(query);
          if (!existingUser) {
            const result = await userCollection.insertOne(newUser)
            return res.send(result)
          }
          return res.send({ message: "User already exist" });
      })

      app.get("/users", async (req, res) => {
          const result = await userCollection.find().toArray();
          res.send(result)
      })
      app.get("/users/:email", async (req, res) => {
          const email = req.params.email;
          const query = { email: email };
          const result = await userCollection.findOne(query)
          res.send(result)
      })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {


  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})