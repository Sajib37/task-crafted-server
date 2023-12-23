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


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const taskCollection = client.db("taskCrafted").collection("tasks")

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
    
    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      const result = await taskCollection.insertOne(newTask);
      res.send(result)
    })

    app.get("/tasks/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await taskCollection.find(query).toArray();
      res.send(result)
    })

    // update a task
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updateTask = req.body;
      const option ={upsert : true}
      
      const task = {
        $set: {
          title: updateTask.title,
          description: updateTask.description,
          deadline: updateTask.deadline,
          priority: updateTask.priority,
          status: updateTask.status,
          email: updateTask.email,
        }
      }
      const result = await taskCollection.updateOne(filter, task, option)
      
      res.send(result)
    })

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
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