const express = require('express')
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');

dotenv.config()
const app = express()
const port = process.env.PORT || 5000
// Mongodb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjslrno.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const progDB = client.db('Prog-blogs');
    const allBlogsCol = progDB.collection('allBlogs');

    // get all blogs : 
    /***
     * * situation 1: /api/v1/allBlogs
     * * situation 1: /api/v1/allBlogs?category=<name>
     */
    app.get('/api/v1/allBlogs', async(req, res) => {
      const query = {};

      const category = req.query.category;

      if (category) {
        query["category"] = category;
      }

      const allBlogs = await allBlogsCol.find(query).toArray();

      res.send(allBlogs);
    })

    // get the latest 6 blogs
    app.get('/api/v1/latestBlogs', async(req, res) => {
      const latestBlogs = await allBlogsCol.find()
                                           .sort({ timestamp: -1 })
                                           .limit(6)
                                           .toArray();
                          
      res.send(latestBlogs);
    })

    // get the top 10 featured blogs based on wordCount of long description
    app.get('/api/v1/featuredBlogs', async(req, res) => {
      const featuredBlogs = await allBlogsCol.find().sort({ wordCount: -1 })
                                          .limit(10).toArray();

      res.send(featuredBlogs);                                          
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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})