const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
// Mongodb Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjslrno.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middleware
app.use(
  cors({
    origin: [
      // "http://localhost:5173",
      "https://programmers-blog-68efb.web.app",
      "https://programmers-blog-68efb.firebaseapp.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);

// parser
app.use(express.json());
app.use(cookieParser());

// define middleware
const tokenChecker = (req, res, next) => {
  const token = req?.cookies?.token;
  // no token = 401 Unauthorized
  if (!token)
    return res.status(401).send({ message: "You don't have authorization" });

  // token available -> verify with jwt
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    // verification failed - 401(Forbidden)
    if (err) return res.status(401).send({ message: "Your token has expired" });

    // token passed verification
    req.user = decoded;
    next();
  });
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Database
    const progDB = client.db("Prog-blogs");
    // Collections
    const allBlogsCol = progDB.collection("allBlogs");
    const wishlistCol = progDB.collection("wishlist");
    const commentsCol = progDB.collection("comments");
    // get total number of blogs
    app.get("/api/v1/totalBlogs", async (req, res) => {
      const total = await allBlogsCol.estimatedDocumentCount();
      res.send({ total });
    });
    // get all blogs :
    /***
     * * situation 1: /api/v1/allBlogs
     * * situation 2: /api/v1/allBlogs?category=<name> # filter by category
     * * situation 3: /api/v1/allBlogs?page=<number>&size=<number> # pagination
     * * situation 4: /api/v1/allBlogs?title=`blogName`  # search
     * * situation 4: /api/v1/allBlogs?title=`blogName`  # search
     */
    app.get("/api/v1/allBlogs", tokenChecker, async (req, res) => {
      const query = {};
      // filter by category
      const category = req.query.category;

      if (category) query["category"] = category;

      // Search By title
      const title = req.query.title;

      if (title) query["title"] = title;

      // Pagination
      const page = Number(req.query.page);
      const size = Number(req.query.size);
      const skip = page * size;
      // console.log(page, size);

      const allBlogs = await allBlogsCol
        .find(query)
        .skip(skip)
        .limit(size)
        .toArray();

      res.send(allBlogs);
    });

    // get the latest 6 blogs
    app.get("/api/v1/latestBlogs", async (req, res) => {
      const latestBlogs = await allBlogsCol
        .find()
        .sort({ timestamp: -1 })
        .limit(6)
        .toArray();

      res.send(latestBlogs);
    });

    // get the top 10 featured blogs based on wordCount of long description
    app.get("/api/v1/featuredBlogs", async (req, res) => {
      const featuredBlogs = await allBlogsCol
        .find()
        .sort({ wordCount: -1 })
        .limit(10)
        .toArray();

      res.send(featuredBlogs);
    });

    // insert blog to database
    app.post("/api/v1/user/create-blog", tokenChecker, async (req, res) => {
      const blog = req.body;
      // console.log(blog);
      const ack = await allBlogsCol.insertOne(blog);
      res.send(ack);
    });

    // update blog in the database
    app.patch(
      "/api/v1/user/update-blog/:blogId",
      tokenChecker,
      async (req, res) => {
        const id = req.params.blogId;
        const query = { _id: new ObjectId(id) };
        const blog = req.body;
        const {
          title,
          author,
          email,
          image,
          category,
          short_description,
          long_description,
          timestamp,
          wordCount,
        } = blog;
        // console.log(blog);
        const updatedDoc = {
          $set: {
            title,
            author,
            email,
            image,
            category,
            short_description,
            long_description,
            timestamp,
            wordCount,
          },
        };
        // console.log(id);
        const result = await allBlogsCol.updateOne(query, updatedDoc);
        res.send(result);
      }
    );

    // wishlist related api

    /**
     * * Find the wishlist for the current user
     * * situation: api/v1/user/wishlist?userMail=abc@gmail.com
     */
    app.get("/api/v1/user/wishlist", tokenChecker, async (req, res) => {
      const userMail = req.query.userMail;
      // console.log(userMail);
      const query = {};
      if (userMail) query["user_email"] = userMail;

      // console.log(query);
      const ack = await wishlistCol.find(query).toArray();
      res.send(ack);
    });

    // add to the wishlist

    app.post("/api/v1/user/add-to-wishlist", tokenChecker, async (req, res) => {
      const wish = req.body;
      const ack = await wishlistCol.insertOne(wish);
      res.send(ack);
    });

    // remove from wishlist
    app.delete(
      "/api/v1/user/remove-from-wishlist/:id",
      tokenChecker,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const ack = await wishlistCol.deleteOne(query);
        res.send(ack);
      }
    );

    // comment related api
    // add a comment to the blog
    // /api/v1/user/create-comment
    app.post("/api/v1/user/create-comment", tokenChecker, async (req, res) => {
      const comment = req.body;
      const ack = await commentsCol.insertOne(comment);
      res.send(ack);
    });

    // find all comment for specific blog
    // /api/v1/allComments/:blogId
    app.get(
      "/api/v1/user/allComments/:blogId",
      tokenChecker,
      async (req, res) => {
        const id = req.params.blogId;
        const query = { blog_id: id };
        const ack = await commentsCol.find(query).toArray();
        res.send(ack);
      }
    );

    // Auth related api
    app.post("/api/v1/access-token", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      
      res.cookie("token", token, {
          httpOnly: true,
          secure: true, // ! make it true before deployment
          sameSite: "none",
        })
        .send({ success: true });
        res.end();
    });

    // clear set token in cookie
    // /api/v1/clear-token
    app.get("/api/v1/clear-token", async (req, res) => {
      // const user = req.body;
      // console.log("logging out", user);
      res.clearCookie("token").send({ success: true });
      res.end();
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Programmer Blog Server is running`);
});

app.listen(port, () => {
  console.log(`Programmers Blog server is listening to port ${port}`);
});
